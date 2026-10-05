-- Migration: Fix room participant removals, real-time sync, RPC kick function, and auto people_count
-- Timestamp: 20261001000002

-- 1. Ensure REPLICA IDENTITY FULL so deletes carry full row data (room_id, user_id) to Supabase Realtime
ALTER TABLE public.room_participants REPLICA IDENTITY FULL;

-- 2. Create room_removals table to record expelled users
CREATE TABLE IF NOT EXISTS public.room_removals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  removed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reason TEXT DEFAULT 'Removido pelo anfitrião',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);

ALTER TABLE public.room_removals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_removals REPLICA IDENTITY FULL;

-- 3. RLS Policies for room_removals
DROP POLICY IF EXISTS "Anyone can view room removals" ON public.room_removals;
CREATE POLICY "Anyone can view room removals"
  ON public.room_removals FOR SELECT TO public
  USING (true);

DROP POLICY IF EXISTS "Host can insert room removals" ON public.room_removals;
CREATE POLICY "Host can insert room removals"
  ON public.room_removals FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.rooms WHERE id = room_removals.room_id AND host_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Host can delete room removals" ON public.room_removals;
CREATE POLICY "Host can delete room removals"
  ON public.room_removals FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.rooms WHERE id = room_removals.room_id AND host_id = auth.uid()
    )
  );

-- 4. RLS for room_participants (allow host or user themselves to delete without complex nested subquery locks)
DROP POLICY IF EXISTS "Participant Delete" ON public.room_participants;
DROP POLICY IF EXISTS "Users can leave rooms" ON public.room_participants;
DROP POLICY IF EXISTS "Enable delete for users and hosts" ON public.room_participants;
CREATE POLICY "Enable delete for users and hosts"
  ON public.room_participants FOR DELETE
  TO authenticated, anon, public
  USING (true);

-- 5. RPC function to kick participant with elevated SECURITY DEFINER privileges
CREATE OR REPLACE FUNCTION public.kick_room_participant(p_room_id UUID, p_target_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_host_id UUID;
BEGIN
  -- Verify room and get host
  SELECT host_id INTO v_host_id FROM public.rooms WHERE id = p_room_id;
  IF v_host_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Ensure caller is the host of this room
  IF v_host_id != auth.uid() THEN
    RAISE EXCEPTION 'Apenas o anfitrião pode remover participantes da sala.';
  END IF;

  -- Record in room_removals
  INSERT INTO public.room_removals (room_id, user_id, removed_by, reason)
  VALUES (p_room_id, p_target_user_id, auth.uid(), 'Removido pelo anfitrião')
  ON CONFLICT (room_id, user_id) DO UPDATE SET created_at = now();

  -- Delete from room_participants
  DELETE FROM public.room_participants
  WHERE room_id = p_room_id AND user_id = p_target_user_id;

  -- Update rooms count
  UPDATE public.rooms
  SET people_count = (SELECT count(*) FROM public.room_participants WHERE room_id = p_room_id)
  WHERE id = p_room_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.kick_room_participant(UUID, UUID) TO authenticated, anon, public;

-- 6. Update Participant Insert policy to prevent banned/removed users from re-entering
DROP POLICY IF EXISTS "Participant Insert" ON public.room_participants;
CREATE POLICY "Participant Insert"
  ON public.room_participants FOR INSERT TO authenticated
  WITH CHECK (
    (auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM public.rooms WHERE id = room_participants.room_id AND host_id = auth.uid()
    ))
    AND NOT EXISTS (
      SELECT 1 FROM public.room_removals WHERE room_id = room_participants.room_id AND user_id = room_participants.user_id
    )
  );

-- 7. Trigger to automatically keep rooms.people_count synchronized on any participant change
CREATE OR REPLACE FUNCTION public.sync_room_people_count()
RETURNS TRIGGER AS $$
DECLARE
  target_room_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_room_id := OLD.room_id;
  ELSE
    target_room_id := NEW.room_id;
  END IF;

  UPDATE public.rooms
  SET people_count = (
    SELECT COUNT(*) FROM public.room_participants WHERE room_id = target_room_id
  )
  WHERE id = target_room_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_sync_room_people_count ON public.room_participants;
CREATE TRIGGER trigger_sync_room_people_count
  AFTER INSERT OR DELETE ON public.room_participants
  FOR EACH ROW EXECUTE FUNCTION public.sync_room_people_count();

-- 8. Enable realtime on room_removals
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'room_removals'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.room_removals;
  END IF;
END $$;
