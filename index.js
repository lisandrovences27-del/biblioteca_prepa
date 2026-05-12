const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenido a la API del Sistema de Biblioteca de la Preparatoria' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
