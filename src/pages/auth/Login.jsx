import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit, Sprout, UserCheck, ShieldAlert,
  ArrowRight, CheckCircle2, Mail, Lock, Send, AlertCircle,
} from 'lucide-react';

// ─────────────────────────────────────────────
// Datos de roles demo (solo visibles en Mock Mode)
// ─────────────────────────────────────────────
const rolesDemo = [
  {
    key: 'CAMPESINO',
    title: 'Campesino / Agricultor',
    email: 'campesino@agrocontrol.ai',
    nombre: 'Pedro Gómez',
    finca: 'Finca El Porvenir',
    icon: Sprout,
    badge: 'bg-emerald-600 text-white',
  },
  {
    key: 'AGRONOMO',
    title: 'Agrónomo Supervisor',
    email: 'agronomo@agrocontrol.ai',
    nombre: 'Carlos Ramírez',
    finca: 'Zona Cafetera Norte (12 Fincas)',
    icon: UserCheck,
    badge: 'bg-blue-600 text-white',
  },
  {
    key: 'SUPERADMIN',
    title: 'Superadmin Plataforma',
    email: 'admin@agrocontrol.ai',
    nombre: 'Andrés Ospina',
    finca: 'Sede Central AgroControl',
    icon: ShieldAlert,
    badge: 'bg-purple-600 text-white',
  },
];

// ─────────────────────────────────────────────
// Sub-componente: Login en MOCK MODE (comportamiento original)
// ─────────────────────────────────────────────
const MockLoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('CAMPESINO');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const loggedUser = login('', selectedRole);
      setLoading(false);
      if (loggedUser.rol === 'SUPERADMIN') navigate('/admin/dashboard');
      else if (loggedUser.rol === 'AGRONOMO') navigate('/agronomo/dashboard');
      else navigate('/campesino/dashboard');
    }, 900);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Banner Mock Mode */}
      <div className="flex items-center gap-2 bg-amber-950/60 border border-amber-700/50 px-3 py-2 rounded-xl text-xs text-amber-300 font-medium">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
        Demo Mode — Acceso directo sin contraseña
      </div>

      <div className="space-y-2.5">
        {rolesDemo.map((r) => {
          const Icon = r.icon;
          const isSelected = selectedRole === r.key;
          return (
            <div
              key={r.key}
              onClick={() => setSelectedRole(r.key)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-950/40 text-white ring-2 ring-emerald-500/40'
                  : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">{r.nombre}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${r.badge}`}>
                      {r.key}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{r.finca}</p>
                </div>
              </div>
              {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            </div>
          );
        })}
      </div>

      <SubmitButton loading={loading} label="Ingresar a AgroControl AI" />
    </form>
  );
};

