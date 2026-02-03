import postgres from '../../infrastructure/postgres.js';
import { mapDocumentHeader, mapDocument } from './document.model.js';
import { getApplication } from '../application/application.repository.js'

export async function getDocumentHeader(userId, documentId) {
    const { rows } = await postgres.query(
        'select * from job_hunt.s_document_headers($1,$2)',
        [documentId]
    )

    if (!rows.length) {
        return {
            success: false,
            status: 404
        };
    }

    const documentHeader = mapDocumentHeader(rows[0]);
    if (documentHeader.userId !== userId) {
        return {
            success: false,
            status: 403
        };
    }

    return {
        success: true,
        data: documentHeader
    };
}

export async function getDocumentHeaders(userId, applicationId) {
    const { rows } = await postgres.query(
        'select * from job_hunt.s_document_headers($1,$2)',
        [
            userId,
            applicationId
        ]
    )

    return {
        success: true,
        data: rows.map(mapDocumentHeader)
    };
}

export async function getDocument(userId, documentId) {
    const existingResult = await getDocumentHeader(userId, documentId);
    if (!existingResult.success) {
        return existingResult;
    }

    const { rows } = await postgres.query(
        'select * from job_hunt.s_document($1)',
        [
            documentId
        ]
    )

    return {
        success: true,
        data: mapDocument(rows[0])
    };
}

export async function createDocument(userId, document) {
    const existingApplicationResult = await getApplication(userId, document.applicationId);
    if (!existingApplicationResult.success) {
        existingApplicationResult.status = existingApplicationResult.status != 404
            ? existingApplicationResult.status
            : 400;
        return existingApplicationResult;
    }

    const { rows } = await postgres.query(
        `select * from job_hunt.i_document($1,$2,$3,$4,$5)`,
        [
            document.applicationId,
            document.filename,
            document.contentType,
            document.fileSize,
            document.content
        ]
    );

    return {
        success: true,
        data: rows[0].out_document_id
    };
}

export async function deleteDocument(userId, documentId) {
    const existingResult = await getDocumentHeader(userId, documentId);
    if (!existingResult.success) {
        return existingResult;
    }

    const { rows } = await postgres.query(
        `select * from job_hunt.d_document($1)`,
        [
            documentId
        ]
    );

    return {
        success: true,
        data: rows[0].out_document_id
    };
}