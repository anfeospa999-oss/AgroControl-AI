/**
 * supabaseClient.js
 * Cliente de Supabase con Graceful Degradation.
 *
 * - Si VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY están definidas → cliente real activo.
 * - Si no → supabase = null, IS_MOCK_MODE = true, console.warn descriptivo.
 *   La aplicación sigue funcionando con Mock Data sin ningún crash.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const IS_MOCK_MODE = !supabaseUrl || !supabaseAnonKey;

if (IS_MOCK_MODE) {
  console.warn(
    '[AgroControl] ⚠️  MOCK MODE ACTIVO: Las variables VITE_SUPABASE_URL y/o ' +
    'VITE_SUPABASE_ANON_KEY no están definidas en .env. ' +
    'La aplicación funciona con datos simulados. ' +
    'Copia .env.example a .env y configura tus credenciales de Supabase para activar la base de datos real.'
  );
}

/**
 * Cliente de Supabase. Será `null` en Mock Mode.
 * Siempre valida: `if (!supabase) { /* usar mock *‌/ }` antes de llamar a la BD.
 * @type {import('@supabase/supabase-js').SupabaseClient | null}
 */
export const supabase = IS_MOCK_MODE
  ? null
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Persiste la sesión en localStorage automáticamente
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
