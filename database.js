const { Pool } = require('pg');

// Skapa en connection pool till postgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: String(process.env.DB_PASSWORD),
    port: process.env.DB_PORT,
});

// Testa anslutningen
pool.on('connect', () => {
    console.log('Ansluten till PostgreSQL-databasen');
});

pool.on('error', (err) => {
    console.error('Oväntat fel på databasanslutningen', err);
    process.exit(-1);
});

module.exports = pool;