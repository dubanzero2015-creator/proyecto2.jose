# 🎙️ VoiceReport AI

VoiceReport AI es una solución web Full Stack diseñada para optimizar la gestión de reclamos, reportes y solicitudes vecinales o corporativas mediante mensajes de voz. El sistema recibe archivos de audio, simula un pipeline de transcripción (Speech-to-Text), clasifica automáticamente el contenido según su urgencia o categoría empleando reglas de negocio, y persiste toda la información (junto con una traza de auditoría técnica) en una base de datos relacional en **Supabase**.

---

## ✨ Características Principales

* **Carga y Validación de Audio:** Interfaz *Drag & Drop* que valida en tiempo real que el archivo sea multimedia (`.mp3`, `.wav`, `.m4a`) y que su duración no exceda los 60 segundos antes de subirlo.
* **Pipeline con Estados Visuales:** Barra indicadora interactiva que muestra el estado actual del proceso (`Subiendo` ➡️ `Transcribiendo` ➡️ `Clasificando`).
* **Panel de Control y KPIs:** Indicadores superiores (Resumen Diario) con el total de casos, casos abiertos y alertas de criticidad alta.
* **Filtros en Tiempo Real:** Buscador inteligente por texto en transcripciones y selectores de filtrado por Categoría y Urgencia.
* **Módulo de Auditoría Integrado:** Registro técnico visible para cada reporte que almacena fechas locales (`America/Santiago`), hashes de verificación, peso del archivo y `Mime-Type`.
* **Persistencia en la Nube:** Conexión directa y escalable con **Supabase (PostgreSQL)** mediante almacenamiento en formato relacional y objetos estructurados `JSONB`.
* **Notificaciones Flotantes:** Sistema de alertas *Toast* nativas para confirmaciones de procesamiento exitoso o denegaciones de archivos.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** HTML5 (Web Audio API), CSS3 (Variables nativas y Grid/Flexbox), JavaScript Vanilla (ES6 Async/Await).
* **Backend:** Node.js, Express REST API, Multer (Gestión de carga binaria), Cors.
* **Base de Datos:** Supabase / PostgreSQL (`JSONB` para logs de auditoría).

---

## 📦 Estructura del Proyecto

```text
📦 audio-reporter
 ┣ 📂 public
 ┃ ┣ 📄 index.html
 ┃ ┣ 📄 style.css
 ┃ ┗ 📄 script.js
 ┣ 📂 uploads
 ┣ 📄 server.js
 ┣ 📄 README.md
 ┗ 📄 package.json
