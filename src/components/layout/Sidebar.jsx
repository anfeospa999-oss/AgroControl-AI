import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Sprout,
  Stethoscope,
  BellRing,
  CalendarCheck,
  DollarSign,
  User,
  MapPin,
  ClipboardList,
  Users,
  BookOpen,
  ShieldCheck,
  Network,
  Cpu,
  LogOut,
  BrainCircuit
} from 'lucide-react';

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navByRole = {
    CAMPESINO: [
      { path: '/campesino/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/campesino/diagnosticos', label: 'Diagnósticos IA', icon: Stethoscope, badge: '3' },
      { path: '/campesino/lotes', label: 'Mis Lotes', icon: Sprout },
      { path: '/campesino/alertas', label: 'Alertas Tempranas', icon: BellRing, badge: '2', badgeColor: 'bg-amber-500' },
      { path: '/campesino/actividades', label: 'Actividades', icon: CalendarCheck },
      { path: '/campesino/finanzas', label: 'Finanzas & ROI', icon: DollarSign },
      { path: '/campesino/perfil', label: 'Mi Finca', icon: User }
    ],
    AGRONOMO: [
      { path: '/agronomo/dashboard', label: 'Dashboard Técnico', icon: LayoutDashboard },
      { path: '/agronomo/jurisdiccion', label: 'Fincas Supervision', icon: MapPin },
      { path: '/agronomo/tareas', label: 'Tareas & Visitas', icon: ClipboardList, badge: '1', badgeColor: 'bg-red-500' }
    ],
    SUPERADMIN: [
      { path: '/admin/dashboard', label: 'Dashboard General', icon: LayoutDashboard },
      { path: '/admin/users', label: 'Gestión Usuarios', icon: Users },
      { path: '/admin/knowledge', label: 'Base Conocimiento RAG', icon: BookOpen },
      { path: '/admin/audit', label: 'Auditoría & Logs', icon: ShieldCheck },
      { path: '/admin/ecosystem', label: 'Ecosistema & APIs', icon: Network },
      { path: '/admin/ai-usage', label: 'Consumo IA & LLM', icon: Cpu }
    ]
  };

  const navItems = navByRole[user?.rol] || navByRole.CAMPESINO;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-slate-950 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center space-x-3 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-900/40">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center">
              AgroControl <span className="ml-1 text-emerald-400 text-xs bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">AI</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Plataforma B2B Agrícola</p>
          </div>
        </div>

        {/* User Status Card in Sidebar */}
        <div className="mx-4 mt-4 p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center space-x-3">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"}
            alt={user?.nombre}
            className="w-10 h-10 rounded-xl object-cover border border-slate-700"
          />
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">{user?.nombre}</h4>
            <div className="flex items-center space-x-1 mt-0.5">
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 uppercase">
                {user?.rol}
              </span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Navegación {user?.rol}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-950/40'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${
                      item.badgeColor || 'bg-emerald-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-900">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-red-950/50 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-900/50 transition-all text-xs font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};
