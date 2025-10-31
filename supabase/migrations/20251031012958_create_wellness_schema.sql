/*
  # Create Lyfora Wellness App Schema

  1. New Tables
    - `wellness_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `full_name` (text)
      - `age` (integer)
      - `goals` (jsonb array) - fitness, mental_health, nutrition, sleep, stress
      - `current_challenges` (text)
      - `preferred_activity_time` (text) - morning, afternoon, evening
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `daily_routines`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `date` (date)
      - `activities` (jsonb array) - array of activity objects
      - `completion_rate` (numeric) - percentage of completed activities
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `activity_completions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `routine_id` (uuid, references daily_routines)
      - `activity_id` (text) - identifier for the activity
      - `activity_title` (text)
      - `activity_category` (text) - physical, mental, nutritional, sleep
      - `completed_at` (timestamptz)
      - `notes` (text)

    - `daily_checkins`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `date` (date)
      - `mood` (integer) - 1-5 scale
      - `energy` (integer) - 1-5 scale
      - `sleep_quality` (integer) - 1-5 scale
      - `sleep_hours` (numeric)
      - `notes` (text)
      - `created_at` (timestamptz)

    - `manual_activities`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `category` (text) - physical, mental, nutritional, sleep
      - `duration_minutes` (integer)
      - `notes` (text)
      - `completed_at` (timestamptz)

    - `wellness_tips`
      - `id` (uuid, primary key)
      - `category` (text)
      - `title` (text)
      - `content` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Wellness tips are publicly readable

  3. Important Notes
    - All user data is scoped to authenticated users only
    - Each user can only access their own wellness data
    - Daily routines are generated based on user goals and preferences
    - Activity completions track individual activity progress
    - Check-ins provide daily wellness metrics
*/

-- Create wellness_profiles table
CREATE TABLE IF NOT EXISTS wellness_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name text NOT NULL,
  age integer,
  goals jsonb DEFAULT '[]'::jsonb,
  current_challenges text,
  preferred_activity_time text DEFAULT 'morning',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE wellness_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON wellness_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON wellness_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON wellness_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create daily_routines table
CREATE TABLE IF NOT EXISTS daily_routines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  activities jsonb DEFAULT '[]'::jsonb,
  completion_rate numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE daily_routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own routines"
  ON daily_routines FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own routines"
  ON daily_routines FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own routines"
  ON daily_routines FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create activity_completions table
CREATE TABLE IF NOT EXISTS activity_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  routine_id uuid REFERENCES daily_routines(id) ON DELETE CASCADE,
  activity_id text NOT NULL,
  activity_title text NOT NULL,
  activity_category text NOT NULL,
  completed_at timestamptz DEFAULT now(),
  notes text
);

ALTER TABLE activity_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity completions"
  ON activity_completions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity completions"
  ON activity_completions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activity completions"
  ON activity_completions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own activity completions"
  ON activity_completions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create daily_checkins table
CREATE TABLE IF NOT EXISTS daily_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  mood integer CHECK (mood >= 1 AND mood <= 5),
  energy integer CHECK (energy >= 1 AND energy <= 5),
  sleep_quality integer CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  sleep_hours numeric,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own check-ins"
  ON daily_checkins FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own check-ins"
  ON daily_checkins FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own check-ins"
  ON daily_checkins FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create manual_activities table
CREATE TABLE IF NOT EXISTS manual_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  duration_minutes integer,
  notes text,
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE manual_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own manual activities"
  ON manual_activities FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own manual activities"
  ON manual_activities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own manual activities"
  ON manual_activities FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own manual activities"
  ON manual_activities FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create wellness_tips table
CREATE TABLE IF NOT EXISTS wellness_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wellness_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view wellness tips"
  ON wellness_tips FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_daily_routines_user_date ON daily_routines(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_activity_completions_user ON activity_completions(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_user_date ON daily_checkins(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_manual_activities_user ON manual_activities(user_id, completed_at DESC);

-- Insert some sample wellness tips
INSERT INTO wellness_tips (category, title, content) VALUES
  ('physical', 'Start Your Day with Movement', 'Even 5 minutes of stretching or light exercise in the morning can boost energy and mood for the entire day.'),
  ('mental', 'Practice Mindful Breathing', 'Take 3 deep breaths when feeling stressed. Inhale for 4 counts, hold for 4, exhale for 4.'),
  ('nutritional', 'Hydration Matters', 'Aim for 8 glasses of water daily. Start your morning with a glass of water to kickstart your metabolism.'),
  ('sleep', 'Consistent Sleep Schedule', 'Going to bed and waking up at the same time daily helps regulate your body''s internal clock.'),
  ('physical', 'Walk After Meals', 'A 10-15 minute walk after eating aids digestion and helps regulate blood sugar levels.'),
  ('mental', 'Gratitude Practice', 'Write down 3 things you''re grateful for each day to boost positivity and mental well-being.'),
  ('nutritional', 'Eat the Rainbow', 'Include colorful fruits and vegetables in your meals for a variety of nutrients and antioxidants.'),
  ('sleep', 'Wind Down Routine', 'Create a relaxing bedtime routine 30 minutes before sleep - dim lights, no screens, calming activities.')
ON CONFLICT DO NOTHING;