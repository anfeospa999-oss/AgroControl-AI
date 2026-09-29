import React from 'react';
import { MOCK_ACTIVIDADES } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { CalendarCheck, Plus, CheckCircle2, Clock, User, Tag } from 'lucide-react';

export const CampesinoActividades = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
            <CalendarCheck className="w-6 h-6 mr-2.5 text-emerald-600" />
            Cronograma y Labores Agrícolas
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Programación de tareas en finca: riego, fertilización, muestreo de suelos y recolección.
          </p>
        </div>
        <Button variant="primary" icon={Plus}>
          Programar Nueva Labor
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Labor / Tarea</th>
                <th className="py-3 px-4">Lote Destino</th>
                <th className="py-3 px-4">Fecha & Hora</th>
                <th className="py-3 px-4">Responsable</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {MOCK_ACTIVIDADES.map((act) => (
                <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>{act.titulo}</span>
                  </td>
                  <td className="py-3.5 px-4">{act.lote}</td>
                  <td className="py-3.5 px-4 text-slate-500">{act.fecha}</td>
                  <td className="py-3.5 px-4">{act.responsable}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={act.estado === 'Completada' ? 'success' : 'warning'}>
                      {act.estado}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
                      Marcar Completado
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
