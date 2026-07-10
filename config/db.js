const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'biblioteca_prepa',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true
});

// Manejar errores de conexión
pool.on('error', (err) => {
    console.error('Error en el pool de conexiones:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Conexión de base de datos perdida.');
    }
    if (err.code === 'PROTOCOL_ERROR') {
        console.error('Protocolo de base de datos error.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Base de datos tiene demasiadas conexiones.');
    }
    if (err.code === 'ER_AUTHENTICATION_PLUGIN_ERROR') {
        console.error('Error de autenticación en base de datos.');
    }
});

module.exports = pool;
