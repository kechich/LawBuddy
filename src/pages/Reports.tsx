import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Download, RefreshCw, Sparkles, FileSpreadsheet, ChevronRight } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useSpaces } from "@/contexts/SpacesContext";
import { supabase } from "@/integrations/supabase/client";
import { LawItem } from "@/lib/lawData";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Reports = () => {
  const { user, profile } = useAuth();
  const { activeSpace } = useSpaces();
  const [laws, setLaws] = useState<LawItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const navigate = useNavigate();

  const fetchFeed = useCallback(async () => {
    if (!user || !activeSpace) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-feed", {
        body: { space_id: activeSpace.id, tab: "published", force_refresh: false },
      });
      if (error) throw error;
      if (Array.isArray(data?.laws) && data.laws.length > 0) {
        setLaws(data.laws as LawItem[]);
      }
    } catch (err) {
      console.error("Feed fetch error:", err);
      toast.error("Failed to load feed data for export.");
    } finally {
      setLoading(false);
      setFetched(true);
    }
  }, [user, activeSpace]);

  useEffect(() => {
    if (!fetched) fetchFeed();
  }, [fetchFeed, fetched]);

  useEffect(() => {
    setFetched(false);
    setLaws([]);
  }, [activeSpace?.id]);

  const exportCSV = () => {
    if (laws.length === 0) { toast.error("No data to export."); return; }
    const headers = ["Title", "Category", "Date", "Status", "Impact", "Summary", "Full Text", "How It Affects You", "Key Points", "Action Items", "Source", "Original Legal Text"];
    const esc = (s: string) => `"${(s || "").replace(/"/g, '""')}"`;
    const rows = laws.map((l) => [
      esc(l.title), l.category, l.date, l.status, l.impact,
      esc(l.summary), esc(l.fullText), esc(l.howItAffectsYou),
      esc((l.keyPoints || []).join("; ")),
      esc((l.whatYouCanDo || []).join("; ")),
      esc(l.source),
      esc(l.originalLegalText || ""),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compliance-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded!");
  };

  // Helper to add a section with page-break awareness
  const addSection = (doc: jsPDF, title: string, content: string | string[], y: number, pageWidth: number, isList = false): number => {
    const maxY = 270;
    if (y > maxY - 20) { doc.addPage(); y = 25; }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 64, 120);
    doc.text(title, 14, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(40);

    if (isList && Array.isArray(content)) {
      content.forEach((item, i) => {
        const prefix = `${i + 1}. `;
        const lines = doc.splitTextToSize(`${prefix}${item}`, pageWidth - 28);
        if (y + lines.length * 4.5 > maxY) { doc.addPage(); y = 25; }
        doc.text(lines, 14, y);
        y += lines.length * 4.5 + 2;
      });
    } else {
      const text = Array.isArray(content) ? content.join("\n") : content;
      const lines = doc.splitTextToSize(text, pageWidth - 28);
      lines.forEach((line: string) => {
        if (y > maxY) { doc.addPage(); y = 25; }
        doc.text(line, 14, y);
        y += 4.5;
      });
    }
    return y + 4;
  };

  const exportPDF = () => {
    if (laws.length === 0) { toast.error("No data to export."); return; }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const companyName = profile?.company_name || "Compliance Report";

    // ── Cover page ──
    doc.setFillColor(20, 50, 100);
    doc.rect(0, 0, pageWidth, 80, "F");

    doc.setTextColor(255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(companyName, 14, 35);

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Legislative Compliance Report", 14, 48);

    doc.setFontSize(10);
    doc.text(dateStr, 14, 60);
    if (activeSpace) {
      doc.text(`Space: ${activeSpace.name}`, 14, 68);
    }

    // Summary stats
    doc.setTextColor(0);
    doc.setFontSize(10);
    let cy = 95;
    const highCount = laws.filter(l => l.impact === "high").length;
    const medCount = laws.filter(l => l.impact === "medium").length;
    const lowCount = laws.filter(l => l.impact === "low").length;

    doc.setFont("helvetica", "bold");
    doc.text("EXECUTIVE SUMMARY", 14, cy);
    cy += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`This report covers ${laws.length} legislative items relevant to your organization.`, 14, cy);
    cy += 6;
    doc.text(`Impact breakdown:  ${highCount} High  ·  ${medCount} Medium  ·  ${lowCount} Low`, 14, cy);
    cy += 6;
    doc.text(`Categories: ${[...new Set(laws.map(l => l.category))].join(", ")}`, 14, cy);
    cy += 12;

    // Divider
    doc.setDrawColor(200);
    doc.line(14, cy, pageWidth - 14, cy);
    cy += 6;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("TABLE OF CONTENTS", 14, cy);
    cy += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    laws.forEach((law, i) => {
      if (cy > 270) { doc.addPage(); cy = 25; }
      const impactTag = law.impact === "high" ? "[HIGH]" : law.impact === "medium" ? "[MED]" : "[LOW]";
      doc.text(`${i + 1}. ${impactTag} ${law.title}`, 18, cy);
      cy += 5.5;
    });

    // ── Summary table page ──
    doc.addPage();
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 50, 100);
    doc.text("OVERVIEW TABLE", 14, 20);

    autoTable(doc, {
      startY: 28,
      head: [["#", "Title", "Category", "Impact", "Date", "Status"]],
      body: laws.map((l, i) => [String(i + 1), l.title, l.category, l.impact.toUpperCase(), l.date, l.status]),
      headStyles: { fillColor: [20, 50, 100], fontSize: 8, fontStyle: "bold" },
      bodyStyles: { fontSize: 7.5, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 58 },
        2: { cellWidth: 28 },
        3: { cellWidth: 18 },
        4: { cellWidth: 24 },
        5: { cellWidth: 30 },
      },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      margin: { left: 14, right: 14 },
    });

    // ── Detail pages ──
    laws.forEach((law, idx) => {
      doc.addPage();
      const pw = pageWidth;

      // Header bar
      doc.setFillColor(20, 50, 100);
      doc.rect(0, 0, pw, 14, "F");
      doc.setTextColor(255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`${companyName}  ·  Compliance Report  ·  ${dateStr}`, 14, 9);
      doc.text(`${idx + 1} / ${laws.length}`, pw - 14 - doc.getTextWidth(`${idx + 1} / ${laws.length}`), 9);

      // Title
      let y = 24;
      doc.setTextColor(0);
      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      const titleLines = doc.splitTextToSize(law.title, pw - 28);
      doc.text(titleLines, 14, y);
      y += titleLines.length * 7 + 4;

      // Meta line
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      const meta = [law.category, law.date, `Impact: ${law.impact.toUpperCase()}`, law.status];
      if (law.effectiveDate) meta.push(`Effective: ${law.effectiveDate}`);
      if (law.isStillActive !== undefined) meta.push(law.isStillActive ? "✓ Currently in effect" : "✗ No longer active");
      doc.text(meta.join("  ·  "), 14, y);
      y += 10;

      // Summary
      y = addSection(doc, "SUMMARY", law.summary, y, pw);

      // Full text / explanation
      if (law.fullText) {
        y = addSection(doc, "DETAILED EXPLANATION", law.fullText, y, pw);
      }

      // Business impact
      if (law.howItAffectsYou) {
        y = addSection(doc, "BUSINESS IMPACT ASSESSMENT", law.howItAffectsYou, y, pw);
      }

      // Key points
      if (law.keyPoints?.length) {
        y = addSection(doc, "KEY COMPLIANCE POINTS", law.keyPoints, y, pw, true);
      }

      // Action items
      if (law.whatYouCanDo?.length) {
        y = addSection(doc, "RECOMMENDED ACTIONS", law.whatYouCanDo, y, pw, true);
      }

      // Original legal text
      if (law.originalLegalText) {
        if (y > 240) { doc.addPage(); y = 25; }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(30, 64, 120);
        doc.text("ORIGINAL LEGAL TEXT", 14, y);
        y += 7;

        // Draw a subtle background box
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(60);
        const legalLines = doc.splitTextToSize(law.originalLegalText, pw - 36);
        const boxH = legalLines.length * 4 + 8;
        if (y + boxH > 270) { doc.addPage(); y = 25; }
        doc.setFillColor(248, 249, 250);
        doc.setDrawColor(200);
        doc.roundedRect(14, y - 3, pw - 28, boxH, 2, 2, "FD");
        doc.text(legalLines, 18, y + 4);
        y += boxH + 4;

        // Source
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(120);
        doc.text(`Source: ${law.source}`, 14, y);
      }
    });

    // ── Footer on every page ──
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(150);
      doc.text(
        `${companyName} — Confidential — Page ${i} of ${pageCount}`,
        pageWidth / 2,
        292,
        { align: "center" }
      );
    }

    doc.save(`${companyName.replace(/\s+/g, "-").toLowerCase()}-compliance-report-${now.toISOString().slice(0, 10)}.pdf`);
    toast.success("PDF downloaded!");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-3xl">
        <AppHeader />

        <div className="px-5 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Compliance Reports</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Export your personalized law feed as PDF or CSV for board meetings and compliance reviews.
            {activeSpace && (
              <span className="ml-1 text-primary font-medium">· {activeSpace.name}</span>
            )}
          </p>
        </div>

        {/* Export buttons */}
        <div className="px-5 mb-6 flex flex-wrap gap-3">
          <Button onClick={exportPDF} disabled={loading || laws.length === 0} className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={exportCSV} disabled={loading || laws.length === 0} className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setFetched(false); }}
            disabled={loading}
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Preview */}
        <div className="px-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Preview ({laws.length} laws)</h3>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl bg-card border border-border p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          ) : laws.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No feed data available yet. Make sure you have an active space.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {laws.map((law) => (
                <div
                  key={law.slug}
                  onClick={() => navigate(`/law/${law.slug}`, { state: { law } })}
                  className="rounded-xl bg-card border border-border p-4 cursor-pointer transition-all hover:shadow-md hover:border-primary/30 active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-primary">{law.category}</span>
                    <span className="text-[10px] text-muted-foreground">{law.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-card-foreground mb-1">{law.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{law.summary}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        law.impact === "high" ? "bg-destructive/10 text-destructive" :
                        law.impact === "medium" ? "bg-yellow-500/10 text-yellow-600" :
                        "bg-green-500/10 text-green-600"
                      }`}>
                        {law.impact.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{law.status}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Reports;
