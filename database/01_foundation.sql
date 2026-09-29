-- ============================================================
-- AgroControl AI — Fase 2.1: Supabase Foundation
-- 01_foundation.sql
--
-- INSTRUCCIONES:
--   Ejecutar MANUALMENTE en el SQL Editor de Supabase.
--   Este script es idempotente: puede ejecutarse múltiples
--   veces sin error gracias a las cláusulas IF NOT EXISTS
--   y DO $$ ... IF NOT EXISTS $$ para el ENUM.
--
-- ⚠️  NO ejecutar automáticamente. Revisión humana requerida.
-- ============================================================

-- ============================================================
-- 1. TIPO ENUM: user_role
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'user_role'
  ) THEN
    CREATE TYPE public.user_role AS ENUM (
      'SUPERADMIN',
      'AGRONOMO',
      'CAMPESINO'
    );
  END IF;
END
$$;

-- ============================================================
-- 2. TABLA: profiles
--    Vinculada 1:1 con auth.users mediante FK con CASCADE.
--    Se crea automáticamente al registrarse un usuario
--    a través del trigger `on_auth_user_created`.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID          NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  nombre      TEXT,
  email       TEXT,
  rol         public.user_role NOT NULL DEFAULT 'CAMPESINO',
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),

  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

-- Índice de consulta frecuente por email
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (email);
CREATE INDEX IF NOT EXISTS idx_profiles_rol   ON public.profiles (rol);

-- ============================================================
-- 3. TABLA: farms
--    Representa una finca registrada en la plataforma.
--    owner_id apunta al profile del dueño (CAMPESINO).
-- ============================================================
CREATE TABLE IF NOT EXISTS public.farms (
  id            UUID          NOT NULL DEFAULT gen_random_uuid(),
  owner_id      UUID          NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  nombre        TEXT          NOT NULL,
  departamento  TEXT,
  hectareas     NUMERIC(8, 2),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),

  CONSTRAINT farms_pkey PRIMARY KEY (id)
);

-- Índice para búsquedas por propietario
CREATE INDEX IF NOT EXISTS idx_farms_owner_id ON public.farms (owner_id);

-- ============================================================
-- 4. TABLA: lots
--    Representa un lote de cultivo dentro de una finca.
--    farm_id apunta a la finca padre.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lots (
  id             UUID          NOT NULL DEFAULT gen_random_uuid(),
  farm_id        UUID          NOT NULL REFERENCES public.farms (id) ON DELETE CASCADE,
  nombre         TEXT          NOT NULL,
  variedad_cafe  TEXT,
  hectareas      NUMERIC(8, 2),
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),

  CONSTRAINT lots_pkey PRIMARY KEY (id)
);

-- Índice para búsquedas por finca
CREATE INDEX IF NOT EXISTS idx_lots_farm_id ON public.lots (farm_id);

-- ============================================================
-- 5. FUNCIÓN: handle_new_user()
--    Crea un registro en public.profiles cada vez que
--    auth.users registra un nuevo usuario.
--
--    Extrae nombre y email de los metadatos de Auth si existen.
--    SECURITY DEFINER permite ejecutar con privilegios del dueño
--    de la función (postgres), superando las restricciones de RLS.
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, email, rol)
  VALUES (
    NEW.id,
    -- Extrae el nombre de los metadatos de Auth (Google OAuth, magic link, etc.)
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      split_part(NEW.email, '@', 1)   -- fallback: parte local del email
    ),
    NEW.email,
    'CAMPESINO'   -- rol por defecto para todo nuevo registro
  )
  ON CONFLICT (id) DO NOTHING;  -- idempotente: no falla si el perfil ya existe

  RETURN NEW;
END;
$$;

-- ============================================================
-- 6. TRIGGER: on_auth_user_created
--    Dispara handle_new_user() después de cada INSERT en
--    auth.users. Se elimina primero si ya existe para que
--    el script sea re-ejecutable de forma segura.
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 7. FUNCIÓN AUXILIAR: update_updated_at()
--    Actualiza automáticamente la columna updated_at en
--    cualquier tabla que la utilice.
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers de updated_at para cada tabla
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_farms_updated_at ON public.farms;
CREATE TRIGGER set_farms_updated_at
  BEFORE UPDATE ON public.farms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS set_lots_updated_at ON public.lots;
CREATE TRIGGER set_lots_updated_at
  BEFORE UPDATE ON public.lots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- ✅  Script completado. Estructura lista para Fase 2.2 (RLS).
-- ============================================================
