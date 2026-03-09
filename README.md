# AroMi — AI-Powered Health & Wellness Coach

AroMi is a full-stack AI health and fitness platform that delivers personalized workout plans, meal plans, health assessments, food analysis, and conversational coaching — all powered by AI.

## ✨ Features

### 🏋️ Workout Planner
- AI-generated 7-day workout plans with precise timings, rest periods, water breaks, and cooldowns
- Customizable by fitness goal, location (home/gym), level, and daily time
- Download as PDF, share via email, or copy to clipboard

### 🥗 Meal Planner
- AI-generated 7-day meal plans with recipes, macros, prep/cook times, and grocery lists
- Supports calorie targets, diet preferences (vegan, keto, etc.), allergies, and cuisine choices
- Full nutritional breakdown per meal and daily totals

### 📊 Health Assessment
- Multi-step questionnaire covering sleep, stress, activity, diet, hydration, BP, and diabetes
- AI analyzes inputs and generates a wellness score (0–100) with category breakdowns
- Prioritized action items ranked by health impact

### 📸 Food Scanner
- Upload a photo of any food item
- AI identifies the food and estimates calories, protein, carbs, and fat
- Provides personalized health advice based on user profile

### 🤖 AI Coach (AroMi Chat)
- Conversational AI assistant for health & fitness Q&A
- Streaming responses with markdown formatting
- Chat history saved per session
- Read-aloud (text-to-speech) for any response

### 🎙️ Voice Assistant
- Floating voice button available on all pages
- Speech-to-text input via Web Speech API
- AI responds with concise, actionable advice
- Text-to-speech playback of responses

### 📈 Progress Tracker
- Track weight, calories, hydration, sleep, and workout completion over time
- Visual charts (line, bar) powered by Chart.js
- Daily logging with notes

### ⚙️ Settings
- Edit full health profile: name, age, gender, height, weight, fitness level, diet preference, health goals, stress, sleep, water intake, BP, diabetes status

### 📄 Content Actions (All Sections)
- **Download PDF** — browser print-to-PDF with clean A4 formatting
- **Share via Email** — pre-filled mailto with plain-text content
- **Copy to Clipboard** — one-click copy of generated plans

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui, Lucide icons |
| **State** | Zustand |
| **Routing** | React Router v6 |
| **Charts** | Chart.js, Recharts |
| **Markdown** | react-markdown |
| **Backend** | Lovable Cloud (Supabase) |
| **Database** | PostgreSQL with Row-Level Security |
| **Auth** | Email/password authentication |
| **AI** | Lovable AI Gateway (Gemini 3 Flash) |
| **Edge Functions** | Deno (5 serverless functions) |
| **Voice** | Web Speech API (STT + TTS) |

## 🏗️ Architecture

### Frontend
- **Pages:** Landing, Login, Signup, Dashboard, Health Assessment, Workout Planner, Meal Planner, Food Scanner, AI Coach, Progress, Settings
- **Components:** AppLayout (sidebar + mobile nav), AuthProvider, ProtectedRoute, VoiceAssistant, ContentActions
- **State Management:** Zustand store (`authStore`) managing user session and profile

### Backend (Lovable Cloud)
- **Database Tables:** profiles, health_assessments, workout_plans, meal_plans, food_scans, chat_sessions, progress_records
- **RLS Policies:** All tables secured — users can only access their own data
- **Edge Functions:**
  - `ai-coach` — Streaming chat with health-context-aware system prompt
  - `generate-workout` — Structured 7-day workout plan generation
  - `generate-meal-plan` — Structured 7-day meal plan generation
  - `health-assessment` — Wellness score calculation with category analysis
  - `analyze-food` — Food image analysis for nutritional estimates

### AI Integration
All AI features use the **Lovable AI Gateway** with `google/gemini-3-flash-preview`. Prompts enforce bullet-point formatting (no tables) for clean, readable output optimized for both screen display and voice playback.

## 🚀 Getting Started

```sh
# Clone the repo
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start dev server
npm run dev
```

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/           # shadcn/ui primitives
│   ├── AppLayout.tsx  # Main layout with sidebar
│   ├── AuthProvider.tsx
│   ├── ContentActions.tsx  # PDF/Email/Copy toolbar
│   ├── ProtectedRoute.tsx
│   └── VoiceAssistant.tsx  # Floating voice widget
├── pages/            # Route pages
├── stores/           # Zustand stores
├── hooks/            # Custom React hooks
├── lib/              # Utilities (shareUtils, etc.)
└── integrations/     # Supabase client & types

supabase/
├── functions/        # Edge functions (Deno)
│   ├── ai-coach/
│   ├── analyze-food/
│   ├── generate-meal-plan/
│   ├── generate-workout/
│   └── health-assessment/
└── config.toml
```

## 📜 License

MIT
