import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const profileContext = profile
      ? `User profile: Name: ${profile.name || 'Unknown'}, Age: ${profile.age || 'Unknown'}, Fitness level: ${profile.fitness_level || 'Unknown'}, Health goal: ${profile.health_goal || 'Unknown'}, Diet: ${profile.diet_preference || 'Unknown'}, Weight: ${profile.weight || 'Unknown'}kg, Height: ${profile.height || 'Unknown'}cm.`
      : '';

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are AroMi, an expert AI health and fitness coach. You provide personalized advice on workouts, nutrition, meal planning, stress management, sleep optimization, and overall wellness.

FORMATTING RULES — Always follow these:
1. Use clear markdown headers (##, ###) to organize responses
2. Use bullet points for ALL data — NEVER use markdown tables
3. Use bold (**text**) for key terms
4. Include relevant emojis for section headers (🏋️ 🥗 💧 😴 🧠 etc.)
5. Keep responses SHORT and CONCISE — max 200 words unless user asks for detail
6. Prioritize actionable points over lengthy explanations
7. End with one motivational line

Be encouraging, specific, and actionable. ${profileContext}`,
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
