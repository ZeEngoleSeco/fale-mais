-- Migration: Set current authenticated user as verified speaker
-- Run manually by executing the UPDATE below for a specific user, OR
-- use the RPC set_speaker_verified below to set it for the currently logged-in user.

-- RPC: Allows a developer to approve a speaker by user_id
CREATE OR REPLACE FUNCTION public.approve_speaker(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only developers can call this
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role ILIKE '%Desenvolvedor%'
  ) THEN
    RAISE EXCEPTION 'Acesso negado: apenas Desenvolvedores podem aprovar palestrantes.';
  END IF;

  -- Update speaker_status on profiles
  UPDATE public.profiles SET speaker_status = 'verified' WHERE id = p_user_id;

  -- Mark the verification request as approved
  UPDATE public.speaker_verifications 
  SET status = 'approved', updated_at = NOW()
  WHERE user_id = p_user_id AND status = 'pending';
END;
$$;

-- RPC: Force-approve the currently logged-in user as verified speaker
-- (For development/testing purposes only)
CREATE OR REPLACE FUNCTION public.dev_force_approve_self_as_speaker()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  UPDATE public.profiles SET speaker_status = 'verified' WHERE id = v_user_id;
END;
$$;

-- Grant execute on the new functions
GRANT EXECUTE ON FUNCTION public.approve_speaker(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.dev_force_approve_self_as_speaker() TO authenticated;
