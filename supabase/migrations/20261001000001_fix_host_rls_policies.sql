-- Drop existing participant policies
DROP POLICY IF EXISTS "Users can join rooms" ON public.room_participants;
DROP POLICY IF EXISTS "Users can update their own participant entry" ON public.room_participants;
DROP POLICY IF EXISTS "Users can leave rooms" ON public.room_participants;
DROP POLICY IF EXISTS "Users can join or host can add" ON public.room_participants;
DROP POLICY IF EXISTS "Participant Insert" ON public.room_participants;
DROP POLICY IF EXISTS "Participant Update" ON public.room_participants;
DROP POLICY IF EXISTS "Participant Delete" ON public.room_participants;

-- Recreate policies with full host access
CREATE POLICY "Participant Insert"
  ON public.room_participants FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM public.rooms WHERE id = room_participants.room_id AND host_id = auth.uid()
    )
  );

CREATE POLICY "Participant Update"
  ON public.room_participants FOR UPDATE TO authenticated
  USING (
    auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM public.rooms WHERE id = room_participants.room_id AND host_id = auth.uid()
    )
  );

CREATE POLICY "Participant Delete"
  ON public.room_participants FOR DELETE TO authenticated
  USING (
    auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM public.rooms WHERE id = room_participants.room_id AND host_id = auth.uid()
    )
  );
