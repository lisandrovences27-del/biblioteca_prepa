const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'biblioteca_prepa',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true
};

// Soporte para conexiones SSL en la nube (ej. Aiven)
if (process.env.DB_SSL === 'true' || (process.env.DB_HOST && process.env.DB_HOST.includes('.aivencloud.com'))) {
    dbConfig.ssl = {
        rejectUnauthorized: false // Permite conexiones seguras en la nube
    };
}

const pool = mysql.createPool(dbConfig);

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
