import { useState } from "react";
import { motion } from "framer-motion";
import {
  Newspaper, Scale, FolderOpen, BarChart3, MessageCircleQuestion, Mail,
  ShieldCheck, Building2, Users, FileSearch, Download,
} from "lucide-react";

const citizenFeatures = [
  {
    icon: Newspaper,
    title: "Personalized law feed",
    description: "A curated feed of laws and proposals relevant to your life, location, and interests.",
  },
  {
    icon: Scale,
    title: "Published vs. under discussion",
    description: "Know which laws are already enacted and which ones are still being debated.",
  },
  {
    icon: FolderOpen,
    title: "Category-based browsing",
    description: "Filter by Housing, Work, Mobility, Taxes, Benefits, and more.",
  },
  {
    icon: BarChart3,
    title: "Personal impact markers",
    description: "Instantly see whether a law has low, medium, or high relevance to your situation.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Follow-up Q&A",
    description: "Ask questions about any law and get clear, plain-language answers.",
  },
  {
    icon: Mail,
    title: "Newsletter updates",
    description: "Weekly digest of the laws that matter most to you, delivered to your inbox.",
  },
];

const businessFeatures = [
  {
    icon: ShieldCheck,
    title: "Regulatory compliance monitoring",
    description: "Track regulations that affect your industry and get alerted before deadlines hit.",
  },
  {
    icon: Building2,
    title: "Industry-specific tracking",
    description: "Filter laws by sector — finance, healthcare, construction, tech, and more.",
  },
  {
    icon: Users,
    title: "Team accounts & shared spaces",
    description: "Collaborate with your compliance, legal, and operations teams in one workspace.",
  },
  {
    icon: FileSearch,
    title: "Audit trail & history",
    description: "Full history of regulatory changes with timestamps for your compliance records.",
  },
  {
    icon: Download,
    title: "Bulk exports & reports",
    description: "Export regulatory summaries as PDF or CSV for board reports and audits.",
  },
  {
    icon: Mail,
    title: "Priority daily digests",
    description: "Get daily email updates on regulatory changes relevant to your business.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08 },
  }),
};

const Features = () => {
  const [tab, setTab] = useState<"citizens" | "business">("citizens");
  const features = tab === "citizens" ? citizenFeatures : businessFeatures;

  return (
    <section id="product" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-14 text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
            Everything you need to stay informed
          </h2>
          <p className="mt-3 max-w-lg mx-auto text-sm text-muted-foreground sm:text-base">
            Law Buddy gives you the tools to understand what's happening in legislation — and why it matters to you.
          </p>

          <div className="mt-8 inline-flex rounded-full border border-border bg-muted/50 p-1">
            <button
              onClick={() => setTab("citizens")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                tab === "citizens"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              For Citizens
            </button>
            <button
              onClick={() => setTab("business")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                tab === "business"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              For Businesses
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="group rounded-xl border border-border bg-card p-6 shadow-[0_1px_3px_0_rgb(0_0_0/0.04)] transition-shadow hover:shadow-[0_2px_8px_0_rgb(0_0_0/0.06)]"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/8 transition-colors group-hover:bg-primary/12">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-serif text-base font-bold text-foreground">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
