-- ============================================================
-- AgroControl AI — Fase 2.4: Row Level Security (RLS)
-- 02_rls.sql
--
-- OBJETIVO:
--   Activar y configurar Row Level Security sobre las tablas
--   public.profiles, public.farms y public.lots creadas en
--   01_foundation.sql.
--
-- INSTRUCCIONES:
--   Ejecutar MANUALMENTE en el SQL Editor de Supabase DESPUÉS
--   de que 01_foundation.sql haya sido ejecutado con éxito.
--
--   Este script es IDEMPOTENTE: usa CREATE OR REPLACE FUNCTION,
--   DROP POLICY IF EXISTS y ALTER TABLE ... ENABLE ROW LEVEL
--   SECURITY, por lo que puede re-ejecutarse de forma segura.
--
--   ⚠️  NO ejecutar automáticamente. Revisión humana requerida.
--
--   Este script NO crea tablas nuevas, NO inserta datos y NO usa
--   la service_role key. Sólo activa RLS, define políticas y concede
--   los GRANTs base al rol `authenticated` (sección 8).
-- ============================================================

-- ============================================================
-- 0. Principio de diseño
-- ============================================================
-- - Los permisos se calculan SIEMPRE en PostgreSQL:
--     * auth.uid()            → identidad del usuario autenticado (JWT).
--     * public.profiles.rol   → rol de negocio desde la base de datos.
--   NUNCA se confía en datos enviados por el frontend para decidir
--   si una operación es permitida.
--
-- - Todas las políticas se limitan al rol `authenticated` (rol de
--   Supabase para usuarios con sesión). El rol `anon` y el público
--   general no obtienen ningún acceso.
--
-- - `postgres` (dueño de las tablas) sigue bypassing RLS; no es un
--   rol usado por el frontend.
-- ============================================================

-- ============================================================
-- 1. FUNCIÓN AUXILIAR: public.current_user_role()
-- ------------------------------------------------------------
-- Devuelve el rol de negocio del usuario autenticado leyendo SU
-- PROPIA fila en public.profiles (id = auth.uid()).
--
-- ¿Por qué SECURITY DEFINER aquí (y SOLO aquí)?
--   Una política sobre public.profiles NO puede consultar
--   public.profiles dentro de su propia expresión (provocaría
--   "recursión infinita en la política"). Ejecutando esta función
--   con los privilegios de su owner (el dueño de la tabla), la
--   consulta interna se ejecuta BYPASSEANDO RLS, rompiendo el bucle.
--   Es el caso de uso canónico y el ÚNICO que justifica
--   SECURITY DEFINER en este script.
--
-- Endurecimiento:
--   - SET search_path = public (previene hijacking de search_path).
--   - public.profiles y auth.uid() están 100% calificados.
--   - Se revoca EXECUTE del rol público/anon; sólo `authenticated`.
-- ============================================================
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT rol
  FROM public.profiles
  WHERE id = auth.uid();
$$;

-- Hardening adicional (producción):
--   1) Propietario EXPLÍCITO: una función SECURITY DEFINER se ejecuta con
--      los privilegios de SU OWNER. Fijar `postgres` como owner garantiza
--      que la lectura interna de profiles no quede atrapada por RLS y que
--      SOLO el dueño (superusuario) pueda ALTER / DROP / CREATE OR REPLACE.
--   2) Revocar TODOS los privilegios a los roles de aplicación y conceder
--      únicamente EXECUTE (necesario para que RLS evalúe las políticas).
--      Los roles de aplicación jamás podrán reemplazar la función.
ALTER FUNCTION public.current_user_role() OWNER TO postgres;

REVOKE ALL PRIVILEGES ON FUNCTION public.current_user_role() FROM PUBLIC, anon;
REVOKE ALL PRIVILEGES ON FUNCTION public.current_user_role() FROM authenticated;
GRANT  EXECUTE ON FUNCTION public.current_user_role() TO authenticated;

-- ============================================================
-- 2. ACTIVAR RLS SOBRE LAS TABLAS
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lots     ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. POLÍTICAS: public.profiles
-- ------------------------------------------------------------
-- CAMPESINO / AGRONOMO:
--   - SELECT de su propio registro únicamente (id = auth.uid()).
--   - Esta política mínima es además la base para que
--     current_user_role() funcione sin recursión.
--
-- SUPERADMIN:
--   - SELECT / INSERT / UPDATE / DELETE sobre TODOS los perfiles.
--   - No se concede UPDATE/DELETE/INSERT "propios" a CAMPESINO en
--     esta fase: la gestión/edición de perfiles la ejerce el
--     SUPERADMIN. (Documentado como decisión de fase.)
-- ============================================================

