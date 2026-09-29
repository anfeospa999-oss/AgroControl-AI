import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ShieldAlert, Users, Cpu, Activity, Server, Network } from 'lucide-react';
import { MockBadge } from '../../components/common/MockBadge';

export const SuperadminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Admin Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-purple-900/80 border border-purple-700/60 px-3 py-1 rounded-full text-xs font-semibold text-purple-200 mb-3">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>SaaS Control Center • Superadmin</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center">
              Bienvenido, {user?.nombre} ⚡
              <MockBadge text="Panel Simulado" className="ml-3 hidden sm:inline-flex" />
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl">
              Estado del sistema: <strong className="text-emerald-400">99.98% Uptime</strong>. Procesando 48,920 tokens LLM/día en 24 fincas conectadas.
            </p>
          </div>

          <Button variant="primary" icon={Server} className="bg-purple-600 hover:bg-purple-700">
            Monitor de Nodos LLM
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Usuarios Totales SaaS"
          value="1,420"
          subtext="Campesinos, Agrónomos, Admins"
          icon={Users}
          trend="+18.4%"
          color="purple"
        />
        <StatCard
          title="Consumo LLM Hoy"
          value="48,920"
          subtext="Tokens consumidos en RAG"
          icon={Cpu}
          trend="+5.1%"
          color="blue"
        />
        <StatCard
          title="Latencia Promedio API"
          value="410 ms"
          subtext="AgroVision AI Pipeline"
          icon={Activity}
          color="emerald"
        />
        <StatCard
          title="APIs de Terceros"
          value="4 Conexiones"
          subtext="Sentinel-2, IDEAM, LoRaWAN"
          icon={Network}
          color="amber"
        />
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Salud de Microservicios & Pipelines IA">
          <div className="space-y-3">
            {[
              { service: 'AgroVision Vision Model Engine (Gemini 1.5 Pro)', status: 'Operacional', ping: '380ms' },
              { service: 'Vector Database Pinecone (Fitopatología RAG)', status: 'Operacional', ping: '120ms' },
              { service: 'IoT Gateway MQTT/LoRaWAN Receiver', status: 'Operacional', ping: '45ms' },
              { service: 'Sentinel-2 Satellite Image Pipeline (ESA)', status: 'Sincronizado', ping: '850ms' }
            ].map((s, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs">
                <span className="font-bold text-slate-800">{s.service}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400">{s.ping}</span>
                  <Badge variant="success">{s.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Actividad Reciente del Ecosistema">
          <div className="space-y-3 text-xs">
            {[
              { text: 'Nuevo usuario campesino registrado: María Lucía Fernández (Hacienda La Esperanza)', time: 'Hace 12 min' },
              { text: 'Firma de certificación fitosanitaria emitida por Dr. Carlos Ramírez', time: 'Hace 45 min' },
              { text: 'Re-entrenamiento automático de base RAG completado (+120 nuevos vectores)', time: 'Hace 2 horas' }
            ].map((act, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                <p className="font-medium text-slate-800">{act.text}</p>
                <span className="text-[10px] text-slate-400">{act.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
