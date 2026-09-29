// Centralized Mock Data for AgroControl AI 🌱🤖

export const MOCK_USERS = {
  SUPERADMIN: {
    id: "u-001",
    nombre: "Andrés Ospina",
    email: "admin@agrocontrol.ai",
    rol: "SUPERADMIN",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    finca: "Sede Central AgroControl",
    ubicacion: "Bogotá, Colombia",
    estado: "Activo",
    telefono: "+57 300 123 4567"
  },
  AGRONOMO: {
    id: "u-002",
    nombre: "Carlos Ramírez",
    email: "agronomo@agrocontrol.ai",
    rol: "AGRONOMO",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    finca: "Zona Cafetera Norte (12 Fincas)",
    ubicacion: "Manizales, Caldas",
    estado: "Activo",
    especialidad: "Fitopatología y Suelos",
    telefono: "+57 311 987 6543"
  },
  CAMPESINO: {
    id: "u-003",
    nombre: "Pedro Gómez",
    email: "campesino@agrocontrol.ai",
    rol: "CAMPESINO",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    finca: "Finca El Porvenir",
    ubicacion: "Chinchiná, Caldas",
    hectareas: 14.5,
    estado: "Activo",
    telefono: "+57 315 456 7890"
  }
};

export const MOCK_FINCAS = [
  {
    id: "finc-mock-1",
    owner_id: "u-003",
    nombre: "Finca El Porvenir",
    departamento: "Chinchiná, Caldas",
    hectareas: 14.5,
    created_at: "2026-01-15T00:00:00.000Z",
    updated_at: "2026-01-15T00:00:00.000Z"
  }
];

export const MOCK_PLATFORM_USERS = [
  { id: "usr-1", nombre: "Pedro Gómez", email: "campesino@agrocontrol.ai", rol: "CAMPESINO", finca: "Finca El Porvenir", estado: "Activo", fechaRegistro: "2024-01-15", consumoAi: "1,240 tokens" },
  { id: "usr-2", nombre: "Carlos Ramírez", email: "agronomo@agrocontrol.ai", rol: "AGRONOMO", finca: "Zona Cafetera Norte", estado: "Activo", fechaRegistro: "2024-01-10", consumoAi: "4,890 tokens" },
  { id: "usr-3", nombre: "Andrés Ospina", email: "admin@agrocontrol.ai", rol: "SUPERADMIN", finca: "Sede Central", estado: "Activo", fechaRegistro: "2023-11-01", consumoAi: "12,450 tokens" },
  { id: "usr-4", nombre: "María Lucía Fernández", email: "maria.fernandez@agromail.com", rol: "CAMPESINO", finca: "Hacienda La Esperanza", estado: "Activo", fechaRegistro: "2024-02-01", consumoAi: "890 tokens" },
  { id: "usr-5", nombre: "Jorge Eliecer Gaitán", email: "jorge.gaitan@fincas.co", rol: "CAMPESINO", finca: "Finca San José", estado: "Inactivo", fechaRegistro: "2024-02-18", consumoAi: "150 tokens" },
  { id: "usr-6", nombre: "Dra. Sofía Morales", email: "sofia.morales@agronet.org", rol: "AGRONOMO", finca: "Zona Antioquia Sur", estado: "Activo", fechaRegistro: "2024-01-20", consumoAi: "6,120 tokens" },
  { id: "usr-7", nombre: "Roberto Gómez Bolaños", email: "roberto.gomez@agro.co", rol: "CAMPESINO", finca: "Finca La Vecindad", estado: "Suspendido", fechaRegistro: "2024-03-05", consumoAi: "0 tokens" },
  { id: "usr-8", nombre: "Laura Restrepo", email: "laura.restrepo@agrocontrol.ai", rol: "SUPERADMIN", finca: "Sede Central", estado: "Activo", fechaRegistro: "2023-12-12", consumoAi: "8,900 tokens" }
];

