import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { MOCK_JURISDICCION_AGRONOMO, MOCK_DIAGNOSTICOS, MOCK_TAREAS_AGRONOMO } from '../../data/mockData';
import { UserCheck, MapPin, Stethoscope, AlertTriangle, CheckCircle2, ClipboardList, ArrowRight } from 'lucide-react';

export const AgronomoDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Agronomist Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-800/80 border border-blue-700/60 px-3 py-1 rounded-full text-xs font-semibold text-blue-200 mb-3">
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span>Agrónomo Supervisor • Zona Cafetera Norte</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Panel Técnico Fitoplanning: {user?.nombre}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl">
              Supervisando <strong className="text-white">12 Fincas Agrícolas</strong> (46.3 Ha totales). Tienes 1 diagnóstico pendiente de firma fitosanitaria.
            </p>
          </div>

          <Button variant="primary" icon={Stethoscope} className="bg-blue-600 hover:bg-blue-500">
            Validar Diagnósticos IA
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Fincas en Jurisdicción"
          value="12 Fincas"
          subtext="Manizales & Chinchiná"
          icon={MapPin}
          color="blue"
        />
        <StatCard
          title="Diagnósticos a Validar"
          value="1 Pendiente"
          subtext="Anthracnose en Lote 2"
          icon={Stethoscope}
          color="amber"
        />
        <StatCard
          title="Fincas Estado Crítico"
          value="1 Finca"
          subtext="Finca San José (65% salud)"
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Visitas Realizadas"
          value="18 Este Mes"
          subtext="100% Cobertura de agenda"
          icon={ClipboardList}
          color="emerald"
        />
      </div>

      {/* Main Grid: Pending Validation & Farm Jurisdiction List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card
            title="Diagnósticos Pendientes de Firma Técnica"
            subtitle="Validación agronómica para habilitar biopesticidas de receta"
          >
            <div className="space-y-4">
              {MOCK_DIAGNOSTICOS.filter((d) => d.estado.includes('Pendiente')).map((diag) => (
                <div key={diag.id} className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900">{diag.loteNombre}</span>
                    <Badge variant="warning">{diag.estado}</Badge>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{diag.patogenoDetectado}</h4>
                  <p className="text-xs text-slate-600">
                    <strong className="text-slate-800">Tratamiento IA:</strong> {diag.tratamientoSugerido}
                  </p>
                  <div className="pt-2 flex items-center justify-end space-x-2">
                    <Button variant="outline" size="sm">Ajustar Receta</Button>
                    <Button variant="primary" size="sm" icon={CheckCircle2} className="bg-blue-600 hover:bg-blue-700">
                      Firmar y Validar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Agenda de Visitas a Fincas">
            <div className="space-y-3">
              {MOCK_TAREAS_AGRONOMO.map((tarea) => (
                <div key={tarea.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-900">{tarea.finca}</span>
                    <Badge variant={tarea.prioridad === 'Alta' || tarea.prioridad === 'Urgente' ? 'danger' : 'default'}>
                      {tarea.prioridad}
                    </Badge>
                  </div>
                  <p className="text-slate-600">{tarea.tarea}</p>
                  <span className="text-[10px] text-slate-400 block pt-1">{tarea.fecha} • {tarea.campesino}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
