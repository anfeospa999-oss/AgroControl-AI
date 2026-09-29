import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { MOCK_ALERTAS, MOCK_ACTIVIDADES, MOCK_DIAGNOSTICOS_MODAL } from '../../data/mockData';
import { getFarms } from '../../services/farmService';
import { getLotes } from '../../services/loteService';
import {
  Sprout,
  BrainCircuit,
  BellRing,
  Droplets,
  Activity,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const CampesinoDashboard = () => {
  const { user, isMockMode } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(1);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Datos reales de finca y lotes (en Mock Mode los servicios devuelven los mocks)
  const [farm, setFarm] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const totalHa =
    farm?.hectareas != null
      ? Number(farm.hectareas)
      : lotes.reduce((acc, l) => acc + (Number(l.hectareas) || 0), 0);

  const farmName =
    farm?.nombre || (isMockMode ? 'Finca El Porvenir' : 'Sin finca registrada');

  const loadFarmData = useCallback(async () => {
    const { data: farms, error: farmError } = await getFarms(user?.id);
    if (farmError) {
      setDataLoading(false);
      return;
    }
    const primera = Array.isArray(farms) && farms.length ? farms[0] : null;
    setFarm(primera);
    if (primera) {
      const { data: lotsData, error: lotsError } = await getLotes(primera.id, user?.id);
      if (!lotsError) setLotes(Array.isArray(lotsData) ? lotsData : []);
    } else {
      setLotes([]);
    }
    setDataLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) loadFarmData();
  }, [user?.id, loadFarmData]);

  // Dynamic greeting based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días';
    if (hour < 18) return '¡Buenas tardes';
    return '¡Buenas noches';
  };

  const handleSimulateAnalysis = () => {
    setAnalysisStep(2); // Show analyzing state
    setAnalysisResult(null);
    setTimeout(() => {
      // Selecciona un diagnóstico aleatorio del catálogo de patógenos cafeteros
      const randomDiag = MOCK_DIAGNOSTICOS_MODAL[
        Math.floor(Math.random() * MOCK_DIAGNOSTICOS_MODAL.length)
      ];
      setAnalysisResult(randomDiag);
      setAnalysisStep(3); // Show result state
    }, 2500);
  };

  const handleSaveDiagnosis = () => {
    setAnalysisStep(4); // Show success saved state
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Dynamic Greeting */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-400/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-800/80 border border-emerald-700/60 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-3">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>{farmName}{totalHa ? ` • ${totalHa} Hectáreas` : ''}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              {getGreeting()}, {user?.nombre || 'Pedro'}! 🌱
            </h1>
            <p className="text-sm text-emerald-100/90 mt-1 max-w-xl">
              El estado general de tu finca está en <strong className="text-white font-bold">84% Saludable</strong>. Tienes 1 alerta climática y 1 recomendación fitosanitaria pendiente.
            </p>
          </div>

          {/* Giant AI Analysis Button */}
          <div className="shrink-0">
            <button
              onClick={() => {
                setIsModalOpen(true);
                setAnalysisResult(null);
              }}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-300 hover:to-emerald-300 text-emerald-950 font-black text-base shadow-2xl shadow-emerald-950/60 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-3 group"
            >
              <div className="p-2 rounded-xl bg-emerald-950/10 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6 text-emerald-950" />
              </div>
              <div className="text-left">
                <div className="text-xs uppercase tracking-wider text-emerald-900 font-bold">Diagnóstico por Foto</div>
                <div className="text-base font-extrabold text-emerald-950">🧠 ANALIZAR MI FINCA</div>
              </div>
              <Sparkles className="w-5 h-5 text-emerald-900 animate-pulse" />
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Lotes en Producción"
          value={`${lotes.length} ${lotes.length === 1 ? 'Lote' : 'Lotes'}`}
          subtext={`${totalHa || 0} Ha cultivadas`}
          icon={Sprout}
          color="emerald"
        />
        <StatCard
          title="Humedad Promedio"
          value="64.5%"
          subtext="Sensor LoRaWAN activo"
          icon={Droplets}
          trend="+3.2%"
          color="blue"
        />
        <StatCard
          title="Alertas Activas"
          value="2 Alertas"
          subtext="1 Helada • 1 Broca"
          icon={BellRing}
          color="amber"
        />
        <StatCard
          title="Rendimiento Estimado"
          value="63.2 Ton"
          subtext="Próxima cosecha Nov 2026"
          icon={Activity}
          trend="+8.5%"
          color="purple"
        />
      </div>

      {/* Main Grid: Lotes & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Lotes Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <Sprout className="w-5 h-5 mr-2 text-emerald-600" />
              Estado Actual de Mis Lotes
            </h2>
            <a href="/campesino/lotes" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center">
              Ver todos los lotes <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>

          {dataLoading ? (
            <div className="col-span-1 sm:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 text-center">
              <p className="text-sm font-semibold text-slate-500">Cargando tus lotes...</p>
            </div>
          ) : lotes.length === 0 ? (
            <div className="col-span-1 sm:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 text-center">
              <p className="text-sm font-semibold text-slate-700">Aún no tienes lotes registrados.</p>
              <a href="/campesino/lotes" className="inline-block mt-2 text-xs font-bold text-emerald-600 hover:underline">
                Registrar tu primer lote →
              </a>
            </div>
          ) : (
            lotes.map((lote) => {
              const estado = lote.estadoSalud;
              const isDanger = estado === 'Crítico';
              const isWarning = estado?.includes('Riesgo');

              return (
                <div
                  key={lote.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-all group"
                >
                  <div className="px-4 py-3 bg-gradient-to-r from-emerald-900 to-green-900">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-white leading-tight">{lote.nombre}</h3>
                        <p className="text-xs text-emerald-100/80 mt-0.5">
                          {lote.variedad_cafe || 'Sin variedad'} • {lote.hectareas != null ? `${Number(lote.hectareas)} Ha` : '—'}
                        </p>
                      </div>
                      {estado && (
                        <Badge
                          variant={isDanger ? 'danger' : isWarning ? 'warning' : 'success'}
                          className="shadow-md"
                        >
                          {estado}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    {lote.humedadSuelo ? (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-50 p-2 rounded-xl">
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Humedad Suelo</span>
                          <span className="font-bold text-slate-800">{lote.humedadSuelo}</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl">
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Índice NDVI</span>
                          <span className="font-bold text-emerald-600">{lote.ndviIndex} / 1.0</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">
                        No hay telemetría registrada para este lote.
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>pH: <strong className="text-slate-700">{lote.phSuelo ?? '—'}</strong></span>
                      <a href="/campesino/lotes" className="text-emerald-600 font-semibold hover:underline">
                        Ver Detalle →
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column (1 col): Urgent Alerts & Pending Activities */}
        <div className="space-y-6">
          {/* Urgent Alerts Widget */}
          <Card
            title="Alertas Tempranas Agrícolas"
            subtitle="Basado en sensores IoT y modelos de IA"
            action={
              <a href="/campesino/alertas" className="text-xs text-emerald-600 font-bold hover:underline">
                Ver 3 Alertas
              </a>
            }
          >
            <div className="space-y-3">
              {MOCK_ALERTAS.slice(0, 2).map((alerta) => (
                <div
                  key={alerta.id}
                  className={`p-3.5 rounded-2xl border ${
                    alerta.prioridad === 'Crítica'
                      ? 'bg-red-50/80 border-red-200 text-red-950'
                      : 'bg-amber-50/80 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle
                        className={`w-4 h-4 shrink-0 ${
                          alerta.prioridad === 'Crítica' ? 'text-red-600' : 'text-amber-600'
                        }`}
                      />
                      <h4 className="text-xs font-bold">{alerta.titulo}</h4>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500">{alerta.fecha}</span>
                  </div>
                  <p className="text-xs mt-1.5 text-slate-700 leading-relaxed">{alerta.descripcion}</p>
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-600">{alerta.loteAfectado}</span>
                    <button className="text-emerald-700 font-bold hover:underline">Acción Rápida →</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Activities Widget */}
          <Card title="Próximas Actividades">
            <div className="space-y-3">
              {MOCK_ACTIVIDADES.slice(0, 3).map((act) => (
                <div key={act.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      {act.tipo.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">{act.titulo}</h5>
                      <p className="text-[11px] text-slate-500">{act.lote} • {act.fecha}</p>
                    </div>
                  </div>
                  <Badge variant={act.estado === 'Completada' ? 'success' : 'warning'}>{act.estado}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* AI Analysis Simulation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setAnalysisStep(1); // Reset on close
        }}
        title="🧠 Diagnóstico Fitosanitario Autónomo con AgroVision AI"
      >
        {analysisStep === 1 && (
          <div className="space-y-6">
            <p className="text-xs text-slate-600">
              Sube una fotografía clara de la hoja o fruto afectado en tu cultivo. Nuestro modelo convolucional especializado identificará el patógeno en segundos.
            </p>

            <div
              onClick={handleSimulateAnalysis}
              className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl p-8 text-center cursor-pointer transition-all group"
            >
              <UploadCloud className="w-12 h-12 mx-auto text-emerald-600 group-hover:scale-110 transition-transform mb-3" />
              <h4 className="text-sm font-bold text-slate-800">Haz clic aquí para seleccionar o arrastrar la foto</h4>
              <p className="text-xs text-slate-500 mt-1">Soporta JPG, PNG de hojas de Café, Aguacate, Maíz o Plátano (Max 10MB)</p>
            </div>
          </div>
        )}

        {analysisStep === 2 && (
          <div className="p-10 bg-slate-900 text-white rounded-2xl text-center space-y-4 shadow-inner">
            <BrainCircuit className="w-12 h-12 mx-auto text-emerald-400 animate-spin" />
            <h5 className="text-base font-bold">Procesando imagen con AgroVision AI...</h5>
            <p className="text-xs text-slate-400">Extrayendo patrones vectoriales foliares y consultando Base RAG Fitopatológica</p>
            
            {/* Progress bar simulation */}
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-4 overflow-hidden">
              <div className="bg-emerald-400 h-1.5 rounded-full animate-[pulse_1s_ease-in-out_infinite]" style={{ width: '60%', transition: 'width 2s' }}></div>
            </div>
          </div>
        )}

        {analysisStep === 3 && analysisResult && (
          <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-950">Diagnóstico Completado con Éxito</h4>
                <p className="text-xs text-emerald-800 mt-0.5">Confianza del modelo: <strong className="text-emerald-950 font-extrabold">{analysisResult.confianza}</strong></p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Patógeno Detectado</span>
                <span className="font-bold text-slate-900">{analysisResult.patogeno}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Severidad Estimada</span>
                <Badge variant="warning">{analysisResult.severidad}</Badge>
              </div>
            </div>

            <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl space-y-2 text-xs shadow-inner">
              <h5 className="font-bold text-emerald-400 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1.5" /> Tratamiento Ecológico Recomendado:
              </h5>
              <p className="text-slate-300 leading-relaxed">{analysisResult.recomendacion}</p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 mt-2">
                🌱 <strong className="text-slate-200">Medida Preventiva:</strong> {analysisResult.preventivo}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cerrar
              </Button>
              <Button variant="primary" onClick={handleSaveDiagnosis}>
                Guardar en Historial
              </Button>
            </div>
          </div>
        )}

        {analysisStep === 4 && (
          <div className="py-8 px-4 text-center space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">¡Diagnóstico Guardado!</h4>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              El análisis se ha registrado en tu historial. Hemos notificado a tu agrónomo supervisor para que lo revise.
            </p>
            <div className="pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto">
                Volver al Dashboard
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
