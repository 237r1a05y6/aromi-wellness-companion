

# Plan: Voice Assistant, Email Sharing, PDF Download, and Structured Output

## Summary
Add four capabilities across all content sections: (1) a floating voice assistant powered by AI, (2) email sharing via `mailto:` links, (3) PDF download using browser print, and (4) improved AI prompts for structured, detailed output with timings, breaks, and schedules.

---

## 1. Reusable Share/Download Toolbar Component

Create `src/components/ContentActions.tsx` — a reusable toolbar with three buttons:
- **Download PDF** — uses `window.print()` with a print-specific CSS stylesheet targeting a content container. Simple, no extra dependencies needed.
- **Share via Email** — opens `mailto:` with pre-filled subject and body text (plain-text summary of the content).
- **Copy to Clipboard** — copies the markdown/text content.

This toolbar will be added to every results view: WorkoutPlanner, MealPlanner, HealthAssessment, FoodScanner, and AICoach.

## 2. PDF Generation

Use browser `window.print()` with `@media print` CSS rules in `index.css`:
- Hide sidebar, nav, buttons during print
- Style the content area for clean A4 output
- Add AroMi branding header in print view

This avoids adding heavy PDF libraries. The print dialog lets users save as PDF natively.

## 3. Email Sharing

Use `mailto:` links with:
- Subject: e.g. "My AroMi Workout Plan"
- Body: plain-text version of the generated content (strip markdown to plain text)

Create a utility `src/lib/shareUtils.ts` with:
- `shareViaEmail(subject, content)` — opens mailto with encoded content
- `copyToClipboard(content)` — copies text
- `getPlainText(markdown)` — strips markdown formatting for email body

## 4. Voice Assistant Enhancement

Update `src/pages/AICoach.tsx`:
- Add **text-to-speech** output: when AI responds, offer a speaker button to read the response aloud using `window.speechSynthesis`
- The existing voice input (Web Speech API) already works — enhance it with a persistent floating mic indicator

Create a floating voice assistant widget `src/components/VoiceAssistant.tsx`:
- Floating button on all pages (not just AI Coach)
- Click to activate microphone → transcribe → send to AI coach edge function → show response in a mini-overlay → speak it aloud
- Uses existing `ai-coach` edge function
- Replaces the current simple floating bot button in AppLayout

## 5. Structured AI Output — Update Edge Function Prompts

### `generate-workout/index.ts`
Update the prompt to request structured output with:
- Specific timings for each exercise (e.g., "5:30 AM - 5:35 AM: Warmup")
- Rest periods between sets
- Water break reminders
- Cool-down stretches with duration
- Daily schedule format with time blocks

### `generate-meal-plan/index.ts`
Update the prompt to request:
- Meal timing schedule (e.g., "7:00 AM - Breakfast")
- Prep time and cook time per meal
- Snack breaks with times
- Water intake reminders between meals
- Grocery list summary at the end

### `health-assessment/index.ts`
Update prompt to return more structured analysis with:
- Category-wise breakdown (Sleep, Nutrition, Activity, Stress, Hydration)
- Priority action items ranked by impact
- Weekly improvement timeline

### `ai-coach/index.ts`
Update system prompt to always format responses with:
- Clear sections using markdown headers
- Bullet points for actionable items
- Tables for schedules/comparisons when relevant

## 6. Frontend Output Formatting

Update result display in all planner pages to:
- Use styled markdown rendering with custom components for tables, headers, lists
- Add section separators and icons for different plan sections
- Show a summary card at the top of generated plans

## Files to Create/Modify

**New files:**
- `src/components/ContentActions.tsx` — Share/Download/Copy toolbar
- `src/components/VoiceAssistant.tsx` — Floating voice assistant widget
- `src/lib/shareUtils.ts` — Email/clipboard/text utilities

**Modified files:**
- `src/index.css` — Add `@media print` styles
- `src/components/AppLayout.tsx` — Replace floating bot button with VoiceAssistant
- `src/pages/WorkoutPlanner.tsx` — Add ContentActions toolbar, improve result display
- `src/pages/MealPlanner.tsx` — Add ContentActions toolbar, improve result display
- `src/pages/HealthAssessment.tsx` — Add ContentActions toolbar
- `src/pages/FoodScanner.tsx` — Add ContentActions toolbar
- `src/pages/AICoach.tsx` — Add TTS button per message, ContentActions for conversations
- `supabase/functions/generate-workout/index.ts` — Enhanced structured prompt with timings/breaks
- `supabase/functions/generate-meal-plan/index.ts` — Enhanced structured prompt with timings/breaks
- `supabase/functions/health-assessment/index.ts` — Enhanced structured prompt
- `supabase/functions/ai-coach/index.ts` — Enhanced system prompt for structured responses

