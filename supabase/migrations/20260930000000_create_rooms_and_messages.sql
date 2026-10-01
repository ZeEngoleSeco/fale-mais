-- Drop existing tables if they partially exist (from failed migration)
DROP TABLE IF EXISTS public.room_participants CASCADE;
DROP TABLE IF EXISTS public.room_messages CASCADE;
DROP TABLE IF EXISTS public.rooms CASCADE;

-- Drop existing function if exists
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

-- Create rooms table
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Pitch',
  max_people INTEGER NOT NULL DEFAULT 20,
  is_private BOOLEAN NOT NULL DEFAULT false,
  password TEXT,
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  host_name TEXT NOT NULL,
  host_initials TEXT NOT NULL,
  is_live BOOLEAN NOT NULL DEFAULT true,
  initial_topic TEXT DEFAULT '',
  people_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create room_messages table
CREATE TABLE public.room_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_initials TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create room_participants table
CREATE TABLE public.room_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_initials TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Ouvinte',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;

-- Rooms policies
CREATE POLICY "Anyone authenticated can view rooms"
  ON public.rooms FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create rooms"
  ON public.rooms FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Only host can update their rooms"
  ON public.rooms FOR UPDATE TO authenticated
  USING (auth.uid() = host_id);

CREATE POLICY "Only host can delete their rooms"
  ON public.rooms FOR DELETE TO authenticated
  USING (auth.uid() = host_id);

-- Room messages policies
CREATE POLICY "Authenticated users can view messages in any room"
  ON public.room_messages FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can send messages"
  ON public.room_messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can delete their own messages"
  ON public.room_messages FOR DELETE TO authenticated
  USING (auth.uid() = sender_id);

-- Room participants policies
CREATE POLICY "Anyone authenticated can view participants"
  ON public.room_participants FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can join rooms"
  ON public.room_participants FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participant entry"
  ON public.room_participants FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can leave rooms"
  ON public.room_participants FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.rooms WHERE id = room_id AND host_id = auth.uid()
  ));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_participants;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();