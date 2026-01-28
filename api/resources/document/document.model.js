export function mapDocumentHeader(row) {
  return {
    documentId: row.out_document_id,
    applicationId: row.out_application_id,
    filename: row.out_filename,
    contentType: row.out_content_type,
    fileSize: row.out_file_size,
    created: row.out_created_at,
  };
}

export function mapDocument(row) {
  return {
    ...mapDocumentHeader(row),
    content: row.out_content,
  };
}