export const MOCK_LOTES = [
  {
    id: "lote-1",
    nombre: "Lote 1 - Café Castillo",
    variedad: "Café Castillo Naranjal",
    area: "4.2 Ha",
    plantas: 18500,
    estadoSalud: "Excelente",
    humedadSuelo: "68%",
    phSuelo: 6.2,
    npkStatus: "Óptimo (N: Alto, P: Medio, K: Alto)",
    ndviIndex: 0.82,
    temperaturaAvg: "21°C",
    proximaCosecha: "2026-11-15",
    rendimientoEstimado: "14.2 Ton",
    imagen: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "lote-2",
    nombre: "Lote 2 - Aguacate Hass",
    variedad: "Aguacate Hass Exportación",
    area: "5.0 Ha",
    plantas: 1200,
    estadoSalud: "Riesgo Moderado",
    humedadSuelo: "45%",
    phSuelo: 5.8,
    npkStatus: "Deficiencia de Nitrógeno",
    ndviIndex: 0.61,
    temperaturaAvg: "23°C",
    proximaCosecha: "2026-10-02",
    rendimientoEstimado: "22.5 Ton",
    imagen: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "lote-3",
    nombre: "Lote 3 - Maíz Híbrido",
    variedad: "Maíz Blanco Amarillento",
    area: "3.1 Ha",
    plantas: 45000,
    estadoSalud: "Bueno",
    humedadSuelo: "72%",
    phSuelo: 6.5,
    npkStatus: "Balanceado",
    ndviIndex: 0.76,
    temperaturaAvg: "24°C",
    proximaCosecha: "2026-09-30",
    rendimientoEstimado: "18.0 Ton",
    imagen: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "lote-4",
    nombre: "Lote 4 - Plátano Dominico",
    variedad: "Dominico Hartón",
    area: "2.2 Ha",
    plantas: 3100,
    estadoSalud: "Crítico",
    humedadSuelo: "38%",
    phSuelo: 5.4,
    npkStatus: "Deficiencia Severa de Potasio",
    ndviIndex: 0.44,
    temperaturaAvg: "22°C",
    proximaCosecha: "2026-12-01",
    rendimientoEstimado: "8.5 Ton",
    imagen: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=600"
  }
];

export const MOCK_DIAGNOSTICOS = [
  {
    id: "diag-101",
    loteId: "lote-2",
    loteNombre: "Lote 2 - Aguacate Hass",
    fecha: "2026-09-06 14:32",
    sintoma: "Manchas necróticas circulares en envés foliar",
    patogenoDetectado: "Anthracnose (Colletotrichum gloeosporioides)",
    confianzaAi: 96.4,
    severidad: "Alta",
    estado: "Pendiente Validación Agrónomo",
    agronomoAsignado: "Carlos Ramírez",
    imagenMuestra: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19655?auto=format&fit=crop&q=80&w=400",
    tratamientoSugerido: "Aplicar Oxicloruro de Cobre (2.5 g/L) + Podas de aireación en estrato medio.",
    biopesticidaRecomendado: "Trichoderma harzianum disuelto al 2%"
  },
  {
    id: "diag-102",
    loteId: "lote-1",
    loteNombre: "Lote 1 - Café Castillo",
    fecha: "2026-09-04 09:15",
    sintoma: "Pústulas anaranjadas foliares y defoliación parcial",
    patogenoDetectado: "Roya del Cafeto (Hemileia vastatrix)",
    confianzaAi: 98.8,
    severidad: "Moderada",
    estado: "Validado por Agrónomo",
    agronomoAsignado: "Carlos Ramírez",
    imagenMuestra: "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&q=80&w=400",
    tratamientoSugerido: "Fungicida sistémico a base de Cyproconazole (0.5 L/Ha) en bloques focales.",
    biopesticidaRecomendado: "Lecanicillium lecanii previo a temporada de lluvias"
  },
  {
    id: "diag-103",
    loteId: "lote-4",
    loteNombre: "Lote 4 - Plátano Dominico",
    fecha: "2026-09-01 16:45",
    sintoma: "Amarillamiento y estrías amarillas paralelas a venas",
    patogenoDetectado: "Sigatoka Negra (Mycosphaerella fijiensis)",
    confianzaAi: 94.1,
    severidad: "Crítica",
    estado: "En Tratamiento",
    agronomoAsignado: "Carlos Ramírez",
    imagenMuestra: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=400",
    tratamientoSugerido: "Deshoje sanitario inmediato de hojas con grado 4+ y aplicación foliar de Mancozeb.",
    biopesticidaRecomendado: "Bacillus subtilis strain QST 713"
  }
];

