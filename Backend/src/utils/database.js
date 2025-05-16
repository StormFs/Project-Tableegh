const sql = require('mssql');
const config = require('../config/database');

let pool;

async function performQuery(query, params = []) {
    try {
        pool = await sql.connect(config);
        const request = pool.request();

        params.forEach((param, index) => {
            request.input(`param${index}`, param);
        });

        const result = await request.query(query);
        return result.recordsets[0];
    } catch (err) {
        console.error('SQL Error:', err.message);
        throw err;
    } finally {
        if (pool) await pool.close();
    }
}

module.exports = performQuery; 