-- 3.1 Todo usuario autenticado lee SOLO su propio perfil
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- 3.2 SUPERADMIN lee todos los perfiles
DROP POLICY IF EXISTS profiles_select_superadmin ON public.profiles;
CREATE POLICY profiles_select_superadmin
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.current_user_role() = 'SUPERADMIN');

-- 3.3 SUPERADMIN crea perfiles (aprovisionamiento)
DROP POLICY IF EXISTS profiles_insert_superadmin ON public.profiles;
CREATE POLICY profiles_insert_superadmin
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.current_user_role() = 'SUPERADMIN');

-- 3.4 SUPERADMIN actualiza cualquier perfil (incluye promoción de rol)
DROP POLICY IF EXISTS profiles_update_superadmin ON public.profiles;
CREATE POLICY profiles_update_superadmin
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (public.current_user_role() = 'SUPERADMIN')
  WITH CHECK (public.current_user_role() = 'SUPERADMIN');

-- 3.5 SUPERADMIN elimina perfiles
DROP POLICY IF EXISTS profiles_delete_superadmin ON public.profiles;
CREATE POLICY profiles_delete_superadmin
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (public.current_user_role() = 'SUPERADMIN');

-- ============================================================
-- 4. POLÍTICAS: public.farms
-- ------------------------------------------------------------
-- CAMPESINO:
--   - SELECT  / UPDATE / DELETE solo de fincas propias
--     (owner_id = auth.uid()).
--   - INSERT solo si owner_id = auth.uid() (WITH CHECK): el cliente
--     NO puede registrarse fincas de terceros.
--   - UPDATE con WITH CHECK owner_id = auth.uid() impide transferir
--     la propiedad de la finca a otro usuario.
--
-- SUPERADMIN:
--   - Acceso total SELECT / INSERT / UPDATE / DELETE.
--
-- AGRONOMO:
--   - SIN políticas en esta fase. No existe aún tabla de asignación
--     finca↔agrónomo; no se inventa estructura. Ver sección 7.
-- ============================================================

-- 4.1 CAMPESINO: leer sus propias fincas
DROP POLICY IF EXISTS farms_select_owner ON public.farms;
CREATE POLICY farms_select_owner
  ON public.farms
  FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

-- 4.2 SUPERADMIN: leer todas las fincas
DROP POLICY IF EXISTS farms_select_superadmin ON public.farms;
CREATE POLICY farms_select_superadmin
  ON public.farms
  FOR SELECT
  TO authenticated
  USING (public.current_user_role() = 'SUPERADMIN');

-- 4.3 CAMPESINO: crear finca SOLO si él es el dueño
DROP POLICY IF EXISTS farms_insert_owner ON public.farms;
CREATE POLICY farms_insert_owner
  ON public.farms
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

-- 4.4 SUPERADMIN: crear cualquier finca
DROP POLICY IF EXISTS farms_insert_superadmin ON public.farms;
CREATE POLICY farms_insert_superadmin
  ON public.farms
  FOR INSERT
  TO authenticated
  WITH CHECK (public.current_user_role() = 'SUPERADMIN');

-- 4.5 CAMPESINO: actualizar SOLO sus propias fincas (sin transferencia)
DROP POLICY IF EXISTS farms_update_owner ON public.farms;
CREATE POLICY farms_update_owner
  ON public.farms
  FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- 4.6 SUPERADMIN: actualizar cualquier finca
DROP POLICY IF EXISTS farms_update_superadmin ON public.farms;
CREATE POLICY farms_update_superadmin
  ON public.farms
  FOR UPDATE
  TO authenticated
  USING (public.current_user_role() = 'SUPERADMIN')
  WITH CHECK (public.current_user_role() = 'SUPERADMIN');

-- 4.7 CAMPESINO: eliminar SOLO sus propias fincas
DROP POLICY IF EXISTS farms_delete_owner ON public.farms;
CREATE POLICY farms_delete_owner
  ON public.farms
  FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- 4.8 SUPERADMIN: eliminar cualquier finca
