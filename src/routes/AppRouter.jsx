import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layout
import { Layout } from '../components/layout/Layout';

// Public Page
import { Login } from '../pages/auth/Login';

// Campesino Pages
import { CampesinoDashboard } from '../pages/campesino/Dashboard';
import { CampesinoDiagnosticos } from '../pages/campesino/Diagnosticos';
import { CampesinoLotes } from '../pages/campesino/Lotes';
import { CampesinoAlertas } from '../pages/campesino/Alertas';
import { CampesinoActividades } from '../pages/campesino/Actividades';
import { CampesinoPerfil } from '../pages/campesino/Perfil';
import { CampesinoFinanzas } from '../pages/campesino/Finanzas';

// Agrónomo Pages
import { AgronomoDashboard } from '../pages/agronomo/Dashboard';
import { AgronomoJurisdiccion } from '../pages/agronomo/Jurisdiccion';
import { AgronomoTareas } from '../pages/agronomo/Tareas';

// Superadmin Pages
import { SuperadminDashboard } from '../pages/superadmin/Dashboard';
import { SuperadminUsers } from '../pages/superadmin/Users';
import { SuperadminKnowledge } from '../pages/superadmin/Knowledge';
import { SuperadminAudit } from '../pages/superadmin/Audit';
import { SuperadminEcosystem } from '../pages/superadmin/Ecosystem';
import { SuperadminAiUsage } from '../pages/superadmin/AiUsage';

// Pantalla mínima durante hidratación de la sesión (evita redirección prematura)
const CenteredLoading = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="text-center space-y-3">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-xs text-slate-400 font-medium">Cargando sesión...</p>
    </div>
  </div>
);

// Guard: Requires logged in user
const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <CenteredLoading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Guard: Requires specific role(s)
const RequireRole = ({ allowedRoles, children }) => {
  const { user, getHomeRoute } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAllowed = Array.isArray(allowedRoles)
    ? allowedRoles.includes(user.rol)
    : user.rol === allowedRoles;

  if (!isAllowed) {
    // Redirect unauthorized attempt to user's home dashboard
    return <Navigate to={getHomeRoute()} replace />;
  }

  return children;
};

// Helper component for Root "/" redirection
const RootRedirect = () => {
  const { getHomeRoute, loading } = useAuth();

  if (loading) {
    return <CenteredLoading />;
  }

  return <Navigate to={getHomeRoute()} replace />;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected SaaS Layout Routes */}
        <Route
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          {/* Root redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Campesino Routes */}
          <Route
            path="/campesino/dashboard"
            element={
              <RequireRole allowedRoles="CAMPESINO">
                <CampesinoDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/campesino/diagnosticos"
            element={
              <RequireRole allowedRoles="CAMPESINO">
                <CampesinoDiagnosticos />
              </RequireRole>
            }
          />
          <Route
            path="/campesino/lotes"
            element={
              <RequireRole allowedRoles="CAMPESINO">
                <CampesinoLotes />
              </RequireRole>
            }
          />
          <Route
            path="/campesino/alertas"
            element={
              <RequireRole allowedRoles="CAMPESINO">
                <CampesinoAlertas />
              </RequireRole>
            }
          />
          <Route
            path="/campesino/actividades"
            element={
              <RequireRole allowedRoles="CAMPESINO">
                <CampesinoActividades />
              </RequireRole>
            }
          />
          <Route
            path="/campesino/perfil"
            element={
              <RequireRole allowedRoles="CAMPESINO">
                <CampesinoPerfil />
              </RequireRole>
            }
          />
          <Route
            path="/campesino/finanzas"
            element={
              <RequireRole allowedRoles="CAMPESINO">
                <CampesinoFinanzas />
              </RequireRole>
            }
          />

          {/* Agrónomo Routes */}
          <Route
            path="/agronomo/dashboard"
            element={
              <RequireRole allowedRoles="AGRONOMO">
                <AgronomoDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/agronomo/jurisdiccion"
            element={
              <RequireRole allowedRoles="AGRONOMO">
                <AgronomoJurisdiccion />
              </RequireRole>
            }
          />
          <Route
            path="/agronomo/tareas"
            element={
              <RequireRole allowedRoles="AGRONOMO">
                <AgronomoTareas />
              </RequireRole>
            }
          />

          {/* Superadmin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <RequireRole allowedRoles="SUPERADMIN">
                <SuperadminDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RequireRole allowedRoles="SUPERADMIN">
                <SuperadminUsers />
              </RequireRole>
            }
          />
          <Route
            path="/admin/knowledge"
            element={
              <RequireRole allowedRoles="SUPERADMIN">
                <SuperadminKnowledge />
              </RequireRole>
            }
          />
          <Route
            path="/admin/audit"
            element={
              <RequireRole allowedRoles="SUPERADMIN">
                <SuperadminAudit />
              </RequireRole>
            }
          />
          <Route
            path="/admin/ecosystem"
            element={
              <RequireRole allowedRoles="SUPERADMIN">
                <SuperadminEcosystem />
              </RequireRole>
            }
          />
          <Route
            path="/admin/ai-usage"
            element={
              <RequireRole allowedRoles="SUPERADMIN">
                <SuperadminAiUsage />
              </RequireRole>
            }
          />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
};
