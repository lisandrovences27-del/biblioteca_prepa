require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('Promise rechazada no manejada:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Excepción no capturada:', error);
    // No salir del proceso, mantener el servidor corriendo
});

// Start Server
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Mantener el servidor corriendo incluso si hay errores
server.on('error', (error) => {
    console.error('Error en el servidor:', error);
    // No salir del proceso
});
