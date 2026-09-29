/**
 * AuthContext.jsx — Contexto de Autenticación Híbrido
 * =====================================================
 * Soporta dos modos controlados por IS_MOCK_MODE + disponibilidad de Supabase:
 *
 * MOCK MODE (IS_MOCK_MODE = true):
 *   - Funciona exactamente igual que antes.
 *   - El usuario inicial es CAMPESINO, switchRole disponible.
 *   - No realiza ninguna llamada a Supabase. RoleSwitcher visible.
 *
 * REAL MODE (IS_MOCK_MODE = false):
 *   - Usa supabase.auth.signInWithPassword() y signInWithOtp() (Magic Link).
 *   - Escucha onAuthStateChange para reaccionar a login/logout/refresh.
 *   - Consulta public.profiles para obtener nombre, rol y metadatos del usuario.
 *   - El rol proviene EXCLUSIVAMENTE de public.profiles.rol.
 *
 * GRACEFUL DEGRADATION:
 *   - Si Supabase no responde al cargar la aplicación, se cae a Mock Mode
 *     automáticamente (sin crash, sin pantalla blanca): demo + RoleSwitcher.
 *   - Si una llamada puntual falla (red/RLS/transitorio), no se revoca la
 *     sesión: se muestra un mensaje claro y el usuario puede reintentar.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MOCK_USERS } from '../data/mockData';
import { supabase, IS_MOCK_MODE } from '../services/supabaseClient';

const AuthContext = createContext();

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const getHomeRouteForRole = (rol) => {
  switch (rol) {
    case 'SUPERADMIN': return '/admin/dashboard';
    case 'AGRONOMO':   return '/agronomo/dashboard';
    case 'CAMPESINO':
    default:           return '/campesino/dashboard';
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Solo se reintenta cuando el error es transitorio:
 * - PGRST116 (0 filas): el trigger aún no creó el perfil (race condition natural).
 * - Mensajes de red: fetch failed, network request failed, etc.
 */
const isRetryableError = (error) => {
  if (!error) return false;
  if (error.code === 'PGRST116') return true;
  const msg = (error.message ?? '').toLowerCase();
  return (
    msg.includes('fetch failed') ||
    msg.includes('failed to fetch') ||
    msg.includes('network request failed') ||
    msg.includes('load failed') ||
    msg.includes('network error')
  );
};

/**
 * Error de "perfil inexistente" (no es un fallo técnico): la fila no existe.
 * Cualquier otro error (RLS, tabla ausente, red) NO se considera "sin perfil".
 */
const isMissingProfileError = (error) => {
  if (!error) return false;
  if (error.code === 'PGRST116') return true;
  const msg = (error.message ?? '').toLowerCase();
  return (
    msg.includes('no rows') ||
    msg.includes('no record') ||
    msg.includes('json object requested') ||
    msg.includes('profile not found')
  );
};

/**
 * Obtiene el perfil desde public.profiles. Reintenta hasta `retries` veces
 * únicamente si el error es transitorio.
 * @returns {{ data: object|null, error: object|null }}
 */
const fetchProfile = async (userId, retries = 1) => {
  let data = null;
  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const res = await supabase
      .from('profiles')
      .select('id, nombre, email, rol')
      .eq('id', userId)
      .single();

    data = res.data ?? null;
    lastError = res.error ?? null;

    if (!lastError || !isRetryableError(lastError)) break;
    // El trigger de auth puede tardar milisegundos en ejecutarse
    await sleep(600);
  }

  return { data, error: lastError };
};

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────
export const AuthProvider = ({ children }) => {

  // ── MOCK MODE (sin credenciales en .env) ──
  if (IS_MOCK_MODE) {
    return <MockAuthProvider>{children}</MockAuthProvider>;
  }

  // ── REAL MODE (Supabase configurado) ───────
  return <RealAuthProvider>{children}</RealAuthProvider>;
};

