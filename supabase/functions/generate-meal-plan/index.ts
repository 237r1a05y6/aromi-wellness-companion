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

    const planDays = body.plan_days || 7;
    const prompt = `Create a structured ${planDays}-day meal plan:
- Daily Calorie Target: ${body.calorie_target} kcal
- Diet Preference: ${body.diet_preference}
- Allergies: ${body.allergies || 'None'}
- Cuisine Preference: ${body.cuisine_preference}

FORMAT RULES — NEVER use markdown tables. Use bullet points for ALL data.

For each day:

## 📅 Day X — [Theme]

### ⏰ Daily Schedule
- **7:00 AM** — Breakfast, ~450 kcal, Prep: 10 min, Cook: 15 min
- **10:00 AM** — Morning Snack, ~150 kcal, Prep: 5 min
- **1:00 PM** — Lunch, ~550 kcal, Prep: 15 min, Cook: 20 min
- **4:00 PM** — Afternoon Snack, ~150 kcal, Prep: 5 min
- **7:00 PM** — Dinner, ~500 kcal, Prep: 15 min, Cook: 25 min

💧 **Hydration**: 250ml water between each meal

### 🍳 Breakfast — [Meal Name] (7:00 AM)
- **Ingredients:** list with quantities
- **Instructions:** concise steps
- **Macros:** 450 kcal, Protein: 25g, Carbs: 50g, Fat: 15g, Fiber: 8g

(Repeat for each meal)

### 📊 Daily Totals
- **Calories:** ${body.calorie_target} kcal
- **Protein / Carbs / Fat / Fiber:** Xg each
- **Water:** 2.5L

---

At the end:

## 🛒 Weekly Grocery List
- **Proteins:** ...
- **Vegetables:** ...
- **Fruits:** ...
- **Grains & Carbs:** ...
- **Dairy/Alternatives:** ...
- **Pantry Staples:** ...

## 🍽️ Meal Prep Tips
- What to prep on Sunday
- Storage tips
- Quick substitutions

## 📊 Weekly Macro Summary
- **Day 1** — Calories: X, Protein: Xg, Carbs: Xg, Fat: Xg
- (repeat for each day)`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are an expert nutritionist and meal planner. Create detailed, balanced, and delicious meal plans. NEVER use markdown tables — use bullet points for all data. Use emojis for section headers. Include specific timings, prep/cook times, and portion sizes." },
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
