import React from 'react';
import { MOCK_AUDIT_LOGS } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { ShieldCheck, Lock, Terminal } from 'lucide-react';

export const SuperadminAudit = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
          <ShieldCheck className="w-6 h-6 mr-2.5 text-purple-600" />
          Registro de Auditoría & Trazabilidad de Seguridad
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Logs inmutables de acciones realizadas en la plataforma SaaS, IPs de origen y firmas digitales.
        </p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">Rol</th>
                <th className="py-3 px-4">Acción Ejecutada</th>
                <th className="py-3 px-4 text-right">Dirección IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {MOCK_AUDIT_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-slate-500">{log.timestamp}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{log.usuario}</td>
                  <td className="py-3 px-4">
                    <Badge variant={log.rol === 'SUPERADMIN' ? 'purple' : 'default'}>{log.rol}</Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-800">{log.accion}</td>
                  <td className="py-3 px-4 text-right text-slate-500">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
