import React from 'react';
import { MOCK_AI_USAGE } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Cpu, DollarSign, Activity, Zap } from 'lucide-react';
import { MockBadge } from '../../components/common/MockBadge';

export const SuperadminAiUsage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
          <Cpu className="w-6 h-6 mr-2.5 text-purple-600" />
          Consumo de Tokens IA & Modelos LLM
          <MockBadge text="Costos Simulados" className="ml-3 hidden sm:inline-flex" />
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Métricas de inferencia en tiempo real, latencias de modelos de visión foliar y costos operativos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tokens Consumidos Hoy"
          value={MOCK_AI_USAGE.resumenTokens.totalTokensHoy}
          subtext="Total de inferencias RAG"
          icon={Cpu}
          color="purple"
        />
        <StatCard
          title="Costo Diario Estimado"
          value={MOCK_AI_USAGE.resumenTokens.costoDiarioEstimado}
          subtext="Modelos Vision + LLM"
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Latencia Promedio"
          value={MOCK_AI_USAGE.resumenTokens.latenciaPromedio}
          subtext="Respuesta API AgroVision"
          icon={Activity}
          color="blue"
        />
        <StatCard
          title="Tasa Éxito Consultas"
          value={MOCK_AI_USAGE.resumenTokens.tasaExitoConsultas}
          subtext="0 Errores de API reportados"
          icon={Zap}
          color="emerald"
        />
      </div>

      <Card title="Desglose por Modelo de Inteligencia Artificial">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Modelo IA / Motor</th>
                <th className="py-3 px-4">Consultas Hoy</th>
                <th className="py-3 px-4">Tokens Procesados</th>
                <th className="py-3 px-4 text-right">Costo Estimado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {MOCK_AI_USAGE.consumoPorModelo.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{m.modelo}</td>
                  <td className="py-3.5 px-4">{m.consultas.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-mono text-purple-700 font-bold">{m.tokens}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-600">{m.costo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
