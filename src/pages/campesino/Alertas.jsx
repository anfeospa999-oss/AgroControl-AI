import React from 'react';
import { MOCK_ALERTAS } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { BellRing, ShieldAlert, CloudRain, Bug, CheckCircle2, ArrowRight } from 'lucide-react';

export const CampesinoAlertas = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
          <BellRing className="w-6 h-6 mr-2.5 text-amber-500" />
          Centro de Alertas Temprana y Prevención
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Notificaciones meteorológicas avanzadas y alertas biológicas generadas por IA y estaciones climáticas.
        </p>
      </div>

      <div className="space-y-4">
        {MOCK_ALERTAS.map((alerta) => {
          const isCritical = alerta.prioridad === 'Crítica';
          const isHigh = alerta.prioridad === 'Alta';

          return (
            <Card
              key={alerta.id}
              className={`border-l-4 ${
                isCritical
                  ? 'border-l-red-600 bg-red-50/30'
                  : isHigh
                  ? 'border-l-amber-500 bg-amber-50/30'
                  : 'border-l-sky-500'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div
                    className={`p-3 rounded-2xl shrink-0 ${
                      isCritical ? 'bg-red-100 text-red-700' : isHigh ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
                    }`}
                  >
                    {alerta.tipo === 'Climática' ? (
                      <CloudRain className="w-6 h-6" />
                    ) : alerta.tipo === 'Plaga' ? (
                      <Bug className="w-6 h-6" />
                    ) : (
                      <ShieldAlert className="w-6 h-6" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{alerta.tipo}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-semibold text-slate-500">{alerta.fecha}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{alerta.titulo}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{alerta.descripcion}</p>

                    <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 text-xs">
                      <span className="text-slate-400 font-bold uppercase text-[10px] block">Acción Recomendada por IA:</span>
                      <span className="font-semibold text-emerald-800">{alerta.accionRecomendada}</span>
                    </div>
                  </div>
                </div>

                <div className="sm:text-right shrink-0 space-y-2">
                  <Badge variant={isCritical ? 'danger' : isHigh ? 'warning' : 'info'}>
                    Prioridad {alerta.prioridad}
                  </Badge>
                  <p className="text-xs text-slate-500 font-medium">{alerta.loteAfectado}</p>
                  <Button variant="primary" size="sm" icon={CheckCircle2} className="w-full sm:w-auto">
                    Resolver Alerta
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
