import React, { useState } from 'react';
import { MOCK_DIAGNOSTICOS } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Stethoscope, Sparkles, Filter, CheckCircle2, AlertCircle, Eye } from 'lucide-react';

export const CampesinoDiagnosticos = () => {
  const [filter, setFilter] = useState('TODOS');

  const filteredDiagnosticos = MOCK_DIAGNOSTICOS.filter((d) => {
    if (filter === 'TODOS') return true;
    if (filter === 'CRITICOS') return d.severidad === 'Crítica' || d.severidad === 'Alta';
    if (filter === 'VALIDADOS') return d.estado.includes('Validado');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
            <Stethoscope className="w-6 h-6 mr-2.5 text-emerald-600" />
            Historial de Diagnósticos Fitosanitarios IA
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registro continuo de detecciones automáticas de patógenos y recomendaciones biológicas.
          </p>
        </div>
        <Button variant="primary" icon={Sparkles}>
          Nuevo Diagnóstico IA
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <span className="text-xs text-slate-400 font-medium mr-2 flex items-center">
          <Filter className="w-3.5 h-3.5 mr-1" /> Filtrar:
        </span>
        {['TODOS', 'CRITICOS', 'VALIDADOS'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === f
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f === 'TODOS' ? 'Todos los Diagnósticos' : f === 'CRITICOS' ? 'Alta Severidad' : 'Validados por Agrónomo'}
          </button>
        ))}
      </div>

      {/* Diagnoses List Cards */}
      <div className="space-y-4">
        {filteredDiagnosticos.map((diag) => (
          <Card key={diag.id} className="hover:border-slate-300 transition-all">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Image Thumbnail */}
              <div className="w-full lg:w-48 h-36 rounded-xl overflow-hidden shrink-0 relative bg-slate-100">
                <img src={diag.imagenMuestra} alt={diag.patogenoDetectado} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2">
                  <Badge variant={diag.severidad === 'Crítica' ? 'danger' : diag.severidad === 'Alta' ? 'danger' : 'warning'}>
                    Severidad {diag.severidad}
                  </Badge>
                </div>
              </div>

              {/* Diagnosis Details */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">{diag.loteNombre}</span>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">{diag.patogenoDetectado}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">{diag.fecha}</span>
                    <Badge variant="success" className="mt-1">
                      IA Confianza: {diag.confianzaAi}%
                    </Badge>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 text-slate-600">
                  <p><strong className="text-slate-800">Síntoma observado:</strong> {diag.sintoma}</p>
                  <p><strong className="text-slate-800">Tratamiento sugerido:</strong> {diag.tratamientoSugerido}</p>
                  <p className="text-emerald-700 font-medium">🌱 <strong className="text-emerald-900">Biopesticida:</strong> {diag.biopesticidaRecomendado}</p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500 italic">Agrónomo Supervisor: {diag.agronomoAsignado}</span>
                  <Button variant="outline" size="sm" icon={Eye}>
                    Ver Informe Completo
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