export const MOCK_ALERTAS = [
  {
    id: "alt-1",
    titulo: "Riesgo de Helada Nocturna Detectado",
    descripcion: "Sensores térmicos registran caída drástica de temperatura estimada en 3.5°C para las 04:00 AM.",
    tipo: "Climática",
    prioridad: "Alta",
    fecha: "Hace 20 min",
    loteAfectado: "Lote 2 & Lote 3",
    accionRecomendada: "Encender riego por microaspersión o cobertura de mulch orgánico."
  },
  {
    id: "alt-2",
    titulo: "Déficit Hídrico Severo en Lote 4",
    descripcion: "Humedad del suelo descendió al 38%. Umbral crítico de marchitez cercano.",
    tipo: "Hídrica",
    prioridad: "Crítica",
    fecha: "Hace 1 hora",
    loteAfectado: "Lote 4 - Plátano Dominico",
    accionRecomendada: "Activar bomba de riego goteo durante 45 minutos inmediatamente."
  },
  {
    id: "alt-3",
    titulo: "Alerta Biológica: Brote de Broca del Café",
    descripcion: "Monitoreo por trampas con alcohólicos detecta captura superior a 5 brocas/trampa/día.",
    tipo: "Plaga",
    prioridad: "Moderada",
    fecha: "Ayer",
    loteAfectado: "Lote 1 - Café Castillo",
    accionRecomendada: "Revisar frutos caídos y programar Re-Re (Recogida y Repaso)."
  }
];

export const MOCK_ACTIVIDADES = [
  {
    id: "act-1",
    titulo: "Riego de Emergencia por Goteo",
    lote: "Lote 4 - Plátano Dominico",
    fecha: "Hoy, 18:00 PM",
    responsable: "Pedro Gómez",
    estado: "Pendiente",
    prioridad: "Alta",
    tipo: "Riego"
  },
  {
    id: "act-2",
    titulo: "Aplicación Foliar de Bio-Fungicida",
    lote: "Lote 2 - Aguacate Hass",
    fecha: "Mañana, 07:00 AM",
    responsable: "Pedro Gómez / Carlos Ramírez",
    estado: "Programada",
    prioridad: "Media",
    tipo: "Fitosanitario"
  },
  {
    id: "act-3",
    titulo: "Muestreo Nutricional de Suelos",
    lote: "Lote 1 - Café Castillo",
    fecha: "12 Sep 2026",
    responsable: "Carlos Ramírez (Agrónomo)",
    estado: "Completada",
    prioridad: "Baja",
    tipo: "Análisis"
  },
  {
    id: "act-4",
    titulo: "Fertilización NPK (17-6-18)",
    lote: "Lote 3 - Maíz Híbrido",
    fecha: "15 Sep 2026",
    responsable: "Pedro Gómez",
    estado: "Programada",
    prioridad: "Media",
    tipo: "Fertilización"
  }
];

export const MOCK_FINANZAS = {
  resumenGeneral: {
    ingresosProyectados: "$48,500 USD",
    costosOperativos: "$14,200 USD",
    margenGananciaNeto: "70.7%",
    roiEstimado: "341%"
  },
  desgloseLotes: [
    { lote: "Lote 1 - Café Castillo", gastoInsumos: "$3,400", manoObra: "$2,800", ingresoEsperado: "$22,000", roi: "354%" },
    { lote: "Lote 2 - Aguacate Hass", gastoInsumos: "$4,100", manoObra: "$1,900", ingresoEsperado: "$16,500", roi: "275%" },
    { lote: "Lote 3 - Maíz Híbrido", gastoInsumos: "$1,200", manoObra: "$800", ingresoEsperado: "$6,200", roi: "310%" },
    { lote: "Lote 4 - Plátano Dominico", gastoInsumos: "$600", manoObra: "$400", ingresoEsperado: "$3,800", roi: "380%" }
  ]
};

