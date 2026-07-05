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
    const { space_id, messages } = body;

    if (!space_id || !Array.isArray(messages) || messages.length === 0) {
      return jsonResponse({ error: "space_id and messages array are required" }, 400);
    }

    // Fetch space profile
    const { data: space, error: spaceError } = await supabase
      .from("spaces")
      .select("*")
      .eq("id", space_id)
      .eq("user_id", userId)
      .maybeSingle();

    if (spaceError || !space) {
      return jsonResponse({ error: "Space not found" }, 404);
    }

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

    const systemPrompt = `You are BuddyChat, a friendly and knowledgeable AI assistant specialized in German law and policy.
You are personalized for this user profile:
${profileContext}

INSTRUCTIONS:
- Always answer in the context of the user's specific situation (location, roles, concerns).
- Be helpful, concise, and accurate.
- Cite real German laws, regulations, or official sources when relevant.
- If you're unsure about something, say so honestly.
- Use plain language — avoid unnecessary legal jargon.
- You can answer in English or German depending on the language the user writes in.`;

    const TNG_API_KEY = Deno.env.get("TNG_API_KEY");
    const TNG_TEAM_NAME = Deno.env.get("TNG_TEAM_NAME") || "default";
    if (!TNG_API_KEY) {
      return jsonResponse({ error: "TNG API key not configured" }, 500);
    }

    // Build messages array with system prompt
    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const aiResponse = await fetch("https://external.model.tngtech.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TNG_API_KEY}`,
        "Content-Type": "application/json",
        "x-user-agent": `tum.ai/${TNG_TEAM_NAME}`,
      },
      body: JSON.stringify({
        model: "tngtech/R1T2-Chimera-Speed",
        messages: chatMessages,
        temperature: 0.7,
        max_completion_tokens: 2000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("TNG API error:", aiResponse.status, errorText);
      return jsonResponse({ error: "AI generation failed" }, 500);
    }

    const aiData = await aiResponse.json();
    let reply = aiData.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
    
    // Strip <think>...</think> reasoning tags from R1-style models
    reply = reply.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    return jsonResponse({ reply });
  } catch (e) {
    console.error("buddy-chat error:", e);
    return jsonResponse(
      { error: e instanceof Error ? e.message : "Unknown error" },
      500
    );
  }
});
