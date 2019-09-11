const winston = require('winston');
const express = require('express');
const app = express();

(async () => {
  require('./startup/logging')();
  require('./startup/config')();
  const db = require('./startup/db');
  const pool = await db();
  const dataLoader = require('./startup/data');
  dataLoader(pool);
  require('./startup/routes')(app, pool);
})();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));


module.exports = server;