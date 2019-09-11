const express = require('express');
const cors = require('cors');
const jobs = require('../routes/jobs');
const error = require('../middleware/error');

module.exports = function (app, pool) {
  app.use(cors());
  app.use(express.json());
  app.use('/jobs', jobs(pool));
  app.use(error);
}