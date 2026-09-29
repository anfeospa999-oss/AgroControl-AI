import React from 'react';
import { MOCK_JURISDICCION_AGRONOMO } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { MapPin, Phone, Calendar, ArrowRight } from 'lucide-react';

export const AgronomoJurisdiccion = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
          <MapPin className="w-6 h-6 mr-2.5 text-blue-600" />
          Fincas en Jurisdicción Agronómica
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Supervisión técnica de predios agrícolas, monitoreo de salud fitosanitaria y contacto directo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_JURISDICCION_AGRONOMO.map((finca) => (
          <Card key={finca.fincaId} className="space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{finca.nombreFinca}</h3>
                <p className="text-xs text-slate-500">{finca.municipio}</p>
              </div>
              <Badge variant={finca.alertasActivas > 0 ? 'warning' : 'success'}>
                {finca.saludGeneral}
              </Badge>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p><strong className="text-slate-800">Campesino Propietario:</strong> {finca.campesino}</p>
              <p><strong className="text-slate-800">Cultivos:</strong> {finca.cultivosPrincipales}</p>
              <p><strong className="text-slate-800">Extensión:</strong> {finca.superficie}</p>
              <p className="flex items-center text-slate-500">
                <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" /> {finca.contacto}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
              <span className="text-slate-400">Última visita: {finca.ultimaVisita}</span>
              <Button variant="outline" size="sm" icon={ArrowRight}>
                Ver Finca
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