export const MOCK_JURISDICCION_AGRONOMO = [
  {
    fincaId: "finc-1",
    nombreFinca: "Finca El Porvenir",
    campesino: "Pedro Gómez",
    municipio: "Chinchiná, Caldas",
    cultivosPrincipales: "Café, Aguacate, Maíz, Plátano",
    superficie: "14.5 Ha",
    saludGeneral: "84% Saludable",
    alertasActivas: 2,
    contacto: "+57 315 456 7890",
    ultimaVisita: "2026-08-28"
  },
  {
    fincaId: "finc-2",
    nombreFinca: "Hacienda La Esperanza",
    campesino: "María Lucía Fernández",
    municipio: "Manizales, Caldas",
    cultivosPrincipales: "Café Caturra, Cacao",
    superficie: "22.0 Ha",
    saludGeneral: "92% Saludable",
    alertasActivas: 0,
    contacto: "+57 310 888 9911",
    ultimaVisita: "2026-09-02"
  },
  {
    fincaId: "finc-3",
    nombreFinca: "Finca San José",
    campesino: "Jorge Eliecer Gaitán",
    municipio: "Villamaría, Caldas",
    cultivosPrincipales: "Papa Criolla, Maíz",
    superficie: "9.8 Ha",
    saludGeneral: "65% Riesgo",
    alertasActivas: 4,
    contacto: "+57 318 222 3344",
    ultimaVisita: "2026-08-15"
  }
];

export const MOCK_TAREAS_AGRONOMO = [
  { id: "tagr-1", finca: "Finca El Porvenir", campesino: "Pedro Gómez", tarea: "Validar diagnóstico de Antracnosis en Lote 2", prioridad: "Alta", fecha: "Hoy, 15:00", estado: "Pendiente" },
  { id: "tagr-2", finca: "Finca San José", campesino: "Jorge Gaitán", tarea: "Inspección técnica de suelo post-lluvias", prioridad: "Urgente", fecha: "Mañana, 09:00", estado: "Pendiente" },
  { id: "tagr-3", finca: "Hacienda La Esperanza", campesino: "María Fernández", tarea: "Emitir certificado fitosanitario de exportación", prioridad: "Normal", fecha: "10 Sep 2026", estado: "Completado" }
];

export const MOCK_AI_USAGE = {
  resumenTokens: {
    totalTokensHoy: "48,920",
    costoDiarioEstimado: "$2.45 USD",
    latenciaPromedio: "410 ms",
    tasaExitoConsultas: "99.8%"
  },
  consumoPorModelo: [
    { modelo: "AgroVision AI (Gemini 1.5 Flash Pro Vision)", consultas: 1420, tokens: "32,400", costo: "$1.62" },
    { modelo: "AgroBot RAG Expert (Llama 3 70B Fine-tuned)", consultas: 890, tokens: "12,100", costo: "$0.61" },
    { modelo: "Weather & Sensor Predictive Engine", consultas: 2300, tokens: "4,420", costo: "$0.22" }
  ]
};

export const MOCK_KNOWLEDGE_BASE = [
  { id: "kb-1", titulo: "Vademécum de Enfermedades Fúngicas en Café y Aguacate v4.2", categoria: "Fitopatología", formato: "PDF Vectorizado", tamaño: "14.2 MB", chunksCount: 840, ultimaActualizacion: "2026-08-20" },
  { id: "kb-2", titulo: "Manual ICA: Manejo Integrado de Broca y Roya 2026", categoria: "Normativa & Plagas", formato: "Markdown Document", tamaño: "3.1 MB", chunksCount: 210, ultimaActualizacion: "2026-08-10" },
  { id: "kb-3", titulo: "Tabla de Solubilidad NPK y Nutrición Foliar de Alta Precisión", categoria: "Suelos & Fertilidad", formato: "JSON Embeddings", tamaño: "8.5 MB", chunksCount: 520, ultimaActualizacion: "2026-09-01" }
];

