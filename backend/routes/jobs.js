const express = require('express');

module.exports = function(pool) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    const sql = `
      SELECT 
        j.id, 
        j.title, 
        j.locations_id,
        l.name AS location_name, 
        j.date 
      FROM 
        jobs j 
      INNER JOIN locations l ON
        l.id = j.locations_id
    `;

    let result = await pool.query(sql);
    result = JSON.parse(JSON.stringify(result));
    result = result.map((job)=> {
      return {
        id: job.id,
        title: job.title,
        location: {
          id: job.locations_id,
          name: job.location_name
        },
        date: (new Date(job.date)).toLocaleDateString()
      }
    });

    res.send(result);
  });

  router.get('/:id', async (req, res) => {
    const id = req.params.id;
    
    if (isNaN(id) || id <= 0) {
      return res.status(400).send('Bad Request');
    }

    let sql = `
      SELECT 
        j.id, 
        j.title, 
        j. description,
        j.locations_id,
        l.name AS location_name, 
        j.date 
      FROM 
        jobs j 
      INNER JOIN locations l ON
        l.id = j.locations_id 
      WHERE 
        j.id = ?
    `;
    let result = await pool.query(sql, [id]);
    result = JSON.parse(JSON.stringify(result));
    if (result.length === 0) {
      return res.status(404).send('Could not find the entity');
    }
    
    let job = {
      id: result[0].id,
      title: result[0].title,
      description: result[0].description,
      location: {
        id: result[0].locations_id,
        name: result[0].location_name
      },
      date: (new Date(result[0].date)).toLocaleDateString()
    };

    sql = `
      SELECT 
        a.id, 
        a.name 
      FROM 
        jobs_applicants ja 
      INNER JOIN applicants a ON
        a.id = ja.applicants_id 
      WHERE 
        ja.jobs_id = ?
    `;

    result = await pool.query(sql, [id]);
    result = JSON.parse(JSON.stringify(result));

    job.applicants = result;

    res.send(job);
  });

  return router;
}