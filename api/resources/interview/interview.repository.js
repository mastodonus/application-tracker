import postgres from '../../infrastructure/postgres.js';
import { mapInterview } from './interview.model.js';

export async function getInterviews(interviewId, applicationId){
    const { rows } = await postgres.query(
        'select * from job_hunt.s_interviews($1,$2)',
        [
            documentId,
            applicationId
        ]
    )

    return rows.map(mapInterview);
}

export async function createInterview(interview){
  const { rows } = await postgres.query(
      `select * from job_hunt.i_interview($1,$2,$3)`,
      [
        interview.applicationId,
        interview.interviewDate,
        interview.details
      ]
    );

  return rows[0].out_interview_id;
}


export async function updateInterview(interview){
  const { rows } = await postgres.query(
      `select * from job_hunt.u_interview($1,$2,$3, $4)`,
      [
        interview.interviewId,
        interview.applicationId,
        interview.interviewDate,
        interview.details
      ]
    );

  return rows[0].out_interview_id;
}

export async function deleteInterview(interviewId){
  const { rows } = await postgres.query(
      `select * from job_hunt.d_interview($1)`,
      [
        interviewId
      ]
    );

  return rows[0].out_interview_id;
}