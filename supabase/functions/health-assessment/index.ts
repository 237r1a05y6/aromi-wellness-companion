import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `Analyze this health assessment and provide a structured, detailed report.

User data:
- Age: ${body.age}
- Stress Level: ${body.stress_level}/10
- Sleep Hours: ${body.sleep_hours}
- Water Intake: ${body.water_intake} liters/day
- Diet Type: ${body.diet_type}
- Activity Level: ${body.activity_level}
- Health Goal: ${body.health_goal}
- BP Status: ${body.bp_status}
- Diabetes Status: ${body.diabetes_status}

Respond using this exact JSON format (no markdown, just JSON):
{
  "wellness_score": <number 0-100>,
  "analysis": "<structured markdown analysis using the format below>",
  "suggestions": ["suggestion 1", "suggestion 2", ...]
}

The "analysis" field MUST use this markdown structure. NEVER use markdown tables — use bullet points only.

## 📊 Overall Assessment
Brief 2-3 sentence overview.

## 🔍 Category Breakdown

### 😴 Sleep Quality — Score: X/10
- Key finding and recommendation (2-3 bullets)

### 🥗 Nutrition — Score: X/10
- Key finding and recommendation

### 🏃 Physical Activity — Score: X/10
- Key finding and recommendation

### 🧠 Stress & Mental Health — Score: X/10
- Key finding and recommendation

### 💧 Hydration — Score: X/10
- Key finding and recommendation

### ❤️ Vital Signs — Status: [Normal/Attention Needed]
- BP and diabetes analysis

## 📈 Improvement Timeline
- **Week 1** — Focus: X, Target: Y, Expected: Z
- **Week 2** — Focus: X, Target: Y, Expected: Z
- **Week 3** — Focus: X, Target: Y, Expected: Z
- **Week 4** — Focus: X, Target: Y, Expected: Z

The "suggestions" array should contain 5-7 specific, prioritized action items ranked by health impact. Each suggestion starts with [HIGH], [MEDIUM], or [LOW].`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are an expert health analyst. Respond ONLY with valid JSON, no markdown code blocks. The analysis field should contain rich markdown formatting." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { wellness_score: 65, analysis: content, suggestions: ["Complete a more detailed assessment for better results."] };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