// ─────────────────────────────────────────────
// MOCK MODE PROVIDER (comportamiento original intacto)
// ─────────────────────────────────────────────
const MockAuthProvider = ({ children }) => {
  const [user, setUser] = useState(MOCK_USERS.CAMPESINO);

  const login = (email, role) => {
    if (role && MOCK_USERS[role]) {
      setUser(MOCK_USERS[role]);
      return MOCK_USERS[role];
    }
    const foundUser = Object.values(MOCK_USERS).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    const result = foundUser || MOCK_USERS.CAMPESINO;
    setUser(result);
    return result;
  };

  const logout = () => setUser(null);

  const switchRole = (roleKey) => {
    if (MOCK_USERS[roleKey]) setUser(MOCK_USERS[roleKey]);
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    return Array.isArray(requiredRole)
      ? requiredRole.includes(user.rol)
      : user.rol === requiredRole;
  };

  const getHomeRoute = () =>
    user ? getHomeRouteForRole(user.rol) : '/login';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: user,
        loading: false,
        authError: null,
        isMockMode: true,
        isAuthenticated: !!user,
        // Mock-mode auth methods
        login,
        logout,
        switchRole,
        hasRole,
        getHomeRoute,
        // Stubs for real-mode methods (no-op, para no romper si se importan)
        signInWithPassword: async () => ({ error: new Error('Mock Mode activo') }),
        signInWithMagicLink: async () => ({ error: new Error('Mock Mode activo') }),
        signOut: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─────────────────────────────────────────────
// REAL MODE PROVIDER (Supabase Auth)
// ─────────────────────────────────────────────
const RealAuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);      // perfil enriquecido de public.profiles
  const [session, setSession] = useState(null);      // sesión raw de Supabase
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);  // bloqueo por perfil inexistente
  const [supabaseDown, setSupabaseDown] = useState(false); // fallback a demo

  /** Carga el perfil de public.profiles y lo fusiona con los datos de sesión */
  const loadUserProfile = useCallback(async (supabaseSession) => {
    if (!supabaseSession?.user) {
      setUser(null);
      setSession(null);
      setAuthError(null);
      setLoading(false);
      return;
    }

    try {
      const { data: profile, error } = await fetchProfile(supabaseSession.user.id);

      if (profile) {
        setUser({
          id:       profile.id,
          nombre:   profile.nombre,
          email:    profile.email,
          rol:      profile.rol,
          // Metadatos adicionales del token de Auth (foto, etc.)
          avatar:   supabaseSession.user.user_metadata?.avatar_url ?? null,
        });
        setAuthError(null);
      } else if (error && !isMissingProfileError(error)) {
        // Fallo técnico (red/RLS/configuración) al leer profiles.
        // NO se revoca la sesión: se informa al usuario y puede reintentar.
        setUser(null);
        setAuthError('No se pudo cargar tu perfil en este momento. Revisa tu conexión e intenta de nuevo.');
      } else {
        // SIN fallback de rol: si public.profiles no existe tras los reintentos,
        // se revoca la sesión y se bloquea el acceso. El rol real proviene
        // EXCLUSIVAMENTE de public.profiles.
        try {
          await supabase.auth.signOut();
        } catch {
          // Si la sesión no puede revocarse (offline), se limpia en local de todos modos
        }
        setUser(null);
        setSession(null);
        setAuthError('Tu perfil aún no está configurado. Contacta al administrador.');
      }
    } catch {
      // Defensa ante excepciones inesperadas de la librería de Supabase:
      // nunca dejar loading colgado, nunca revocar una sesión válida.
      setUser(null);
      setAuthError('No se pudo cargar tu perfil en este momento. Revisa tu conexión e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Suscribirse a cambios de sesión (login, logout, refresh de token).
  // La suscripción se crea SOLO si Supabase está accesible; si no, se cae
  // silenciosamente a Mock Mode (la app sigue funcionando, nunca hace crash).
  useEffect(() => {
    let active = true;
    let subscription = null;

    supabase.auth
      .getSession()
      .then(({ data: { session: s } }) => {
        if (!active) return;

        const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(
          (_event, ss) => {
            setSession(ss);
            loadUserProfile(ss);
          }
        );
        subscription = sub;

        setSession(s);
        loadUserProfile(s);
      })
      .catch(() => {
        // Supabase no responde (red/CORS/DNS): fallback a demo, sin crash.
        if (active) setSupabaseDown(true);
      });

    return () => {
      active = false;
      if (subscription) subscription.unsubscribe();
    };
  }, [loadUserProfile]);

  // ── GRACEFUL DEGRADATION: Supabase inalcanzable → entorno demo ──
  if (supabaseDown) {
    return <MockAuthProvider>{children}</MockAuthProvider>;
  }

  // ── Métodos de Auth ────────────────────────
  const signInWithPassword = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { data, error };
    } catch (err) {
      // Defensa: la librería de Supabase nunca debería lanzar aquí,
      // pero si lo hace, nunca dejamos loading colgado.
      return { data: null, error: { message: err?.message ?? 'No se pudo iniciar sesión. Intenta de nuevo.' } };
    } finally {
      setLoading(false);
    }
  };

  const signInWithMagicLink = async (email) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      return { data, error };
    } catch (err) {
      return { data: null, error: { message: err?.message ?? 'No se pudo enviar el enlace. Intenta de nuevo.' } };
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch {
      // Offline: se limpia el estado local de todos modos
    } finally {
      setUser(null);
      setSession(null);
      setAuthError(null);
      setLoading(false);
    }
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    return Array.isArray(requiredRole)
      ? requiredRole.includes(user.rol)
      : user.rol === requiredRole;
  };

  const getHomeRoute = () =>
    user ? getHomeRouteForRole(user.rol) : '/login';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: user,
        session,
        loading,
        authError,
        isMockMode: false,
        isAuthenticated: !!user,
        // Real-mode auth methods
        signInWithPassword,
        signInWithMagicLink,
        signOut,
        hasRole,
        getHomeRoute,
        // Stubs para compatibilidad con código que use login/switchRole del mock
        login: () => console.warn('[AuthContext] En modo real, usa signInWithPassword().'),
        logout: signOut,
        switchRole: () => console.warn('[AuthContext] switchRole no disponible en modo real.'),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};