/*
  # Create game_sessions table
  1. New Tables: game_sessions (id uuid, user_id uuid, score int, time_taken_seconds int, flips int, created_at timestamptz)
  2. Security: Enable RLS, add temporary read/insert policies for authenticated users.
*/
CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable for now, will be linked to auth.users later
  score INT NOT NULL DEFAULT 0,
  time_taken_seconds INT NOT NULL DEFAULT 0,
  flips INT NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- TEMPORARY POLICY: Allows authenticated users to read all game sessions.
-- This policy should be refined to 'auth.uid() = user_id' once user authentication
-- and user-specific data fetching are fully implemented in the frontend.
CREATE POLICY "Allow authenticated read all game sessions (temporary)"
ON game_sessions FOR SELECT TO authenticated
USING (true);

-- TEMPORARY POLICY: Allows authenticated users to insert game sessions.
-- This policy should be refined to 'auth.uid() = user_id' once user_id is consistently
-- set during game session insertion in the frontend.
CREATE POLICY "Allow authenticated insert game sessions (temporary)"
ON game_sessions FOR INSERT TO authenticated
WITH CHECK (true);