export const MOCK_AUDIT_LOGS = [
  { id: "aud-1", timestamp: "2026-09-07 17:10:45", usuario: "Andrés Ospina", rol: "SUPERADMIN", accion: "Actualización de prompt del sistema AgroVision AI", ip: "190.158.42.12" },
  { id: "aud-2", timestamp: "2026-09-07 16:42:10", usuario: "Carlos Ramírez", rol: "AGRONOMO", accion: "Validación técnica de diagnóstico #diag-102 en Finca El Porvenir", ip: "186.116.90.88" },
  { id: "aud-3", timestamp: "2026-09-07 14:15:30", usuario: "Pedro Gómez", rol: "CAMPESINO", accion: "Carga de fotografía de hoja afectada en Lote 2", ip: "190.27.180.5" },
  { id: "aud-4", timestamp: "2026-09-07 11:05:00", usuario: "Sistema Autónomo", rol: "SYSTEM", accion: "Ejecución de job cron: Análisis predictivo de heladas", ip: "127.0.0.1" }
];

export const MOCK_ECOSYSTEM = [
  { id: "eco-1", nombre: "IDEAM Weather API", tipo: "Meteorología", estado: "Conectado", latencia: "120ms", uptime: "99.9%" },
  { id: "eco-2", nombre: "Sentinel-2 Satellite Engine (ESA)", tipo: "Imágenes NDVI", estado: "Conectado", latencia: "850ms", uptime: "99.5%" },
  { id: "eco-3", nombre: "Gateway LoRaWAN Sensores Finca", tipo: "IoT Suelos", estado: "Conectado", latencia: "45ms", uptime: "100%" },
  { id: "eco-4", nombre: "Mercado Agropecuario Nacional API", tipo: "Precios Mercado", estado: "En Mantenimiento", latencia: "-", uptime: "94.2%" }
];

// ============================================================
// MOCK DATA: Diagnósticos del Modal "Analizar mi Finca"
// Terminología técnica cafetera real — Fase 2.1
// ============================================================
export const MOCK_DIAGNOSTICOS_MODAL = [
  {
    patogeno: "Roya del cafeto (Hemileia vastatrix)",
    confianza: "98.8%",
    severidad: "Alta",
    lote: "Lote 1 - Café Castillo",
    recomendacion: "Aplicar fungicida sistémico a base de Cyproconazole (0.5 L/Ha) en bloques focales. Retirar hojas con pústulas anaranjadas para reducir inóculo.",
    preventivo: "Mantener variedades resistentes como Castillo y Colombia. Aplicar Lecanicillium lecanii previo a la temporada de lluvias.",
    sintoma: "Pústulas anaranjadas en el envés foliar con defoliación progresiva"
  },
  {
    patogeno: "Broca del café (Hypothenemus hampei)",
    confianza: "96.1%",
    severidad: "Media",
    lote: "Lote 1 - Café Castillo",
    recomendacion: "Ejecutar Re-Re (Recogida y Repaso) en frutos caídos al suelo. Instalar trampas con mezcla alcohólica (etanol:metanol 3:1) a razón de 8 trampas/Ha.",
    preventivo: "Realizar cosecha oportuna para evitar granos sobremaduros. Liberación de Beauveria bassiana al inicio de fructificación.",
    sintoma: "Perforaciones circulares en la corona del fruto (punto de inserción peduncular)"
  },
  {
    patogeno: "Deficiencia de Nitrógeno",
    confianza: "97.2%",
    severidad: "Baja",
    lote: "Lote 1 - Café Castillo",
    recomendacion: "Aplicar urea granulada (46-0-0) a 80 kg/Ha fraccionada en dos aplicaciones, o fertilización foliar con urea al 1% para respuesta inmediata.",
    preventivo: "Analizar suelos semestralmente y ajustar plan de fertilización según exportación de nutrientes por cosecha. Incorporar compost de pulpa de café.",
    sintoma: "Clorosis generalizada desde hojas basales, con amarillamiento intervenal uniforme"
  }
];

