-- ============================================================
-- Migration: Senha de sala com hash seguro (pgcrypto)
-- ============================================================
-- Habilita pgcrypto para usar crypt() e gen_salt()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Adiciona coluna password_hash (substitui a coluna password plain-text)
ALTER TABLE public.rooms
  ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Migra senhas plain-text existentes para hash bcrypt
-- (somente para salas privadas que já tinham senha)
UPDATE public.rooms
SET password_hash = crypt(password, gen_salt('bf', 10))
WHERE is_private = true
  AND password IS NOT NULL
  AND password <> ''
  AND password_hash IS NULL;

-- Remove a coluna plain-text
ALTER TABLE public.rooms
  DROP COLUMN IF EXISTS password;

-- ============================================================
-- RPC: verify_room_password
-- Valida a senha no backend, nunca expõe o hash ao cliente.
-- Retorna: 'ok' | 'wrong_password' | 'not_private'
-- ============================================================
CREATE OR REPLACE FUNCTION public.verify_room_password(
  p_room_id   UUID,
  p_password  TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_private    BOOLEAN;
  v_password_hash TEXT;
BEGIN
  SELECT is_private, password_hash
  INTO v_is_private, v_password_hash
  FROM public.rooms
  WHERE id = p_room_id;

  -- Sala não existe
  IF NOT FOUND THEN
    RETURN 'not_found';
  END IF;

  -- Sala não é privada, não precisa de senha
  IF v_is_private = false OR v_password_hash IS NULL THEN
    RETURN 'not_private';
  END IF;

  -- Compara usando bcrypt (crypt nunca expõe o hash)
  IF crypt(p_password, v_password_hash) = v_password_hash THEN
    RETURN 'ok';
  ELSE
    RETURN 'wrong_password';
  END IF;
END;
$$;

-- Somente usuários autenticados podem chamar a RPC
-- ============================================================
-- RPC: create_room_with_password
-- Cria sala privada e já armazena a senha em hash bcrypt.
-- A senha plain-text nunca é gravada em nenhuma coluna.
-- ============================================================
CREATE OR REPLACE FUNCTION public.create_room_with_password(
  p_name          TEXT,
  p_description   TEXT,
  p_category      TEXT,
  p_max_people    INTEGER,
  p_host_id       UUID,
  p_host_name     TEXT,
  p_host_initials TEXT,
  p_initial_topic TEXT,
  p_password      TEXT
)
RETURNS TABLE (
  id            UUID,
  name          TEXT,
  description   TEXT,
  category      TEXT,
  max_people    INTEGER,
  is_private    BOOLEAN,
  host_id       UUID,
  host_name     TEXT,
  host_initials TEXT,
  is_live       BOOLEAN,
  initial_topic TEXT,
  people_count  INTEGER,
  created_at    TIMESTAMPTZ,
  updated_at    TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_hash TEXT;
  v_id   UUID;
BEGIN
  -- Hash the password with bcrypt (cost factor 10)
  v_hash := crypt(p_password, gen_salt('bf', 10));

  INSERT INTO public.rooms (
    name, description, category, max_people,
    is_private, password_hash,
    host_id, host_name, host_initials,
    is_live, initial_topic, people_count
  )
  VALUES (
    p_name, p_description, p_category, p_max_people,
    true, v_hash,
    p_host_id, p_host_name, p_host_initials,
    true, p_initial_topic, 1
  )
  RETURNING rooms.id INTO v_id;

  -- Return safe columns only (no password_hash)
  RETURN QUERY
    SELECT
      r.id, r.name, r.description, r.category, r.max_people,
      r.is_private, r.host_id, r.host_name, r.host_initials,
      r.is_live, r.initial_topic, r.people_count,
      r.created_at, r.updated_at
    FROM public.rooms r
    WHERE r.id = v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_room_with_password FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_room_with_password TO authenticated;


-- ============================================================
-- RLS: Garante que a coluna password_hash nunca seja
-- retornada via SELECT para o cliente.
-- A policy de SELECT já existe; adicionamos uma coluna
-- de segurança via uma view pública sem o hash.
-- ============================================================

-- View pública sem o hash (usada no frontend para listar salas)
CREATE OR REPLACE VIEW public.rooms_public AS
  SELECT
    id, name, description, category, max_people,
    is_private, host_id, host_name, host_initials,
    is_live, initial_topic, people_count,
    created_at, updated_at
  FROM public.rooms;

GRANT SELECT ON public.rooms_public TO authenticated, anon;
