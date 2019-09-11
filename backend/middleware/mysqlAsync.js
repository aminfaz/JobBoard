const util = require('util');
const mysql = require('mysql');
const winston = require('winston');

module.exports = function (config) {
  const pool = mysql.createPool(config);

  // Ping database to check for common exception errors.
  pool.getConnection((err, connection) => {
    if (err) {
      winston.error(err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        throw 'Database connection was closed.';
      }
      if (err.code === 'ER_CON_COUNT_ERROR') {
        throw 'Database has too many connections.';
      }
      if (err.code === 'ECONNREFUSED') {
        throw 'Database connection was refused.';
      }
    }

    winston.info(`Connected to database [${config.host}/${config.database}]...`);

    if (connection) {
      connection.release();
    }

    return;
  })

  // Promisify for Node.js async/await.
  pool.query = util.promisify(pool.query);

  return pool;
}