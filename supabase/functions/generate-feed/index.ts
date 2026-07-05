import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const jsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    const userId = claimsData.claims.sub;

    const body = await req.json();
    const space_id = body?.space_id;
    const tab = body?.tab;
    const force_refresh = Boolean(body?.force_refresh);
    const mode = body?.mode || "default"; // "default" | "time_period" | "random"
    const date_from = body?.date_from;
    const date_to = body?.date_to;
    const category = body?.category; // optional category filter

    if (!space_id || (tab !== "published" && tab !== "discussion")) {
      return jsonResponse({ error: "space_id and valid tab are required" }, 400);
    }

    // Only use cache for default mode
    if (mode === "default" && !force_refresh) {
      const { data: cached, error: cacheError } = await supabase
        .from("feed_cache")
        .select("laws_json, created_at")
        .eq("space_id", space_id)
        .eq("tab", tab)
        .maybeSingle();

      if (!cacheError && cached) {
        const cacheAge = Date.now() - new Date(cached.created_at).getTime();
        const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
        if (cacheAge < TWENTY_FOUR_HOURS) {
          return jsonResponse({ laws: cached.laws_json, cached: true, fallback: false });
        }
      }
    }

    const { data: space, error: spaceError } = await supabase
      .from("spaces")
      .select("*")
      .eq("id", space_id)
      .eq("user_id", userId)
      .maybeSingle();

    if (spaceError || !space) {
      return jsonResponse({ error: "Space not found" }, 404);
    }

    const statusFilter = tab === "published" ? "Published" : "Under Discussion";
    const profileContext = [
      space.bundesland ? `Region/Bundesland: ${space.bundesland}` : null,
      space.city ? `City: ${space.city}` : null,
      space.primary_roles?.length ? `Primary roles: ${space.primary_roles.join(", ")}` : null,
      space.persona_type ? `Persona type: ${space.persona_type}` : null,
      space.housing_situation?.length ? `Housing situation: ${space.housing_situation.join(", ")}` : null,
      space.work_study_status?.length ? `Work/study status: ${space.work_study_status.join(", ")}` : null,
      space.key_concerns?.length ? `Key concerns: ${space.key_concerns.join(", ")}` : null,
      space.income_level ? `Income level: ${space.income_level}` : null,
      space.custom_instructions ? `Special instructions: ${space.custom_instructions}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    // Build time period instruction based on mode
    let timePeriodInstruction: string;
    if (mode === "random") {
      timePeriodInstruction = `Pick a law from ANY time period in German legal history (it can be from the 1990s, 2000s, 2010s, or 2020s — surprise the user). Make it interesting and relevant to the user's profile.`;
    } else if (mode === "time_period") {
      const parts = [];
      if (date_from && date_to) parts.push(`from the time period ${date_from} to ${date_to}`);
      if (category) parts.push(`in the category "${category}"`);
      timePeriodInstruction = parts.length > 0
        ? `Focus ONLY on German laws ${parts.join(" and ")}. The law must have been enacted, amended, or actively discussed within this scope.`
        : `Focus ONLY on the LATEST and MOST RECENT German laws from 2025.`;
    } else {
      timePeriodInstruction = `Focus ONLY on the LATEST and MOST RECENT German laws from 2025 (or late 2024 at the earliest). Do NOT include older laws.`;
    }

    const currentDate = new Date().toISOString().split("T")[0]; // e.g. "2025-04-11"

    const systemPrompt = `You are a German legal expert. Today's date is ${currentDate}.

CRITICAL ACCURACY RULES — READ CAREFULLY:
- You MUST only reference REAL German laws that actually exist. Do NOT invent or fabricate laws.
- Every law you mention must have a real official name (in German) that can be verified in the Bundesgesetzblatt or official government sources.
- Include the official German name of the law in the "source" field (e.g., "Mietpreisbremse — BGB §556d" or "BAföG §13").
- The "date" field must reflect the ACTUAL date the law was published, amended, or entered force — not a made-up date.
- If you are not sure a law exists or its exact date, DO NOT include it. It is better to return fewer accurate laws than 6 fabricated ones.
- Do NOT backdate laws. If a law was enacted in 2019, its date must say 2019, not 2025.

ALL OUTPUT MUST BE IN ENGLISH. Translate German law names into English for title/summary, but keep the original German law reference in "source".

USER PROFILE:
${profileContext}

INSTRUCTIONS:
1. Generate up to 6 law items with status "${statusFilter}" that are MOST RELEVANT to the user's profile. Pick the 6 most important/impactful real laws regardless of category — multiple laws in the same category is fine. Then assign the correct category to each. Only include laws you are confident are real.
2. ${timePeriodInstruction}
3. For "${statusFilter === "Published" ? "Published" : "Under Discussion"}" items:
   - ${statusFilter === "Published" ? "Pick laws that were recently enacted, amended, or came into effect. Use their REAL enactment/amendment dates." : "Pick bills or proposals currently being debated. Use their REAL introduction/discussion dates."}
4. Categories: "Housing", "Employment", "Tax", "Education", "Immigration", "Healthcare", "Consumer Protection", "Digital Rights", "Social Benefits", "Transportation", "Environment", "Family", "Energy".
5. "howItAffectsYou": written in second person, addressing the user based on their profile.
6. "whatYouCanDo": 3-4 actionable steps.
7. "keyPoints": 3-5 key points.
8. "impact": "high", "medium", or "low".
9. "fullText": 2-3 paragraphs, plain language, IN ENGLISH.
10. "source": Must contain the real German law name and section reference (e.g., "Wohngeldgesetz (WoGG) §1" or "Mindestlohngesetz (MiLoG)").
11. "date": The REAL date this law was published/amended. Format: "Mon DD, YYYY".
12. "effectiveDate": The REAL date it took/takes effect, or null if unknown.
13. "isStillActive" (boolean): whether this law is currently in effect as of ${currentDate}.
14. "activeStatusNote": e.g., "In effect since Jan 1, 2024" or "Repealed by XYZ in 2023".
15. Generate a URL-friendly slug from the title.
16. "originalLegalText": Include a direct quote or close paraphrase of the relevant section from the original German legal text (in German) that your explanation is based on. Include the paragraph/section number (e.g., "§556d BGB: Die zulässige Miete..."). Keep it to 1-3 paragraphs max.

Return ONLY a valid JSON array. No markdown, no explanation. Each item:
{
  "slug": "string",
  "category": "string",
  "title": "string",
  "summary": "string",
  "date": "string",
  "status": "${statusFilter}",
  "impact": "high" | "medium" | "low",
  "fullText": "string",
  "keyPoints": ["string", ...],
  "howItAffectsYou": "string",
  "whatYouCanDo": ["string", ...],
  "source": "string (official German law name + section)",
  "effectiveDate": "string or null",
  "isStillActive": true | false,
  "activeStatusNote": "string",
  "originalLegalText": "string (German legal text excerpt with section reference)"
}`;

    const TNG_API_KEY = Deno.env.get("TNG_API_KEY");
    const TNG_TEAM_NAME = Deno.env.get("TNG_TEAM_NAME") || "default";
    if (!TNG_API_KEY) {
      return jsonResponse({ error: "TNG API key not configured" }, 500);
    }

    const userContent = mode === "random"
      ? `Generate 1 random but relevant REAL German law from any era for this profile. Only include a law you are 100% sure exists. Include its real German law name in the source field. Return only JSON array.`
      : mode === "time_period"
      ? `Generate 1 REAL German law${category ? ` in the "${category}" category` : ""}${date_from && date_to ? ` from the period ${date_from} to ${date_to}` : ""} for this profile. Only include laws you are certain exist. Include the official German law name and section in the source field. Return only JSON array.`
      : `Generate up to 6 REAL, VERIFIED German law items that are ${statusFilter === "Published" ? "recently enacted or amended (2024-2025)" : "currently under discussion (2024-2025)"} and MOST RELEVANT to this user's profile. Pick the 6 most important laws — they do NOT need to be in different categories. Categorize each one appropriately. Only include laws you are CERTAIN are real — do not fabricate. Use their REAL dates. Include official German law references in the source field. Return ONLY a JSON array. It's OK to return fewer than 6 if you can't find 6 real ones.`;

    const aiResponse = await fetch("https://external.model.tngtech.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TNG_API_KEY}`,
        "Content-Type": "application/json",
        "x-user-agent": `tum.ai/${TNG_TEAM_NAME}`,
      },
      body: JSON.stringify({
        model: "tngtech/R1T2-Chimera-Speed",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        temperature: mode === "random" ? 0.8 : 0.3,
        max_completion_tokens: 8000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("TNG API error:", aiResponse.status, errorText);

      if (aiResponse.status === 401 || aiResponse.status === 403) {
        return jsonResponse({ error: "AI provider authentication failed", fallback: true, laws: [] }, 200);
      }
      if (aiResponse.status === 429) {
        return jsonResponse({ error: "AI provider rate limited", fallback: true, laws: [] }, 200);
      }

      return jsonResponse({ error: "AI generation failed", fallback: true, laws: [] }, 200);
    }

    const aiData = await aiResponse.json();

    // Check for truncation
    const finishReason = aiData.choices?.[0]?.finish_reason;
    if (finishReason === "length") {
      console.error("AI response was truncated (finish_reason: length)");
    }

    let content = aiData.choices?.[0]?.message?.content || "[]";
    content = content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
    content = content.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();

    let laws: unknown[] = [];
    try {
      const parsed = JSON.parse(content);
      if (!Array.isArray(parsed)) {
        throw new Error("AI output is not an array");
      }
      laws = parsed;
    } catch {
      console.error("Failed to parse AI response:", content.slice(0, 500));
      return jsonResponse({ error: "Failed to parse AI response", fallback: true, laws: [] }, 200);
    }

    // Validate: filter out laws missing critical fields or with obviously bad data
    laws = laws.filter((law: any) => {
      if (!law?.title || !law?.slug || !law?.summary || !law?.source) return false;
      // Filter out laws with clearly fabricated sources (too short or generic)
      if (law.source.length < 5) return false;
      return true;
    });

    // Only cache default mode
    if (mode === "default") {
      const { error: upsertError } = await supabase.from("feed_cache").upsert(
        {
          space_id,
          tab,
          laws_json: laws,
          created_at: new Date().toISOString(),
        },
        { onConflict: "space_id,tab" }
      );

      if (upsertError) {
        console.error("Cache upsert failed:", upsertError.message);
      }
    }

    return jsonResponse({ laws, cached: false, fallback: false });
  } catch (e) {
    console.error("generate-feed error:", e);
    return jsonResponse(
      { error: e instanceof Error ? e.message : "Unknown error", fallback: true, laws: [] },
      200
    );
  }
});