DROP POLICY IF EXISTS farms_delete_superadmin ON public.farms;
CREATE POLICY farms_delete_superadmin
  ON public.farms
  FOR DELETE
  TO authenticated
  USING (public.current_user_role() = 'SUPERADMIN');

-- ============================================================
-- 5. POLÍTICAS: public.lots
-- ------------------------------------------------------------
-- Los lotes NO tienen owner_id propio: su propietario se obtiene
-- a través de la finca padre (farms.owner_id). Para no confiar en
-- datos del cliente, cada política valida en PostgreSQL que la
-- finca del lote pertenezca al usuario autenticado mediante un
-- EXISTS sobre public.farms.
--
-- NOTA de recursión: el subquery consulta public.farms (tabla
-- distinta), cuyas propias políticas son seguras y no vuelven a
-- lotes. No hay recursión.
--
-- CAMPESINO:
--   - SELECT / UPDATE / DELETE solo de lotes cuya finca padre es
--     suya. UPDATE con WITH CHECK impide mover el lote a una finca
--     de terceros.
--   - INSERT solo si la finca padre (farm_id) le pertenece.
--
-- SUPERADMIN:
--   - Acceso total.
-- ============================================================

-- 5.1 CAMPESINO: leer lotes de SUS fincas
DROP POLICY IF EXISTS lots_select_owner ON public.lots;
CREATE POLICY lots_select_owner
  ON public.lots
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.farms f
      WHERE f.id = lots.farm_id
        AND f.owner_id = auth.uid()
    )
  );

-- 5.2 SUPERADMIN: leer todos los lotes
DROP POLICY IF EXISTS lots_select_superadmin ON public.lots;
CREATE POLICY lots_select_superadmin
  ON public.lots
  FOR SELECT
  TO authenticated
  USING (public.current_user_role() = 'SUPERADMIN');

-- 5.3 CAMPESINO: crear lote SOLO dentro de una finca propia
DROP POLICY IF EXISTS lots_insert_owner ON public.lots;
CREATE POLICY lots_insert_owner
  ON public.lots
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.farms f
      WHERE f.id = farm_id
        AND f.owner_id = auth.uid()
    )
  );

-- 5.4 SUPERADMIN: crear cualquier lote
DROP POLICY IF EXISTS lots_insert_superadmin ON public.lots;
CREATE POLICY lots_insert_superadmin
  ON public.lots
  FOR INSERT
  TO authenticated
  WITH CHECK (public.current_user_role() = 'SUPERADMIN');

-- 5.5 CAMPESINO: actualizar lote SOLO dentro de una finca propia
--     (USING valida el lote actual; WITH CHECK valida el lote nuevo,
--     incluyendo si intentan reasignar farm_id a finca ajena)
DROP POLICY IF EXISTS lots_update_owner ON public.lots;
CREATE POLICY lots_update_owner
  ON public.lots
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.farms f
      WHERE f.id = lots.farm_id
        AND f.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.farms f
      WHERE f.id = farm_id
        AND f.owner_id = auth.uid()
    )
  );

-- 5.6 SUPERADMIN: actualizar cualquier lote
DROP POLICY IF EXISTS lots_update_superadmin ON public.lots;
CREATE POLICY lots_update_superadmin
  ON public.lots
  FOR UPDATE
  TO authenticated
  USING (public.current_user_role() = 'SUPERADMIN')
  WITH CHECK (public.current_user_role() = 'SUPERADMIN');

-- 5.7 CAMPESINO: eliminar lote SOLO de una finca propia
DROP POLICY IF EXISTS lots_delete_owner ON public.lots;
CREATE POLICY lots_delete_owner
  ON public.lots
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.farms f
      WHERE f.id = lots.farm_id
        AND f.owner_id = auth.uid()
    )
  );

-- 5.8 SUPERADMIN: eliminar cualquier lote
DROP POLICY IF EXISTS lots_delete_superadmin ON public.lots;
CREATE POLICY lots_delete_superadmin
  ON public.lots
  FOR DELETE
  TO authenticated
  USING (public.current_user_role() = 'SUPERADMIN');

