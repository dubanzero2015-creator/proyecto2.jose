const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// CONFIGURACIÓN DE SUPABASE
// ==========================================
// Reemplaza estos dos valores con los datos reales de tu proyecto de Supabase
const SUPABASE_URL = 'https://tu-proyecto.supabase.co'; 
const SUPABASE_KEY = 'tu-anon-key-de-supabase'; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ==========================================
// MIDDLEWARES Y CONFIGURACIÓN DE ARCHIVOS
// ==========================================
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Sirve tu HTML, CSS y script.js desde la carpeta public

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// ==========================================
// MOTOR HEURÍSTICO DE CLASIFICACIÓN (NLP SIMULADO)
// ==========================================
function analyzeText(text) {
    const lower = text.toLowerCase();
    let category = "General";
    let urgency = "Baja";
    let summary = text.split('.').slice(0, 2).join('.') + '...';

    if (lower.includes('agua') || lower.includes('cañería') || lower.includes('fuga')) {
        category = "Plomería/Infraestructura";
        urgency = "Alta";
    } else if (lower.includes('luz') || lower.includes('cortocircuito') || lower.includes('eléctrico')) {
        category = "Electricidad";
        urgency = "Alta";
    } else if (lower.includes('ruido') || lower.includes('vecino') || lower.includes('música')) {
        category = "Convivencia";
        urgency = "Media";
    } else if (lower.includes('limpieza') || lower.includes('basura')) {
        category = "Aseo";
        urgency = "Baja";
    }

    return { summary, category, urgency };
}

// ==========================================
// ENDPOINTS API REST (CONEXIÓN SUPABASE)
// ==========================================

// 1. GET: Consultar todos los registros ordenados por ID
app.get('/api/reports', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('reports')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error al obtener datos de Supabase:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// 2. POST: Recibir audio, transcribir, analizar y persistir en Supabase
app.post('/api/reports', upload.single('audio'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se recibió ningún archivo de audio.' });
    }

    try {
        // Simulación de Transcripción Speech-to-Text (Aleatoria para pruebas)
        const mockTranscriptions = [
            "Hay un problema con el alumbrado del estacionamiento, todo está muy oscuro y es peligroso.",
            "Se solicita limpieza urgente del sector de contenedores de basura, hay desechos desbordados.",
            "Hola, se rompió una tubería en el patio común y se está inundando el pasillo."
        ];
        const transcription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];

        // Ejecutar análisis heurístico de texto
        const analysis = analyzeText(transcription);

        // Insertar registro en la tabla de Supabase
        const { data, error } = await supabase
            .from('reports')
            .insert([{
                transcription,
                summary: analysis.summary,
                category: analysis.category,
                urgency: analysis.urgency,
                status: "Abierto",
                audit: {
                    mimeType: req.file.mimetype || "audio/mpeg",
                    fileSize: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
                    createdAt: new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })
                }
            }])
            .select();

        if (error) throw error;

        // Limpieza: Eliminar el archivo de audio físico temporal del servidor
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        // Responder al frontend con el registro creado
        res.status(201).json(data[0]);

    } catch (error) {
        // Asegurar limpieza del archivo incluso si ocurre un error de base de datos
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Error en el pipeline de procesamiento:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// INICIALIZACIÓN DEL SERVIDOR
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo exitosamente en: http://localhost:${PORT}`);
});