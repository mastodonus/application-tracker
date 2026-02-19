import API_BASE from '../utilities/ApiUtilities';

export async function getDocumentHeaders(applicationId){
    const result = await fetch(`${API_BASE}/api/documents?applicationId=${applicationId}`, {
        credentials: 'include'
    });

    return (result.json() || []);
}

export async function uploadDocuments({documents, applicationId}){
    console.log(`uploadding ${documents.length} documents to ${applicationId}`);
    await Promise.all(documents.map(async (document) => {
        const formData = new FormData();
        formData.append('applicationId', applicationId);
        formData.append('document', document);

        await fetch(`${API_BASE}/api/documents`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
    }));
}

export async function deleteDocument(documentId){
    await fetch(`${API_BASE}/api/documents/${documentId}`, {
        method: 'DELETE',
        credentials: 'include'
    });
}

export async function downloadDocument(documentId){
    try {
        const response = await fetch(`${API_BASE}/api/documents/${documentId}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to download document');
        }

        const blob = await response.blob();
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'document';

        if (contentDisposition) {
            const match = contentDisposition.match(/filename="?(.+)"?/);
            if (match?.[1]) {
                filename = match[1];
            }
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error(err);
    }
}