const express = require('express');
const cors = require('cors');

const app = express();

// Rutas
const authRoutes = require('./src/routes/auth');
const librosRoutes = require('./src/routes/libros');
const materialesRoutes = require('./src/routes/materiales');
const prestamosRoutes = require('./src/routes/prestamos');
const sancionesRoutes = require('./src/routes/sanciones');

// Middleware
app.use(cors());
app.use(express.json());

// Uso de Rutas
app.use('/api/auth', authRoutes);
app.use('/api/libros', librosRoutes);
app.use('/api/materiales', materialesRoutes);
app.use('/api/prestamos', prestamosRoutes);
app.use('/api/sanciones', sancionesRoutes);

const path = require('path');

// Servir la aplicación de React estáticamente
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Cualquier ruta que no sea de la API, servirá el index.html de React
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

module.exports = app;
