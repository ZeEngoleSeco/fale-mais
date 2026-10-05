-- Migration: Create real tables for Fale+ (Rooms, Events, RSVPs, AI Sessions, AI Messages, Achievements)
-- Timestamp: 20260929221000

-- 1. Create Rooms Table
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  "desc" TEXT DEFAULT 'Sala prática de oratória em tempo real.',
  category TEXT DEFAULT 'Pitch',
  people_count INT DEFAULT 1,
  max_people INT DEFAULT 20,
  is_private BOOLEAN DEFAULT false,
  is_live BOOLEAN DEFAULT true,
  host_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  host_name TEXT NOT NULL,
  host_initials TEXT NOT NULL,
  host_role TEXT DEFAULT 'Host & Facilitador',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.rooms ALTER COLUMN host_id DROP NOT NULL;
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS "desc" TEXT DEFAULT 'Sala prática de oratória em tempo real.';
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Pitch';
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS people_count INT DEFAULT 1;
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS max_people INT DEFAULT 20;
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false;
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS is_live BOOLEAN DEFAULT true;
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS host_name TEXT;
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS host_initials TEXT;
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS host_role TEXT;

-- Enable RLS for rooms
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rooms' AND policyname = 'Rooms are viewable by everyone.') THEN
        CREATE POLICY "Rooms are viewable by everyone." ON public.rooms FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rooms' AND policyname = 'Anyone can insert rooms.') THEN
        CREATE POLICY "Anyone can insert rooms." ON public.rooms FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rooms' AND policyname = 'Anyone can update rooms.') THEN
        CREATE POLICY "Anyone can update rooms." ON public.rooms FOR UPDATE USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rooms' AND policyname = 'Anyone can delete rooms.') THEN
        CREATE POLICY "Anyone can delete rooms." ON public.rooms FOR DELETE USING (true);
    END IF;
END $$;

-- 2. Create Room Participants Table
CREATE TABLE IF NOT EXISTS public.room_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  initials TEXT NOT NULL,
  role TEXT DEFAULT 'Ouvinte',
  is_online BOOLEAN DEFAULT true,
  has_hand_raised BOOLEAN DEFAULT false,
  is_muted BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'room_participants' AND policyname = 'Room participants viewable by everyone.') THEN
        CREATE POLICY "Room participants viewable by everyone." ON public.room_participants FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'room_participants' AND policyname = 'Anyone can insert room participants.') THEN
        CREATE POLICY "Anyone can insert room participants." ON public.room_participants FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'room_participants' AND policyname = 'Anyone can update room participants.') THEN
        CREATE POLICY "Anyone can update room participants." ON public.room_participants FOR UPDATE USING (true);
    END IF;
END $$;

-- 3. Create Room Messages Table
CREATE TABLE IF NOT EXISTS public.room_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.room_messages ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'room_messages' AND policyname = 'Room messages viewable by everyone.') THEN
        CREATE POLICY "Room messages viewable by everyone." ON public.room_messages FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'room_messages' AND policyname = 'Anyone can insert room messages.') THEN
        CREATE POLICY "Anyone can insert room messages." ON public.room_messages FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- 4. Create Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  "desc" TEXT NOT NULL,
  place TEXT NOT NULL,
  date TEXT NOT NULL,
  full_date TEXT,
  time TEXT NOT NULL,
  confirmed_count INT DEFAULT 0,
  max_capacity INT DEFAULT 50,
  kind TEXT DEFAULT 'Online', -- 'Online' | 'Presencial'
  category TEXT DEFAULT 'Workshop',
  is_featured BOOLEAN DEFAULT false,
  organizer_name TEXT DEFAULT 'Comunidade Fale+',
  organizer_initials TEXT DEFAULT 'FM',
  organizer_events_held INT DEFAULT 10,
  speakers JSONB DEFAULT '[]'::jsonb,
  agenda JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS "desc" TEXT DEFAULT '';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS place TEXT DEFAULT '';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS date TEXT DEFAULT '';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS full_date TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS time TEXT DEFAULT '';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS confirmed_count INT DEFAULT 0;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS max_capacity INT DEFAULT 50;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS kind TEXT DEFAULT 'Online';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Workshop';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS organizer_name TEXT DEFAULT 'Comunidade Fale+';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS organizer_initials TEXT DEFAULT 'FM';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS organizer_events_held INT DEFAULT 10;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS speakers JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS agenda JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Events viewable by everyone.') THEN
        CREATE POLICY "Events viewable by everyone." ON public.events FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Anyone can insert events.') THEN
        CREATE POLICY "Anyone can insert events." ON public.events FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Anyone can update events.') THEN
        CREATE POLICY "Anyone can update events." ON public.events FOR UPDATE USING (true);
    END IF;
END $$;

