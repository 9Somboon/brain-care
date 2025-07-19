# Project: Brain Training Web App (Prototype) for Seniors

This is a prototype web application designed to help seniors with brain training exercises, initially focusing on a simple memory game. It uses React for the frontend, Supabase for the backend (database), and will be deployed on Vercel.

## Core Goal

To understand the full stack development process (React, Supabase, Vercel, **Tailwind CSS**) and create a basic, user-friendly brain training game prototype for elderly users, specifically for my mother to test.

## Target Audience

Elderly users (e.g., my mother) and their caregivers (e.g., me) who want a simple, engaging, and easy-to-use brain training tool with basic performance tracking.

## Key Features (Prototype Phase)

1.  **Simple Memory Game:** A basic matching game (e.g., 4 pairs of images).
2.  **User-Friendly UI/UX:**
    * Large buttons and text.
    * High contrast colors.
    * Intuitive navigation.
    * Minimal distractions.
    * **Styled using Tailwind CSS for rapid and consistent design.**
3.  **Game Statistics Tracking:**
    * Record game completion time.
    * Record game score (if applicable).
    * Record date and time of play.
4.  **Basic Admin Dashboard (for caregiver):**
    * View historical game statistics for the user (e.g., my mother).
    * Display data in a simple table or basic chart.

## Technologies Used

* **Frontend:** React (with Vite)
    * **Styling:** Tailwind CSS
* **Backend/Database:** Supabase (PostgreSQL, Authentication, Realtime - for future)
    * **Supabase URL:** `https://nxpoxoikokjcojhuverm.supabase.co`
    * **Supabase Anon Key (public API key):** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54cG94b2lrb2tqY29qaHV2ZXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MTYzNzgsImV4cCI6MjA2ODQ5MjM3OH0.OcWOTbi1U3tx0-bl_6DW36qFzpLYOIPoD2AQoL0NBIY`
* **Deployment:** Vercel (Ready for continuous deployment from GitHub)
* **Version Control:** Git / GitHub

## Current Stage / What I'm working on

I am currently in the "Vibe Coding" phase, focusing on getting the core game logic, **Tailwind CSS integration**, and Supabase integration working. I am also setting up the basic dashboard. The project is being prepared for seamless deployment on Vercel.

## Specific Questions / Tasks for Gemini (when using gemini-cli)

Here are some examples of how I might use `gemini-cli` with this `GEMINI.md` file:

* **Code Generation:**
    * "Generate a React component for a simple 4x4 image matching game, **styled with Tailwind CSS classes for a clean, elderly-friendly design (e.g., large buttons, clear text).**"
    * "Using the provided Supabase URL and API key, write a JavaScript function to insert game statistics (game_name, time_taken_seconds, score, player_id) into a 'game_stats' table."
    * "Provide example React code to display a list of game stats using a table, fetching data from Supabase, **and using Tailwind CSS for table styling.**"
* **Troubleshooting:**
    * "I'm having trouble setting up Tailwind CSS in my Vite/React project. What are the correct installation steps?"
    * "I'm getting a CORS error when connecting React to Supabase. How can I fix this, specifically for a Vercel deployment?"
    * "My Vercel deployment of my React app is failing. What are the common pitfalls to check when deploying a Vite/React app with Supabase environment variables on Vercel?"
* **Best Practices:**
    * "What are some best practices for designing UI/UX for elderly users in React **using Tailwind CSS for accessibility**?"
    * "How can I ensure data security for user statistics in Supabase, especially for a public-facing prototype deployed on Vercel?"
    * "What are common Tailwind CSS classes for creating large, readable text and spacious buttons suitable for senior users?"
* **Idea Generation:**
    * "Suggest 3 new simple brain training game ideas suitable for elderly users."
    * "What are some effective gamification elements I could add to this app, considering its deployment on Vercel?"
