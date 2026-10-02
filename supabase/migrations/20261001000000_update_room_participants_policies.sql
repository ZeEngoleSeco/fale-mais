-- Drop the existing insert policy
DROP POLICY IF EXISTS "Users can join rooms" ON public.room_participants;

-- Create new policy allowing users to join or host to add them
CREATE POLICY "Users can join or host can add"
  ON public.room_participants FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM public.rooms WHERE id = room_id AND host_id = auth.uid()
    )
  );
