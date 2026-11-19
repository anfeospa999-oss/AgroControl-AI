<div align="center">

# 🌱 AgroControl AI
### **Plataforma SaaS para la Gestión Agrícola y Cafetera Asistida por IA**

[![Demo en Producción](https://img.shields.io/badge/Demo_En_Línea-agrocontrol.proyecto.lol-2ea44f?style=for-the-badge&logo=google-chrome&logoColor=white)](https://www.agrocontrol.proyecto.lol/login)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-AI_Analysis-8E75C2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)

<p align="center">
  Solución tecnológica diseñada para la administración integral de fincas cafeteras, optimización de lotes agrícolas y soporte agronómico asistido mediante modelos de visión e Inteligencia Artificial.
</p>

</div>

---

## 📌 Descripción General

**AgroControl AI** es una plataforma web tipo SaaS enfocada en modernizar los procesos operativos y agronómicos en cultivos agrícolas, con especial orientación a fincas cafeteras. La aplicación permite a propietarios y administradores supervisar la productividad de sus parcelas, registrar labores de campo, analizar factores fitosanitarios y recibir diagnósticos asistidos por visión computacional con Inteligencia Artificial.

---

## ✨ Características Principales

- 🌾 **Gestión de Lotes y Cultivos:** Registro y seguimiento estructurado de parcelas, variedades cultivadas, densidades de siembra y ciclos de cosecha.
- 🔐 **Autenticación y Roles:** Control de acceso seguro mediante Supabase Auth con políticas a nivel de fila (RLS).
- 🗄️ **Persistencia en la Nube:** Base de datos relacional PostgreSQL administrada a través de Supabase para trazabilidad en tiempo real.
- 🤖 **Diagnóstico Asistido con Gemini AI:** Detección de plagas, deficiencias nutricionales y patologías en hojas y frutos mediante análisis multimodal de imágenes.
- 🧪 **Planes de Fertilización:** Recomendaciones técnicas ajustadas a la etapa fenológica del cultivo y las condiciones del terreno.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend** | React 19, JavaScript (ESModules), Vite, React Router DOM 7 |
| **Estilos & UI** | Tailwind CSS v4, Lucide React (iconografía) |
| **Calidad de Código** | Oxlint (análisis estático de alto rendimiento) |
| **Base de Datos & Auth** | PostgreSQL, Supabase (BaaS, Auth & Storage) |
| **Inteligencia Artificial** | Google Gemini AI API (análisis visual y agronómico) |

---

## 📁 Estructura del Proyecto

```text
AgroControl-AI/
├── database/          # Scripts de migración y esquemas SQL
├── public/            # Recursos estáticos y branding
├── src/               # Código fuente de la aplicación React
│   ├── assets/        # Recursos multimedia locales
│   ├── components/    # Componentes reutilizables de UI
│   ├── context/       # Estado global y proveedores de contexto
│   ├── pages/         # Vistas de la aplicación (Auth, Dashboard, Lotes, etc.)
│   └── services/      # Clientes API (Supabase, Gemini AI)
├── .env.example       # Plantilla de variables de entorno
├── package.json       # Dependencias y scripts de ejecución
└── vite.config.js     # Configuración de compilación con Vite
```

---

## 🚀 Instalación y Ejecución Local

### Prerrequisitos
- Node.js (versión 18 o superior)
- Gestor de paquetes `npm` o `pnpm`

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/anfeospa999-oss/AgroControl-AI.git
   cd AgroControl-AI
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Copia el archivo `.env.example` a `.env` y define tus credenciales:
   ```env
   VITE_SUPABASE_URL=tu_supabase_project_url
   VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
   VITE_GEMINI_API_KEY=tu_gemini_api_key
   ```

4. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## 👨‍💻 Autor

- **Andrés Felipe Ospina Pardo**
- GitHub: [@anfeospa999-oss](https://github.com/anfeospa999-oss)
- LinkedIn: [Andrés Ospina](https://www.linkedin.com/in/andres-ospina-5a382b413)