-- 5. Create Event RSVPs Table
CREATE TABLE IF NOT EXISTS public.event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_email TEXT,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_event_user UNIQUE (event_id, user_id)
);

ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'event_rsvps' AND policyname = 'Event RSVPs viewable by everyone.') THEN
        CREATE POLICY "Event RSVPs viewable by everyone." ON public.event_rsvps FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'event_rsvps' AND policyname = 'Anyone can insert event RSVPs.') THEN
        CREATE POLICY "Anyone can insert event RSVPs." ON public.event_rsvps FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'event_rsvps' AND policyname = 'Anyone can delete event RSVPs.') THEN
        CREATE POLICY "Anyone can delete event RSVPs." ON public.event_rsvps FOR DELETE USING (true);
    END IF;
END $$;

-- 6. Create AI Sessions Table
CREATE TABLE IF NOT EXISTS public.ai_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  mode TEXT DEFAULT 'pitch',
  title TEXT DEFAULT 'Treino com Thorel AI',
  score NUMERIC(3,1) DEFAULT 0,
  feedback_summary TEXT,
  strengths JSONB DEFAULT '[]'::jsonb,
  improvements JSONB DEFAULT '[]'::jsonb,
  duration TEXT DEFAULT '1m 00s',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_sessions ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_sessions' AND policyname = 'AI sessions viewable by everyone.') THEN
        CREATE POLICY "AI sessions viewable by everyone." ON public.ai_sessions FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_sessions' AND policyname = 'Anyone can insert AI sessions.') THEN
        CREATE POLICY "Anyone can insert AI sessions." ON public.ai_sessions FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_sessions' AND policyname = 'Anyone can update AI sessions.') THEN
        CREATE POLICY "Anyone can update AI sessions." ON public.ai_sessions FOR UPDATE USING (true);
    END IF;
END $$;

-- 7. Create AI Messages Table
CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.ai_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender TEXT NOT NULL, -- 'me' | 'ai'
  text TEXT NOT NULL,
  tips JSONB DEFAULT '[]'::jsonb,
  metrics JSONB DEFAULT '{}'::jsonb,
  report_card JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_messages' AND policyname = 'AI messages viewable by everyone.') THEN
        CREATE POLICY "AI messages viewable by everyone." ON public.ai_messages FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_messages' AND policyname = 'Anyone can insert AI messages.') THEN
        CREATE POLICY "Anyone can insert AI messages." ON public.ai_messages FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- 8. Create User Achievements Table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'Trophy',
  xp_reward INT DEFAULT 100,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_badge UNIQUE (user_id, badge_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_achievements' AND policyname = 'User achievements viewable by everyone.') THEN
        CREATE POLICY "User achievements viewable by everyone." ON public.user_achievements FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_achievements' AND policyname = 'Anyone can insert user achievements.') THEN
        CREATE POLICY "Anyone can insert user achievements." ON public.user_achievements FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Seed initial events if empty
INSERT INTO public.events (title, "desc", place, date, full_date, time, confirmed_count, max_capacity, kind, category, is_featured, organizer_name, organizer_initials, speakers, agenda)
SELECT 
  'Meetup: Falar em Público sem Medo',
  'Uma noite com dinâmicas práticas no palco, técnicas de destravamento e networking real.',
  'Av. Paulista, 1000 — São Paulo, SP',
  'Sáb, 15 Fev',
  'Sábado, 15 de Fevereiro de 2026',
  '19h00 às 22h00',
  42,
  60,
  'Presencial',
  'Meetup',
  true,
  'Comunidade Fale+ SP',
  'FM',
  '[{"name": "Carlos Eduardo", "role": "Palestrante TEDx", "company": "Fale+"}]'::jsonb,
  '[{"time": "19h00", "activity": "Credenciamento & Welcome Coffee"}, {"time": "19h30", "activity": "Palestra de Abertura"}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.events LIMIT 1);

INSERT INTO public.events (title, "desc", place, date, full_date, time, confirmed_count, max_capacity, kind, category, is_featured, organizer_name, organizer_initials, speakers, agenda)
SELECT 
  'Masterclass Online: Storytelling para Líderes',
  'Aprenda a estruturar discursos que conectam pela emoção e convertem ideias em ação.',
  'Online · Transmissão via Fale+ Live',
  'Qua, 19 Fev',
  'Quarta-feira, 19 de Fevereiro de 2026',
  '20h00 às 21h30',
  156,
  300,
  'Online',
  'Masterclass',
  false,
  'Fale+ Academy',
  'FA',
  '[{"name": "Helena Vaz", "role": "Estrategista Narrativa", "company": "StoryWorks"}]'::jsonb,
  '[{"time": "20h00", "activity": "Abertura"}, {"time": "20h40", "activity": "Estudo de Caso"}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title LIKE '%Masterclass%');

-- Seed initial rooms if empty
INSERT INTO public.rooms (name, "desc", category, people_count, max_people, is_private, is_live, host_name, host_initials, host_role)
SELECT 
  'Pitch para Investidores & Startups',
  'Prática semanal de pitchs curtos de 60s a 3min com rodada de feedback instantâneo.',
  'Pitch',
  14,
  20,
  false,
  true,
  'Carlos Eduardo',
  'CE',
  'Mentor'
WHERE NOT EXISTS (SELECT 1 FROM public.rooms LIMIT 1);
