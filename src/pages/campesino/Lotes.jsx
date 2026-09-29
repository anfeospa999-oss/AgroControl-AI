import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { MockBadge } from '../../components/common/MockBadge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { getFarms } from '../../services/farmService';
import { getLotes, createLote, updateLote, deleteLote } from '../../services/loteService';
import { Sprout, Plus, Droplets, Thermometer, Edit3, Trash2, MapPin, RefreshCw } from 'lucide-react';

const EMPTY_FORM = { nombre: '', variedad_cafe: '', hectareas: '' };

export const CampesinoLotes = () => {
  const { user, isMockMode } = useAuth();
  const navigate = useNavigate();

  const [farm, setFarm] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState(null);

  const load = useCallback(async () => {
    const { data: farms, error: farmError } = await getFarms(user?.id);
    if (farmError) {
      setError('No se pudieron cargar tus fincas. Revisa tu conexión e intenta de nuevo.');
      setLoading(false);
      return;
    }

    // MVP: trabajamos con la primera finca del usuario.
    const primera = Array.isArray(farms) && farms.length ? farms[0] : null;
    setFarm(primera);

    if (primera) {
      const { data: lotesData, error: lotesError } = await getLotes(primera.id, user?.id);
      if (lotesError) {
        setError('No se pudieron cargar tus lotes. Revisa tu conexión e intenta de nuevo.');
        setLotes([]);
      } else {
        setError(null);
        setLotes(Array.isArray(lotesData) ? lotesData : []);
      }
    } else {
      setLotes([]);
    }

    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) load();
  }, [user?.id, load]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEdit = (lote) => {
    setEditing(lote);
    setForm({
      nombre: lote.nombre ?? '',
      variedad_cafe: lote.variedad_cafe ?? '',
      hectareas: lote.hectareas ?? '',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!form.nombre?.trim()) {
      setFormError('El nombre del lote es obligatorio.');
      return;
    }

    setSaving(true);
    const payload = {
      nombre: form.nombre,
      variedad_cafe: form.variedad_cafe,
      hectareas: form.hectareas,
    };

    if (editing) {
      const { error: err } = await updateLote(editing.id, farm.id, user?.id, payload);
      if (err) {
        setFormError('No se pudo guardar el lote. Intenta de nuevo.');
        setSaving(false);
        return;
      }
    } else {
      const { error: err } = await createLote(farm.id, user?.id, payload);
      if (err) {
        setFormError('No se pudo crear el lote. Intenta de nuevo.');
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setIsModalOpen(false);
    load();
  };

  const handleDelete = async (lote) => {
    const ok = window.confirm(`¿Eliminar el lote "${lote.nombre}"?`);
    if (!ok) return;

    const { error: err } = await deleteLote(lote.id, farm.id, user?.id);
    if (err) {
      window.alert('No se pudo eliminar el lote. Intenta de nuevo.');
      return;
    }
    load();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
            <Sprout className="w-6 h-6 mr-2.5 text-emerald-600" />
            Mis Lotes
            {isMockMode && <MockBadge text="Sensores Simulados" className="ml-3 hidden sm:inline-flex" />}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {farm
              ? `Lotes de ${farm.nombre} • ${lotes.length} registrado(s)`
              : 'Registra lotes de cultivo dentro de tu finca.'}
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => (farm ? openCreate() : navigate('/campesino/perfil'))}
        >
          Registrar Lote
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton count={2} type="card" />
      ) : error ? (
        <Card className="p-6">
          <div className="space-y-3">
            <p className="text-xs text-red-600 font-semibold">{error}</p>
            <Button variant="outline" icon={RefreshCw} onClick={load}>
              Reintentar
            </Button>
          </div>
        </Card>
      ) : !farm ? (
        <Card className="p-10 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Primero registra tu finca.</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Los lotes pertenecen a una finca. Ve a "Mi Finca" para registrar tu predio antes de crear lotes.
          </p>
          <div className="mt-5 flex justify-center">
            <Button variant="primary" onClick={() => navigate('/campesino/perfil')}>
              Ir a Mi Finca
            </Button>
          </div>
        </Card>
      ) : lotes.length === 0 ? (
        <Card className="p-10 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
            <Sprout className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Aún no tienes lotes registrados.</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Crea tu primer lote dentro de {farm.nombre}: nombre, variedad de café y hectáreas.
          </p>
          <div className="mt-5 flex justify-center">
            <Button variant="primary" icon={Plus} onClick={openCreate}>
              Registrar lote
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lotes.map((lote) => {
            const hasTelemetry = !!lote.humedadSuelo;
            const estado = lote.estadoSalud;
            return (
              <Card key={lote.id} className="overflow-hidden p-0 hover:shadow-md transition-shadow">
                <div className="px-6 pt-5 pb-4 bg-gradient-to-r from-emerald-900 to-green-900 text-white">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold">{lote.nombre}</h3>
                      <p className="text-xs text-emerald-100/80 mt-0.5">
                        {lote.variedad_cafe || 'Sin variedad registrada'}
                      </p>
                    </div>
                    {estado && (
                      <Badge variant={estado === 'Crítico' ? 'danger' : estado.includes('Riesgo') ? 'warning' : 'success'}>
                        {estado}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Variedad</span>
                      <span className="text-sm font-extrabold text-slate-800 mt-0.5 block">
                        {lote.variedad_cafe || '—'}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Superficie</span>
                      <span className="text-sm font-extrabold text-emerald-600 mt-0.5 block">
                        {lote.hectareas != null ? `${Number(lote.hectareas)} Ha` : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Telemetría: solo existe en Mock Mode (datos simulados) */}
                  {hasTelemetry && (
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Humedad Suelo</span>
                        <span className="text-sm font-extrabold text-slate-800 flex items-center justify-center mt-0.5">
                          <Droplets className="w-3.5 h-3.5 mr-1 text-sky-500" />
                          {lote.humedadSuelo}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">pH Suelo</span>
                        <span className="text-sm font-extrabold text-slate-800 flex items-center justify-center mt-0.5">
                          <Thermometer className="w-3.5 h-3.5 mr-1 text-amber-500" />
                          {lote.phSuelo}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Índice NDVI</span>
                        <span className="text-sm font-extrabold text-emerald-600 mt-0.5 block">
                          {lote.ndviIndex} / 1.0
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {hasTelemetry && (
                      <span className="text-xs text-slate-400">
                        Sensor ID: <code className="text-slate-500">LORA-{lote.id.toUpperCase()}</code>
                      </span>
                    )}
                    <div className="flex items-center gap-2 ml-auto">
                      <Button variant="outline" size="sm" icon={Edit3} onClick={() => openEdit(lote)}>
                        Editar
                      </Button>
                      <Button variant="danger" size="sm" icon={Trash2} onClick={() => handleDelete(lote)}>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          if (!saving) setIsModalOpen(false);
        }}
        title={editing ? '✏️ Editar Lote' : '➕ Registrar Lote'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Nombre del lote *</label>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: Lote Café 1"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Variedad de café</label>
            <input
              type="text"
              value={form.variedad_cafe}
              onChange={(e) => setForm({ ...form, variedad_cafe: e.target.value })}
              placeholder="Ej: Café Castillo"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Hectáreas</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.hectareas}
              onChange={(e) => setForm({ ...form, hectareas: e.target.value })}
              placeholder="Ej: 4.2"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
            />
          </div>

          {formError && (
            <p className="text-[11px] font-semibold text-red-600">{formError}</p>
          )}

          <div className="pt-2 flex items-center justify-end space-x-3">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" loading={saving}>
              {editing ? 'Guardar Cambios' : 'Registrar Lote'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};