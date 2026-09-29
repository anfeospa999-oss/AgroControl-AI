/**
 * farmService.js
 * Capa de datos para public.farms con doble modo (Real → Supabase, Mock → mockData).
 * Patrón consistente con supabaseClient/AuthContext.
 *
 * - Real Mode: consultas con RLS; owner_id SIEMPRE es userId (el frontend no puede
 *   fabricar un owner_id arbitrario).
 * - Mock Mode: arrays en memoria sobre MOCK_FINCAS para que la demo siga funcionando.
 *
 * Forma de finca: { id, owner_id, nombre, departamento, hectareas, created_at, updated_at }
 */

import { supabase, IS_MOCK_MODE } from './supabaseClient';
import { MOCK_FINCAS } from '../data/mockData';

const FARM_FIELDS = 'id, owner_id, nombre, departamento, hectareas, created_at, updated_at';

// Copia mutable para Mock Mode (permite CRUD dentro de la sesión de demo)
let mockFarms = MOCK_FINCAS.map((f) => ({ ...f }));

/** Limpia el payload recibido: solo acepta los campos reales de public.farms. */
const sanitizeFarm = (data = {}) => {
  const clean = {};
  if (typeof data.nombre === 'string' && data.nombre.trim()) {
    clean.nombre = data.nombre.trim();
  }
  if (typeof data.departamento === 'string' && data.departamento.trim()) {
    clean.departamento = data.departamento.trim();
  }
  if (data.hectareas === '' || data.hectareas === null || data.hectareas === undefined) {
    clean.hectareas = null;
  } else {
    const ha = Number.parseFloat(data.hectareas);
    if (!Number.isNaN(ha) && ha >= 0) clean.hectareas = ha;
  }
  return clean;
};

/** Obtiene las fincas del usuario (en real mode, RLS garantiza que sean las suyas). */
export const getFarms = async (userId) => {
  if (IS_MOCK_MODE || !supabase) {
    const data = userId
      ? mockFarms.filter((f) => f.owner_id === userId)
      : [...mockFarms];
    return { data, error: null };
  }

  const { data, error } = await supabase
    .from('farms')
    .select(FARM_FIELDS)
    .eq('owner_id', userId)
    .order('created_at', { ascending: true });

  return { data: data ?? [], error };
};

/**
 * Crea una finca propiedad del usuario autenticado.
 * owner_id se fija desde el servidor de la llamada: nunca desde el payload.
 */
export const createFarm = async (userId, data) => {
  if (IS_MOCK_MODE || !supabase) {
    const farm = {
      id: `finc-mock-${Date.now()}`,
      owner_id: userId,
      nombre: sanitizeFarm(data).nombre || 'Finca sin nombre',
      departamento: sanitizeFarm(data).departamento ?? null,
      hectareas: sanitizeFarm(data).hectareas ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockFarms = [farm, ...mockFarms];
    return { data: farm, error: null };
  }

  const { data: created, error } = await supabase
    .from('farms')
    .insert({ owner_id: userId, ...sanitizeFarm(data) })
    .select(FARM_FIELDS)
    .single();

  return { data: created ?? null, error };
};

/** Edita una finca SIEMPRE acotada a su propietario (defensa en profundidad + RLS). */
export const updateFarm = async (farmId, userId, data) => {
  if (IS_MOCK_MODE || !supabase) {
    mockFarms = mockFarms.map((f) =>
      f.id === farmId && f.owner_id === userId
        ? { ...f, ...sanitizeFarm(data), updated_at: new Date().toISOString() }
        : f
    );
    const farm = mockFarms.find((f) => f.id === farmId) ?? null;
    return { data: farm, error: farm ? null : { message: 'Finca no encontrada.' } };
  }

  const { data: updated, error } = await supabase
    .from('farms')
    .update(sanitizeFarm(data))
    .eq('id', farmId)
    .eq('owner_id', userId)
    .select(FARM_FIELDS)
    .single();

  return { data: updated ?? null, error };
};

/** Elimina una finca del usuario. Los lotes se eliminan en cascada (FK ON DELETE CASCADE). */
export const deleteFarm = async (farmId, userId) => {
  if (IS_MOCK_MODE || !supabase) {
    mockFarms = mockFarms.filter((f) => f.id !== farmId || f.owner_id !== userId);
    return { data: null, error: null };
  }

  const { error } = await supabase
    .from('farms')
    .delete()
    .eq('id', farmId)
    .eq('owner_id', userId);

  return { data: null, error };
};