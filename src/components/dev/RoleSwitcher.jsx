import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, UserCheck, Sprout, ChevronUp, ChevronDown } from 'lucide-react';

export const RoleSwitcher = () => {
  const { user, switchRole, isMockMode } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // ⚠️ Solo visible en Mock Mode (desarrollo / demo).
  // En sesión real (Supabase Auth, isMockMode = false) se oculta automáticamente.
  if (!isMockMode) return null;

  const roles = [
    {
      key: 'CAMPESINO',
      label: 'Campesino (Pedro Gómez)',
      icon: Sprout,
      color: 'bg-emerald-600 text-white',
      route: '/campesino/dashboard'
    },
    {
      key: 'AGRONOMO',
      label: 'Agrónomo (Carlos Ramírez)',
      icon: UserCheck,
      color: 'bg-blue-600 text-white',
      route: '/agronomo/dashboard'
    },
    {
      key: 'SUPERADMIN',
      label: 'Superadmin (Andrés Ospina)',
      icon: ShieldAlert,
      color: 'bg-purple-600 text-white',
      route: '/admin/dashboard'
    }
  ];

  const handleSelectRole = (roleKey, route) => {
    switchRole(roleKey);
    setIsOpen(false);
    navigate(route);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <div className="mb-3 bg-slate-900 text-white p-3 rounded-2xl shadow-2xl border border-slate-700 w-72 animate-in slide-in-from-bottom-2 duration-200">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
            ⚡ Alternador Rápido de Rol (Dev)
          </div>
          <div className="space-y-1.5">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = user?.rol === r.key;
              return (
                <button
                  key={r.key}
                  onClick={() => handleSelectRole(r.key, r.route)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{r.label}</span>
                  </div>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-2xl border border-slate-700 hover:bg-slate-800 transition-all font-semibold text-xs group"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-slate-300">Rol:</span>
        <span className="font-bold text-white uppercase tracking-wider">{user?.rol || 'CAMPESINO'}</span>
        {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
      </button>
    </div>
  );
};
