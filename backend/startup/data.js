const winston = require('winston');
const config = require('config');
const axios = require('axios');
const csv = require('csvtojson');
const moment = require('moment');

module.exports = async function (pool) {
  winston.info(`Checking local data...`);

  const sql = "SELECT COUNT(*) AS total FROM jobs";

  const result = await pool.query(sql);
  if (result.length !== 1 || result[0].total < 1){
    await loadData();
  }

  winston.info(`Data loaded...`);

  async function loadData() {
    winston.info(`Loading data from remote...`);
    const response = await axios.get(config.get('remoteResource'));
    winston.info(`Remote data fetched...`);
    const jobs = await csv().fromString(response.data);
    for (let i = 0 ; i < jobs.length; i++){
      await addJob(jobs[i]);
      winston.info(`[${Math.floor((i+1)*100/jobs.length)}%] of data loaded..`)
    }
  }

  async function addJob(job) {
    const sql = `
      INSERT INTO jobs
        (title, description, date, locations_id)
      VALUES
        (?, ?, ?, ?)
    `;
    job.locationObj = await getLocation(job.location);
    job.applicantsObj = await getApplicants(job.applicants);

    job.dateObj = moment(job.date, 'DD/MM/YYYY').toDate();

    const params = [job['job title'], job['job description'], job.dateObj, job.locationObj.id];

    const result = await pool.query(sql, params);
    job.id = result.insertId;

    await addJobsApplicants(job);
  }

  async function getLocation(name) {
    let result = await pool.query('SELECT id, name FROM locations WHERE name = ?', [name]);

    if (result.length === 0) {
      await pool.query('INSERT INTO locations (name) VALUES (?)', [name]);
      result = await getLocation(name);
    }
    else {
      result = JSON.parse(JSON.stringify(result[0]));
    }
    return result;
  }

  async function getApplicants(applicants) {
    applicants = applicants.split(', ');
    const result = [];

    for (let i = 0 ; i < applicants.length; i++) {
      const applicant = await getApplicant(applicants[i]);
      result.push(applicant);
    }

    return result;
  }

  async function getApplicant(name) {
    let result = await pool.query('SELECT id, name FROM applicants WHERE name = ?', [name]);
    
    if (result.length === 0) {
      await pool.query('INSERT INTO applicants (name) VALUES (?)', [name]);
      result = await getApplicant(name);
    }
    else {
      result = JSON.parse(JSON.stringify(result[0]));
    }
    return result;
  }

  async function addJobsApplicants(job) {
    for (let i = 0; i < job.applicantsObj.length; i++){
      await addJobsApplicant(job.id, job.applicantsObj[i].id);
    }
  }

  async function addJobsApplicant(jobs_id, applicants_id) {
    await pool.query('INSERT INTO jobs_applicants (jobs_id, applicants_id) VALUES (?, ?)', [jobs_id, applicants_id]);
  }
}