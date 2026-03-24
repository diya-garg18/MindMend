-- Drop existing constraint and add new one to allow mood levels 1-10
ALTER TABLE public.mood_entries DROP CONSTRAINT IF EXISTS mood_entries_mood_level_check;
ALTER TABLE public.mood_entries ADD CONSTRAINT mood_entries_mood_level_check CHECK (mood_level >= 1 AND mood_level <= 10);