-- ============================================================
-- 6. RESUMEN DE ACCESOS (matriz)
-- ------------------------------------------------------------
-- | Tabla    | Acción  | CAMPESINO (auth.uid())          | SUPERADMIN                | AGRONOMO |
-- |----------|---------|----------------------------------|---------------------------|----------|
-- | profiles | SELECT  | solo propio                      | todos                     | propio   |
-- | profiles | INSERT  | — (solo vía trigger automático)  | sí                        | —        |
-- | profiles | UPDATE  | —                                | sí                        | —        |
-- | profiles | DELETE  | —                                | sí                        | —        |
-- | farms    | SELECT  | solo owner_id = auth.uid()       | todas                     | pendiente|
-- | farms    | INSERT  | solo owner_id = auth.uid()       | sí                        | pendiente|
-- | farms    | UPDATE  | solo propias (sin transferencia) | todas                     | pendiente|
-- | farms    | DELETE  | solo propias                     | todas                     | pendiente|
-- | lots     | SELECT  | fincas propias                   | todos                     | pendiente|
-- | lots     | INSERT  | fincas propias                   | todos                     | pendiente|
-- | lots     | UPDATE  | fincas propias (sin reasignar)   | todos                     | pendiente|
-- | lots     | DELETE  | fincas propias                   | todos                     | pendiente|
-- ============================================================

-- ============================================================
-- 7. DECISIONES PENDIENTES — AGRONOMO (documentación)
-- ------------------------------------------------------------
-- La Foundation actual (01_foundation.sql) NO incluye una tabla de
-- asignación finca↔agrónomo (p. ej. `agronomo_farm_assignments`
-- con farm_id, agronomo_id). Sin esa tabla NO se puede derivar de
-- forma segura "qué fincas supervisa tal agrónomo", por lo que:
--
--   1. En esta fase AGRONOMO NO recibe políticas sobre farms/lots.
--      (Sigue pudiendo leer su propio perfil.)
--   2. NO se crea la tabla de asignaciones aquí.
--      (Fuera del alcance de la Fase 2.4.)
--   3. Cuando exista la tabla de asignación, se deberá añadir:
--        - farms: SELECT para el agrónomo que esté asignado.
--        - lots : SELECT para lotes de fincas asignadas a ese agrónomo.
--        - JOIN obligatorio con la tabla de asignaciones (auth.uid()
--          contra agronomo_id), NUNCA confiando en el frontend.
--
-- Consecuencia intencional: mientras no exista dicha tabla, un
-- usuario con rol AGRONOMO no verá datos de fincas/lotes vía RLS.
-- La UI de agrónomo deberá permanecer sobre datos de demostración
-- (mock) hasta que llegue esa fase, sin romper Mock Mode.
--
-- PERFIL PROPIO (profiles):
--   - La edición/gestión de perfiles se delega al SUPERADMIN.
--   - Si en una fase futura se desea que CAMPESINO/AGRONOMO editen
--     su propio perfil (nombre/foto), se añadirá una política
--     `profiles_update_own` con USING id = auth.uid() y WITH CHECK
--     restringiendo la columna `rol` para impedir auto-promoción.
--
-- NO-TLC (best effort):
--   - Cualquier cambio futuro en estas políticas debe seguir el
--     principio: auth.uid() + public.profiles.rol, sin data del cliente.
-- ============================================================

-- ============================================================
-- 8. GRANTs: privilegio base para PostgREST (rol authenticated)
-- ------------------------------------------------------------
-- PostgreSQL evalúa en este orden:
--   1) ¿El rol tiene el privilegio base (GRANT) sobre la tabla?
--   2) ¿Alguna política RLS lo permite para ESTA fila?
--
-- Sin el GRANT, Postgres deniega con 42501 ("permission denied
-- for table ...") ANTES de evaluar las políticas, aunque éstas
-- existan y sean correctas. Por eso este bloque es OBLIGATORIO:
-- las secciones 3–5 definen QUIÉN puede ver QUÉ fila (políticas),
-- y aquí se concede la capacidad técnica de operar (sin la cual
-- nada funciona ni siquiera para el dueño de su propio perfil).
--
-- Seguridad:
--   - `authenticated` recibe los privilegios base, pero CADA fila
--     sigue filtrada por las políticas de las secciones 3–5.
--   - El rol `anon` NO recibe ningún GRANT aquí: sin sesión, sin datos.
--   - Sin GRANTs sobre secuencias: los id son UUID
--     (profiles.id referencia auth.users; farms/lots usan
--     gen_random_uuid()), no hay columnas serial/identity.
--
-- Idempotente: GRANT puede re-ejecutarse sin efectos secundarios.
-- ============================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farms    TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lots     TO authenticated;

-- ============================================================
-- ✅  Fase 2.4 lista para revisión/ejecución manual.
-- ============================================================