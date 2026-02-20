import postgres from '../../infrastructure/postgres.js';
import { mapApplication } from './application.model.js'

export async function getApplication(userId, applicationId) {
    const { rows } = await postgres.query(
        'select * from job_hunt.s_application($1)',
        [applicationId]
    );

    if (!rows.length) {
        return {
            success: false,
            status: 404
        };
    }

    const application = mapApplication(rows[0]);
    if (application.userId !== userId) {
        return {
            success: false,
            status: 403
        };
    }

    return {
        success: true,
        data: application
    };
}

export async function getApplications(userId) {
    const { rows } = await postgres.query(
        'select * from job_hunt.s_applications($1)',
        [userId]
    );

    return {
        success: true,
        data: rows.map(mapApplication)
    };
}

export async function updateApplication(userId, applicationId, application) {
    const existingResult = await getApplication(userId, applicationId);
    if(!existingResult.success){
        return existingResult;
    }
    
    const { rows } = await postgres.query(
        `select * from job_hunt.u_application($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [
            userId,
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

    return {
        success: true,
        data: rows[0].out_application_id
    };
}

export async function createApplication(userId, application) {
    const { rows } = await postgres.query(
        `select * from job_hunt.i_application($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
            userId,
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

    return {
        success: true,
        data: rows[0].out_application_id
    };
}

export async function deleteApplication(userId, applicationId) {
    const existingResult = await getApplication(userId, applicationId);
    if(!existingResult.success){
        return existingResult;
    }

    const { rows } = await postgres.query(
        `select * from job_hunt.d_application($1)`,
        [
            applicationId
        ]
    );

    return {
        success: true,
        data: rows[0].out_application_id
    };
}