// ─────────────────────────────────────────────
// Sub-componente: Login en REAL MODE (Supabase)
// ─────────────────────────────────────────────
const RealLoginForm = () => {
  const { user, loading, authError, signInWithPassword, signInWithMagicLink, getHomeRoute } = useAuth();
  const navigate = useNavigate();

  // 'password' | 'magic'
  const [authTab, setAuthTab] = useState('password');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg]   = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Redirección reactiva: ocurre ÚNICAMENTE cuando el perfil está completamente
  // hidratado desde public.profiles (user + user.rol), loading terminó y no hay
  // error pendiente de perfil/autenticación. Elimina la race condition de
  // navegar antes de que onAuthStateChange resuelva el rol real.
  useEffect(() => {
    if (user && user.rol && !loading && !authError) {
      navigate(getHomeRoute(), { replace: true });
    }
  }, [user, loading, authError, navigate, getHomeRoute]);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setFormLoading(true);
    const { error } = await signInWithPassword(email, password);
    setFormLoading(false);
    if (error) {
      setErrorMsg(translateSupabaseError(error.message));
    }
    // Sin navigate aquí: la redirección la resuelve el useEffect reactivo.
  };

  const handleMagicLink = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setFormLoading(true);
    const { error } = await signInWithMagicLink(email);
    setFormLoading(false);
    if (error) {
      setErrorMsg(translateSupabaseError(error.message));
    } else {
      setSuccessMsg(`¡Enlace enviado! Revisa tu correo ${email} y haz clic en el enlace para ingresar.`);
    }
  };

  if (successMsg) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-14 h-14 bg-emerald-900/60 border border-emerald-600/50 rounded-full flex items-center justify-center mx-auto">
          <Send className="w-6 h-6 text-emerald-400" />
        </div>
        <h3 className="text-sm font-bold text-white">¡Revisa tu correo!</h3>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">{successMsg}</p>
        <button
          onClick={() => setSuccessMsg('')}
          className="text-xs text-emerald-400 hover:underline"
        >
          Usar otro correo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Tabs: Contraseña / Magic Link */}
      <div className="flex bg-slate-950 rounded-xl p-1 gap-1">
        {[
          { key: 'password', label: 'Contraseña', icon: Lock },
          { key: 'magic',    label: 'Magic Link',  icon: Mail },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => { setAuthTab(key); setErrorMsg(''); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              authTab === key
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Error de perfil: acceso bloqueado hasta configuración por el admin */}
      {authError && <ErrorBanner message={authError} />}

      {/* Formulario por tab */}
      {authTab === 'password' ? (
        <form onSubmit={handlePasswordLogin} className="space-y-3">
          <InputField
            id="email" type="email" label="Correo electrónico"
            value={email} onChange={setEmail} placeholder="tu@correo.com"
            icon={Mail}
          />
          <InputField
            id="password" type="password" label="Contraseña"
            value={password} onChange={setPassword} placeholder="••••••••"
            icon={Lock}
          />
          {errorMsg && <ErrorBanner message={errorMsg} />}
          <SubmitButton loading={formLoading} label="Iniciar sesión" />
        </form>
      ) : (
        <form onSubmit={handleMagicLink} className="space-y-3">
          <p className="text-xs text-slate-400">
            Te enviaremos un enlace de acceso directo a tu correo. Sin contraseña.
          </p>
          <InputField
            id="email-magic" type="email" label="Correo electrónico"
            value={email} onChange={setEmail} placeholder="tu@correo.com"
            icon={Mail}
          />
          {errorMsg && <ErrorBanner message={errorMsg} />}
          <SubmitButton loading={formLoading} label="Enviar enlace mágico" icon={Send} />
        </form>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Componentes auxiliares reutilizables
// ─────────────────────────────────────────────
const InputField = ({ id, type, label, value, onChange, placeholder, icon: Icon }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="text-xs font-semibold text-slate-400 block">{label}</label>
    <div className="relative">
      <Icon className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
      <input
        id={id}
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-600 transition-all"
      />
    </div>
  </div>
);

const ErrorBanner = ({ message }) => (
  <div className="flex items-start gap-2 bg-red-950/60 border border-red-700/50 px-3 py-2.5 rounded-xl text-xs text-red-300">
    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
    <span>{message}</span>
  </div>
);

const SubmitButton = ({ loading, label, icon: Icon = ArrowRight }) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-emerald-900/50 transition-all flex items-center justify-center space-x-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
  >
    {loading ? (
      <>
        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span>Autenticando...</span>
      </>
    ) : (
      <>
        <span>{label}</span>
        <Icon className="w-4 h-4" />
      </>
    )}
  </button>
);

// ─────────────────────────────────────────────
// Helper: traduce errores de Supabase al español
// ─────────────────────────────────────────────
const translateSupabaseError = (msg) => {
  if (!msg) return 'Ocurrió un error inesperado. Intenta de nuevo.';
  const text = msg.toLowerCase();
  // Errores de conexión/red (Supabase inalcanzable)
  if (
    text.includes('fetch failed') ||
    text.includes('failed to fetch') ||
    text.includes('network request failed') ||
    text.includes('load failed') ||
    text.includes('network error') ||
    text.includes('err_internet_disconnected') ||
    text.includes('timeout') ||
    text.includes('too many requests')
  ) {
    return 'No se pudo conectar con el servidor. Revisa tu conexión a internet e intenta de nuevo.';
  }
  if (text.includes('invalid login credentials'))
    return 'Correo o contraseña incorrectos. Verifica tus datos.';
  if (text.includes('email not confirmed'))
    return 'Debes confirmar tu correo antes de iniciar sesión.';
  if (text.includes('email rate limit exceeded'))
    return 'Demasiados correos enviados. Espera unos minutos e intenta de nuevo.';
  if (text.includes('user already registered'))
    return 'Ya existe una cuenta con ese correo. Usa "Iniciar sesión" o el enlace mágico.';
  if (text.includes('user not found'))
    return 'No encontramos una cuenta con ese correo.';
  return msg;
};

// ─────────────────────────────────────────────
// Componente principal: Login
// ─────────────────────────────────────────────
export const Login = () => {
  const { isMockMode } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-sky-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 to-green-400 shadow-xl shadow-emerald-900/50 mb-4">
            <BrainCircuit className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center justify-center">
            AgroControl <span className="ml-2 text-emerald-400 text-sm bg-emerald-950 px-2 py-0.5 rounded-lg border border-emerald-800">AI</span>
          </h1>
          <p className="text-sm text-slate-400 mt-2 font-medium">
            Inteligencia Artificial y Diagnóstico Fitosanitario para el Campo
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="text-lg font-bold text-white mb-1 text-center">Acceso a la Plataforma</h2>
          <p className="text-xs text-slate-400 text-center mb-6">
            {isMockMode
              ? 'Selecciona una cuenta demo para ingresar instantáneamente:'
              : 'Ingresa con tu cuenta registrada en AgroControl AI:'}
          </p>

          {isMockMode ? <MockLoginForm /> : <RealLoginForm />}

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500">
              🔒 Acceso Protegido
              {isMockMode
                ? ' — Entorno de Demostración'
                : ' · Powered by Supabase Auth'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
