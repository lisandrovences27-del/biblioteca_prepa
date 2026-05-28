require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2/promise');

async function initDatabase() {
    try {
        const sql = fs.readFileSync('./database.sql', 'utf8');

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true
        });

        await connection.query(sql);
        await connection.end();

        console.log('Base de datos inicializada correctamente.');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error.message || error);
        process.exit(1);
    }
}

initDatabase();
