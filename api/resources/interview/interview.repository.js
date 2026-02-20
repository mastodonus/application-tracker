import postgres from '../../infrastructure/postgres.js';
import { mapInterview } from './interview.model.js';
import { getApplication } from '../application/application.repository.js'

export async function getInterview(userId, interviewId) {
    const { rows } = await postgres.query(
        'select * from job_hunt.s_interview($1)',
        [interviewId]
    )

    if (!rows.length) {
        return {
            success: false,
            status: 404
        };
    }

    const interview = mapInterview(rows[0]);
    if (rows[0].out_user_id !== userId) {
        return {
            success: false,
            status: 403
        };
    }

    return {
        success: true,
        data: interview
    };
}

export async function getInterviews(userId, applicationId) {
    const { rows } = await postgres.query(
        'select * from job_hunt.s_interviews($1,$2)',
        [
            userId,
            applicationId
        ]
    )

    return {
        success: true,
        data: rows.map(mapInterview)
    };
}

export async function createInterview(userId, interview) {
    const existingApplicationResult = await getApplication(userId, interview.applicationId);
    if (!existingApplicationResult.success) {
        existingApplicationResult.status = existingApplicationResult.status != 404
            ? existingApplicationResult.status
            : 400;
        return existingApplicationResult;
    }

    const { rows } = await postgres.query(
        `select * from job_hunt.i_interview($1,$2,$3)`,
        [
            interview.applicationId,
            interview.interviewDate,
            interview.details
        ]
    );

    return {
        success: true,
        data: rows[0].out_interview_id
    };
}


export async function updateInterview(userId, interviewId, interview) {
    const existingResult = await getInterview(userId, interviewId);
    if (!existingResult.success) {
        return existingResult;
    }

    const { rows } = await postgres.query(
        `select * from job_hunt.u_interview($1,$2,$3)`,
        [
            interviewId,
            interview.interviewDate,
            interview.details
        ]
    );

    return {
        success: true,
        data: rows[0].out_interview_id
    };
}

export async function deleteInterview(userId, interviewId) {
    const existingResult = await getInterview(userId, interviewId);
    if (!existingResult.success) {
        return existingResult;
    }

    const { rows } = await postgres.query(
        `select * from job_hunt.d_interview($1)`,
        [
            interviewId
        ]
    );

    return {
        success: true,
        data: rows[0].out_interview_id
    };
}