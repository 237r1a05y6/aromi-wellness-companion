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

    const prompt = `Create a structured 7-day workout plan:
- Fitness Goal: ${body.fitness_goal}
- Location: ${body.workout_location}
- Level: ${body.fitness_level}
- Daily Time: ${body.daily_time} minutes

FORMAT RULES — NEVER use markdown tables. Use bullet points for ALL data.

For each day use this structure:

## 📅 Day X — [Focus Area]

### ⏰ Schedule
- **0:00 - 0:05** — Warmup
- **0:05 - 0:35** — Main Workout
- **0:35 - 0:40** — Cooldown

### 🔥 Warmup (5 min)
- Exercise — duration/reps

### 💪 Main Workout
For each exercise:
- **Exercise Name** — Sets × Reps, Rest: 60s, Tempo: 2-1-2, Tip: form cue

💧 **Water Break** every 10-15 min

### 🧘 Cooldown (5 min)
- Stretch — Hold 30s

### 💡 Daily Tip
- One actionable tip

---

At the end:
## 📊 Weekly Summary
- **Mon** — Upper Body, ${body.daily_time} min, Moderate
- (repeat for each day)

## 🎯 Key Reminders
- Rest day guidance
- Progressive overload tips
- Hydration targets`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are an expert personal trainer. Create detailed, safe, and effective workout plans. Always use markdown tables for schedules. Use emojis for section headers. Be precise with timings, rest periods, and tempo." },
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
    const plan = data.choices?.[0]?.message?.content || 'Failed to generate plan';

    return new Response(JSON.stringify({ plan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
