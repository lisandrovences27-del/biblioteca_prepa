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

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenido a la API del Sistema de Biblioteca de la Preparatoria' });
});

module.exports = app;
