const winston = require('winston');
const config = require('config');
const mysqlAsync = require('../middleware/mysqlAsync');

module.exports = async function () {
  const dbConfig = {
    host: config.get('host'),
    database: config.get('database'),
    user: config.get('user'),
    password: config.get('password'),
    connectionLimit: 10
  };

  const pool = mysqlAsync(dbConfig);

  await createTables();

  async function createTables() {
    const tables = [{
        name: "locations",
        sql: `
          CREATE TABLE IF NOT EXISTS locations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NOT NULL)
        `
      },
      {
        name: "jobs",
        sql: `
        CREATE TABLE IF NOT EXISTS jobs (
          id INT AUTO_INCREMENT PRIMARY KEY, 
          title VARCHAR(255) NOT NULL, 
          description VARCHAR(255) NOT NULL, 
          date DATE, 
          locations_id INT REFERENCES locations(id))
        `
      },
      {
        name: "applicants",
        sql: `
          CREATE TABLE IF NOT EXISTS applicants (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            name VARCHAR(50) NOT NULL)
        `
      },
      {
        name: "jobs_applicants",
        sql: `
          CREATE TABLE IF NOT EXISTS jobs_applicants (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            jobs_id INT NOT NULL REFERENCES jobs(id), 
            applicants_id INT NOT NULL REFERENCES applicants(id))
        `
      }
    ];

    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      try {
        await pool.query(table.sql);
        winston.info(`${table.name} table created/exists`);
      } catch (err) {
        throw `Could not create ${table.name} table`;
      }
    }
  }

  return pool;
}