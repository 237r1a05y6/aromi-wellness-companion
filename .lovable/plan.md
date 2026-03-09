

# AroMi AI Agent — Adaptive Health & Wellness Coach

## Overview
A full-stack AI-powered fitness and wellness platform with personalized coaching, workout generation, meal planning, food scanning, and progress tracking. Built with React + Lovable Cloud (Supabase).

## Pages & Navigation
- **Landing Page** — Hero section, feature highlights, CTA to sign up
- **Auth Pages** — Sign up & login with email/password
- **Dashboard** — Wellness score, quick stats (calories, hydration, workouts), progress charts
- **Health Assessment** — Multi-step form collecting age, stress, sleep, diet, activity level, BP, diabetes → generates wellness score & health summary via AI
- **Workout Planner** — Input fitness goal, location, level, time → AI generates 7-day plan with warmups, exercises, sets/reps, rest, cooldown, tips
- **Meal Planner** — Input calorie target, diet preference, allergies, cuisine → AI generates 7-day meal plan with macros & recipes
- **Food Scanner** — Upload food photo → AI identifies food and estimates nutrition → displays calories, protein, carbs, fat with health advice
- **AI Coach Chat** — Conversational chatbot (AroMi) for health Q&A, workout/meal suggestions, lifestyle adjustments
- **Progress Tracker** — Charts for weight, calories, hydration, workout completion over time
- **Settings** — Edit profile (name, age, gender, height, weight, fitness level, diet preference, health goals, etc.)

## Design
- Modern dark/light theme with health-focused green/teal accent colors
- Responsive mobile-first layout with bottom navigation on mobile
- Floating AI assistant button on all pages
- Clean card-based dashboard with Chart.js visualizations

## Authentication & User Profile
- Supabase Auth with email/password
- Profiles table storing: name, email, age, gender, height, weight, fitness_level, diet_preference, health_goal, stress_level, sleep_hours, water_intake, bp_status, diabetes_status
- Protected routes for authenticated users

## Database Tables
- **profiles** — User profile data
- **health_assessments** — Assessment results with wellness scores
- **workout_plans** — Generated workout plans (JSON)
- **meal_plans** — Generated meal plans (JSON)
- **food_scans** — Food scan history with nutrition data
- **chat_sessions** — AI coach conversation history
- **progress_records** — Daily tracking (weight, calories, water, workouts)

## AI Features (via Lovable AI Gateway)
- **Health Assessment AI** — Analyze inputs → wellness score + suggestions
- **Workout Generator** — Generate structured 7-day plans
- **Meal Planner** — Generate meal plans with macros
- **Food Scanner** — Analyze uploaded food images for nutrition estimates
- **AI Coach** — Streaming conversational assistant with health context
- **Wellness Plan Generator** — 1/7/30-day comprehensive plans

## Voice Assistant
- Web Speech API for voice input
- Speech-to-text → send to AI coach → display response

## Progress Dashboard
- Wellness score gauge
- Weight trend line chart
- Calorie intake bar chart
- Hydration tracking
- Workout completion rate

## State Management
- Zustand for client-side state (user profile, current plans, chat messages)

## Edge Functions
- `ai-coach` — Streaming chat with health context
- `generate-workout` — AI workout plan generation
- `generate-meal-plan` — AI meal plan generation
- `analyze-food` — Food image analysis
- `health-assessment` — Wellness score calculation

