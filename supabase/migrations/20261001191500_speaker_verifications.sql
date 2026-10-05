-- Migration: Create Speaker Verifications table
-- Timestamp: 20261001191500
CREATE TABLE IF NOT EXISTS public.speaker_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  expertise_area TEXT NOT NULL,
  experience_desc TEXT NOT NULL,
  professional_exp TEXT,
  social_links TEXT,
  previous_events TEXT,
  additional_info TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.speaker_verifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'speaker_verifications' AND policyname = 'Users can view their own verifications.'
    ) THEN
        CREATE POLICY "Users can view their own verifications." ON public.speaker_verifications FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role ILIKE '%Desenvolvedor%'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'speaker_verifications' AND policyname = 'Users can insert their own verifications.'
    ) THEN
        CREATE POLICY "Users can insert their own verifications." ON public.speaker_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'speaker_verifications' AND policyname = 'Developers can update verifications.'
    ) THEN
        CREATE POLICY "Developers can update verifications." ON public.speaker_verifications FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role ILIKE '%Desenvolvedor%'));
    END IF;
END $$;

-- Add speaker_status to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS speaker_status TEXT DEFAULT 'none';

-- Create RPC to submit verification and get developers emails
CREATE OR REPLACE FUNCTION public.submit_speaker_verification(
    p_full_name TEXT,
    p_expertise_area TEXT,
    p_experience_desc TEXT,
    p_professional_exp TEXT,
    p_social_links TEXT,
    p_previous_events TEXT,
    p_additional_info TEXT
)
RETURNS TABLE (dev_email TEXT)
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

    -- Insert request
    INSERT INTO public.speaker_verifications (
        user_id, full_name, expertise_area, experience_desc, 
        professional_exp, social_links, previous_events, additional_info
    ) VALUES (
        v_user_id, p_full_name, p_expertise_area, p_experience_desc, 
        p_professional_exp, p_social_links, p_previous_events, p_additional_info
    );

    -- Update profile status
    UPDATE public.profiles SET speaker_status = 'pending' WHERE id = v_user_id;

    -- Return developer emails
    RETURN QUERY 
    SELECT email FROM public.profiles WHERE role ILIKE '%Desenvolvedor%';
END;
$$;
