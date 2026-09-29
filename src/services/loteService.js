/**
 * loteService.js
 * Capa de datos para public.lots con doble modo (Real → Supabase, Mock → mockData).
 *
 * - Real Mode: consultas con RLS; el propietario se deriva de la finca padre
 *   (lots NO tiene owner_id, RLS lo valida vía farms.owner_id = auth.uid()).
 * - Mock Mode: arrays en memoria sobre MOCK_LOTES (se conservan los campos de
 *   telemetría SOLO como datos simulados para la demo).
 *
 * Forma de lote real: { id, farm_id, nombre, variedad_cafe, hectareas, created_at, updated_at }
 */

import { supabase, IS_MOCK_MODE } from './supabaseClient';
import { MOCK_FINCAS, MOCK_LOTES } from '../data/mockData';

const LOTE_FIELDS = 'id, farm_id, nombre, variedad_cafe, hectareas, created_at, updated_at';

const DEFAULT_MOCK_FARM_ID = MOCK_FINCAS[0]?.id ?? 'finc-mock-1';

// Copia mutable para Mock Mode. Se normaliza la forma de mock hacia la forma de DB,
// conservando los campos extra (telemetría) para que la demo no pierda visuales.
let mockLotes = MOCK_LOTES.map((l) => ({
  ...l,
  farm_id: l.farm_id || DEFAULT_MOCK_FARM_ID,
  variedad_cafe: l.variedad_cafe ?? l.variedad ?? null,
  hectareas: l.hectareas ?? (l.area ? Number.parseFloat(l.area) : null),
}));

/** Limpia el payload recibido: solo acepta los campos reales de public.lots. */
const sanitizeLote = (data = {}) => {
  const clean = {};
  if (typeof data.nombre === 'string' && data.nombre.trim()) {
    clean.nombre = data.nombre.trim();
  }
  if (typeof data.variedad_cafe === 'string' && data.variedad_cafe.trim()) {
    clean.variedad_cafe = data.variedad_cafe.trim();
  } else if (data.variedad_cafe === '' || data.variedad_cafe === null) {
    clean.variedad_cafe = null;
  }
  if (data.hectareas === '' || data.hectareas === null || data.hectareas === undefined) {
    clean.hectareas = null;
  } else {
    const ha = Number.parseFloat(data.hectareas);
    if (!Number.isNaN(ha) && ha >= 0) clean.hectareas = ha;
  }
  return clean;
};

/** Obtiene los lotes de una finca (RLS solo deja ver lotes de fincas propias). */
export const getLotes = async (farmId, _userId) => {
  if (IS_MOCK_MODE || !supabase) {
    const data = farmId
      ? mockLotes.filter((l) => l.farm_id === farmId)
      : [...mockLotes];
    return { data, error: null };
  }

  const { data, error } = await supabase
    .from('lots')
    .select(LOTE_FIELDS)
    .eq('farm_id', farmId)
    .order('created_at', { ascending: true });

  return { data: data ?? [], error };
};

/** Crea un lote dentro de la finca (RLS exige que la finca pertenezca al usuario). */
export const createLote = async (farmId, _userId, data) => {
  if (IS_MOCK_MODE || !supabase) {
    const lote = {
      id: `lote-mock-${Date.now()}`,
      farm_id: farmId,
      nombre: sanitizeLote(data).nombre || 'Lote sin nombre',
      variedad_cafe: sanitizeLote(data).variedad_cafe ?? null,
      hectareas: sanitizeLote(data).hectareas ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockLotes = [lote, ...mockLotes];
    return { data: lote, error: null };
  }

  const { data: created, error } = await supabase
    .from('lots')
    .insert({ farm_id: farmId, ...sanitizeLote(data) })
    .select(LOTE_FIELDS)
    .single();

  return { data: created ?? null, error };
};

/** Edita un lote acotado a su finca (defensa en profundidad + RLS). */
export const updateLote = async (loteId, farmId, _userId, data) => {
  if (IS_MOCK_MODE || !supabase) {
    mockLotes = mockLotes.map((l) =>
      l.id === loteId && l.farm_id === farmId
        ? { ...l, ...sanitizeLote(data), updated_at: new Date().toISOString() }
        : l
    );
    const lote = mockLotes.find((l) => l.id === loteId) ?? null;
    return { data: lote, error: lote ? null : { message: 'Lote no encontrado.' } };
  }

  const { data: updated, error } = await supabase
    .from('lots')
    .update(sanitizeLote(data))
    .eq('id', loteId)
    .eq('farm_id', farmId)
    .select(LOTE_FIELDS)
    .single();

  return { data: updated ?? null, error };
};

/** Elimina un lote acotado a su finca. */
export const deleteLote = async (loteId, farmId, _userId) => {
  if (IS_MOCK_MODE || !supabase) {
    mockLotes = mockLotes.filter((l) => l.id !== loteId || l.farm_id !== farmId);
    return { data: null, error: null };
  }

  const { error } = await supabase
    .from('lots')
    .delete()
    .eq('id', loteId)
    .eq('farm_id', farmId);

  return { data: null, error };
};