import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, Search, CloudSun, MapPin, ChevronDown } from 'lucide-react';
import { MockBadge } from '../common/MockBadge';
import { getFarms } from '../../services/farmService';

export const Navbar = ({ setMobileOpen }) => {
  const { user, isMockMode } = useAuth();
  const [farm, setFarm] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await getFarms(user?.id);
      if (active) {
        setFarm(Array.isArray(data) && data.length ? data[0] : null);
      }
    };
    if (user?.id) load();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const farmName = farm?.nombre || 'Sin finca registrada';

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Farm / Context Location Indicator */}
        <div className="hidden sm:flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>{farmName}</span>
          {farm?.departamento && (
            <>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 font-normal">{farm.departamento}</span>
            </>
          )}
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden lg:flex items-center max-w-md w-full mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar lotes, patógenos, diagnósticos o campesinos..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100/80 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Right Tools & Profile */}
      <div className="flex items-center space-x-3">
        {/* Weather Indicator — solo Mock Mode (el clima real aún no está implementado) */}
        {isMockMode && (
          <div className="flex items-center space-x-2 bg-sky-50 border border-sky-200/60 px-3 py-1.5 rounded-xl text-xs font-medium text-sky-800 relative group">
            <CloudSun className="w-4 h-4 text-sky-600" />
            <span className="font-bold">21°C</span>
            <span className="hidden xl:inline text-sky-600 mr-2">Parcialmente nublado</span>
            <MockBadge text="Datos Demo" className="hidden group-hover:inline-flex absolute -bottom-5 right-0 z-10" />
          </div>
        )}

        {/* Notifications Icon — funcionalidad no disponible; se muestra deshabilitada */}
        <button
          type="button"
          disabled
          title="Notificaciones — Próximamente"
          aria-label="Notificaciones (Próximamente)"
          className="relative p-2 text-slate-300 cursor-not-allowed select-none"
        >
          <Bell className="w-5 h-5" />
        </button>

        <div className="h-6 w-[1px] bg-slate-200"></div>

        {/* User Mini Profile */}
        <div className="flex items-center space-x-2.5 pl-1 cursor-pointer">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"}
            alt={user?.nombre}
            className="w-9 h-9 rounded-xl object-cover border border-slate-300 shadow-sm"
          />
          <div className="hidden sm:block text-left">
            <h4 className="text-xs font-bold text-slate-800 leading-tight">{user?.nombre}</h4>
            <span className="text-[10px] text-slate-500 font-medium">{user?.rol}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
};
