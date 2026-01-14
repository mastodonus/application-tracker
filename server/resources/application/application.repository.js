const postgres = require('../../infrastructure/postgres');
const { mapApplication } = require('./application.model');

async function getApplications(applicationId = null) {
  const { rows } = await postgres.query(
    'select * from job_hunt.s_applications($1)',
    [applicationId]
  );

  return rows.map(mapApplication);
}

async function updateApplication(applicationId, application){
  const { rows } = await postgres.query(
      `select * from job_hunt.u_application($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        applicationId,
        application.company,
        application.title,
        application.description,
        application.applied,
        application.position,
        application.site,
        application.salaryMin,
        application.salaryMax,
        application.status,
        application.link
      ]
    );

  return rows[0].out_application_id;
}

async function createApplication(application){
  const { rows } = await postgres.query(
      `select * from job_hunt.i_application($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        application.company,
        application.title,
        application.description,
        application.applied,
        application.position,
        application.site,
        application.salaryMin,
        application.salaryMax,
        application.status,
        application.link
      ]
    );

  return rows[0].out_application_id;
}

async function deleteApplication(applicationId){
  const { rows } = await postgres.query(
      `select * from job_hunt.d_application($1)`,
      [
        applicationId
      ]
    );

  return rows[0].out_application_id;
}

module.exports = {
    getApplications,
    updateApplication,
    createApplication,
    deleteApplication
};