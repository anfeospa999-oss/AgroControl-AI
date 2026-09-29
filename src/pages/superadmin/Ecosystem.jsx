import React from 'react';
import { MOCK_ECOSYSTEM } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Network, Server, RefreshCw } from 'lucide-react';
import { MockBadge } from '../../components/common/MockBadge';

export const SuperadminEcosystem = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
          <Network className="w-6 h-6 mr-2.5 text-purple-600" />
          Ecosistema Agrícola & Conexiones API
        </h1>
        <p className="text-xs text-slate-500 mt-1 flex items-center flex-wrap">
          Estado de enlaces satelitales Sentinel-2, estaciones meteorológicas IDEAM y Gateways IoT LoRaWAN.
          <MockBadge text="Próxima Integración" className="ml-2" />
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_ECOSYSTEM.map((eco) => (
          <Card key={eco.id} className="space-y-3 relative group">
            <MockBadge text="Datos Demo" className="hidden group-hover:inline-flex absolute -top-3 right-4 z-10" />
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{eco.tipo}</span>
              <Badge variant={eco.estado === 'Conectado' ? 'success' : 'warning'}>{eco.estado}</Badge>
            </div>
            <h3 className="text-sm font-bold text-slate-900">{eco.nombre}</h3>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Latencia: <strong className="text-slate-700">{eco.latencia}</strong></span>
              <span>Uptime: <strong className="text-emerald-600">{eco.uptime}</strong></span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
