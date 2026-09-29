import React from 'react';
import { MOCK_FINANZAS } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { DollarSign, TrendingUp, Wallet, PieChart, ArrowUpRight } from 'lucide-react';

export const CampesinoFinanzas = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
          <DollarSign className="w-6 h-6 mr-2.5 text-emerald-600" />
          Finanzas, Rendimiento y ROI por Lote
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Estimación financiera de cosecha, costos de insumos, mano de obra y rentabilidad estimada.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ingresos Proyectados"
          value={MOCK_FINANZAS.resumenGeneral.ingresosProyectados}
          subtext="Basado en precios de mercado"
          icon={TrendingUp}
          trend="+12%"
          color="emerald"
        />
        <StatCard
          title="Costos Operativos"
          value={MOCK_FINANZAS.resumenGeneral.costosOperativos}
          subtext="Insumos + Mano de obra"
          icon={Wallet}
          color="amber"
        />
        <StatCard
          title="Margen Ganancia Neto"
          value={MOCK_FINANZAS.resumenGeneral.margenGananciaNeto}
          subtext="Margen operacional estimado"
          icon={PieChart}
          color="purple"
        />
        <StatCard
          title="ROI Estimado Finca"
          value={MOCK_FINANZAS.resumenGeneral.roiEstimado}
          subtext="Retorno sobre inversión"
          icon={DollarSign}
          color="blue"
        />
      </div>

      <Card title="Desglose Financiero por Lote Agrícola">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Lote</th>
                <th className="py-3 px-4">Gasto Insumos</th>
                <th className="py-3 px-4">Mano de Obra</th>
                <th className="py-3 px-4">Ingreso Esperado</th>
                <th className="py-3 px-4 text-right">ROI Proyectado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {MOCK_FINANZAS.desgloseLotes.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{row.lote}</td>
                  <td className="py-3.5 px-4 text-slate-600">{row.gastoInsumos}</td>
                  <td className="py-3.5 px-4 text-slate-600">{row.manoObra}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">{row.ingresoEsperado}</td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-emerald-600">
                    {row.roi}
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
