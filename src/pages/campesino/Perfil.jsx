import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { MockBadge } from '../../components/common/MockBadge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { getFarms, createFarm, updateFarm, deleteFarm } from '../../services/farmService';
import { Home, MapPin, Ruler, Plus, Edit3, Trash2, Mail, User, RefreshCw } from 'lucide-react';

const EMPTY_FORM = { nombre: '', departamento: '', hectareas: '' };

export const CampesinoPerfil = () => {
  const { user, isMockMode } = useAuth();
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState(null);

  const load = useCallback(async () => {
    const { data, error: err } = await getFarms(user?.id);
    if (err) {
      setError('No se pudieron cargar tus fincas. Revisa tu conexión e intenta de nuevo.');
      setFarm(null);
      setLoading(false);
      return;
    }
    // MVP: el modelo permite varias fincas; la interfaz "Mi Finca" usa la primera.
    setFarm(Array.isArray(data) && data.length ? data[0] : null);
    setError(null);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) load();
  }, [user?.id, load]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEdit = () => {
    if (!farm) return;
    setForm({
      nombre: farm.nombre ?? '',
      departamento: farm.departamento ?? '',
      hectareas: farm.hectareas ?? '',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!form.nombre?.trim()) {
      setFormError('El nombre de la finca es obligatorio.');
      return;
    }

    setSaving(true);
    const payload = {
      nombre: form.nombre,
      departamento: form.departamento,
      hectareas: form.hectareas,
    };

    if (farm) {
      const { error: err } = await updateFarm(farm.id, user?.id, payload);
      if (err) {
        setFormError('No se pudo guardar la finca. Intenta de nuevo.');
        setSaving(false);
        return;
      }
    } else {
      const { error: err } = await createFarm(user?.id, payload);
      if (err) {
        setFormError('No se pudo crear la finca. Intenta de nuevo.');
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setIsModalOpen(false);
    load();
  };

  const handleDelete = async () => {
    if (!farm) return;
    const ok = window.confirm(`¿Eliminar la finca "${farm.nombre}"? Esta acción no se puede deshacer y eliminará también sus lotes.`);
    if (!ok) return;

    setDeleting(true);
    const { error: err } = await deleteFarm(farm.id, user?.id);
    setDeleting(false);
    if (err) {
      window.alert('No se pudo eliminar la finca. Intenta de nuevo.');
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
            <Home className="w-6 h-6 mr-2.5 text-emerald-600" />
            Mi Finca
            {isMockMode && <MockBadge text="Datos Demo" className="ml-3 hidden sm:inline-flex" />}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Información catastral de tu predio y sus especificaciones agrológicas.
          </p>
        </div>
        {!isModalOpen && (
          <Button variant="primary" icon={Plus} onClick={openCreate}>
            Registrar Finca
          </Button>
        )}
      </div>

      {/* User identity (datos reales de Auth/profiles) */}
      <Card className="p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'}
            alt={user?.nombre}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
          />
          <div className="flex-1">
            <h2 className="text-base font-bold text-slate-900">{user?.nombre}</h2>
            <p className="text-xs text-slate-500 font-medium">Propietario / Agricultor</p>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <Badge variant="success">{user?.rol}</Badge>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {user?.email}
              </span>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Cuenta</span>
            <p className="text-xs font-semibold text-slate-700">{user?.email}</p>
          </div>
        </div>
      </Card>

      {/* Farm content */}
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
            <Home className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Aún no tienes una finca registrada.</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Registra tu finca para empezar a trabajar con datos reales: nombre, ubicación y área.
          </p>
          <div className="mt-5 flex justify-center">
            <Button variant="primary" icon={Plus} onClick={openCreate}>
              Registrar finca
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="space-y-4 p-0 overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-emerald-900 to-green-900 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black tracking-tight">{farm.nombre}</h3>
                <p className="text-xs text-emerald-100/80 mt-0.5">
                  Registrada el {new Date(farm.created_at).toLocaleDateString('es-CO')}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="bg-emerald-800/40 border border-emerald-700/40 rounded-xl px-3 py-2">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold block">Departamento</span>
                  <span className="text-sm font-bold truncate max-w-[120px] block">{farm.departamento || 'Sin especificar'}</span>
                </div>
                <div className="bg-emerald-800/40 border border-emerald-700/40 rounded-xl px-3 py-2">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold block">Área</span>
                  <span className="text-sm font-bold">{farm.hectareas != null ? `${Number(farm.hectareas)} Ha` : 'Sin especificar'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 pt-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl">
                <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Ubicación
                </span>
                <p className="mt-0.5 font-semibold text-slate-800">{farm.departamento || 'Sin especificar'}</p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl">
                <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5" /> Área Total
                </span>
                <p className="mt-0.5 font-semibold text-slate-800">
                  {farm.hectareas != null ? `${Number(farm.hectareas)} Hectáreas` : 'Sin especificar'}
                </p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl">
                <span className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> Propietario
                </span>
                <p className="mt-0.5 font-semibold text-slate-800">{user?.nombre || 'Sin asignar'}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <Button variant="outline" icon={Edit3} onClick={openEdit}>
                Editar Finca
              </Button>
              <Button
                variant="danger"
                icon={Trash2}
                onClick={handleDelete}
                loading={deleting}
                className="sm:w-auto"
              >
                Eliminar Finca
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          if (!saving) setIsModalOpen(false);
        }}
        title={farm ? '✏️ Editar Mi Finca' : '➕ Registrar Mi Finca'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Nombre de la finca *</label>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: Finca El Porvenir"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Ubicación / Departamento</label>
            <input
              type="text"
              value={form.departamento}
              onChange={(e) => setForm({ ...form, departamento: e.target.value })}
              placeholder="Ej: Chinchiná, Caldas"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Área (hectáreas)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.hectareas}
              onChange={(e) => setForm({ ...form, hectareas: e.target.value })}
              placeholder="Ej: 14.5"
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
              {farm ? 'Guardar Cambios' : 'Registrar Finca'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};