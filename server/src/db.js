const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
    console.log('🌿 Conexión a PostgreSQL establecida correctamente');
});

pool.on('error', (err) => {
    console.error('Error inesperado en la base de datos', err);
});

// Exportamos el pool para que cualquier controlador pueda usarlo
module.exports = pool;