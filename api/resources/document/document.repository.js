import postgres from '../../infrastructure/postgres.js';
import { mapDocumentHeader, mapDocument } from './document.model.js';

export async function getDocumentHeaders(documentId, applicationId){
    const { rows } = await postgres.query(
        'select * from job_hunt.s_document_headers($1,$2)',
        [
            documentId,
            applicationId
        ]
    )

    return rows.map(mapDocumentHeader);
}

export async function getDocument(documentId){
    const { rows } = await postgres.query(
        'select * from job_hunt.s_document($1)',
        [
            documentId
        ]
    )

    return mapDocument(rows[0]);
}

export async function createDocument(document){
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

  return rows[0].out_document_id;
}

export async function deleteDocument(documentId){
  const { rows } = await postgres.query(
      `select * from job_hunt.d_document($1)`,
      [
        documentId
      ]
    );

  return rows[0].out_document_id;
}