import React from 'react';
import { MOCK_TAREAS_AGRONOMO } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ClipboardList, Plus, CheckCircle2 } from 'lucide-react';

export const AgronomoTareas = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
            <ClipboardList className="w-6 h-6 mr-2.5 text-blue-600" />
            Agenda y Tareas de Campo
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Programación de visitas técnicas, auditorías fitosanitarias y emisión de recomendaciones.
          </p>
        </div>
        <Button variant="primary" icon={Plus} className="bg-blue-600 hover:bg-blue-700">
          Agendar Nueva Visita
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Finca Destino</th>
                <th className="py-3 px-4">Campesino</th>
                <th className="py-3 px-4">Descripción de Tarea</th>
                <th className="py-3 px-4">Fecha / Hora</th>
                <th className="py-3 px-4">Prioridad</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {MOCK_TAREAS_AGRONOMO.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{t.finca}</td>
                  <td className="py-3.5 px-4">{t.campesino}</td>
                  <td className="py-3.5 px-4 text-slate-800">{t.tarea}</td>
                  <td className="py-3.5 px-4 text-slate-500">{t.fecha}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={t.prioridad === 'Urgente' ? 'danger' : t.prioridad === 'Alta' ? 'warning' : 'default'}>
                      {t.prioridad}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">
                      Firmar Visita →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
