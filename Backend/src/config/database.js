const sql = require('mssql');

const config = {
    server: 'localhost',
    user: 'sa',
    password: 'Faheemsarwar.17',
    database: 'Project Tabligh',
    port: 1433,
    options: {
        trustServerCertificate: true
    }
};

module.exports = config; 
