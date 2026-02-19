import API_BASE from '../utilities/ApiUtilities';

export async function getApplication(applicationId){
    const response = await fetch(`${API_BASE}/api/applications/${applicationId}`, {
        credentials: 'include'
    });

    return response.json();
}

export async function getApplications(){
    const response = await fetch(`${API_BASE}/api/applications`, {
        credentials: 'include'
    });

    return (response.json() || []);
}

export async function deleteApplication(application){
    const response = await fetch(`${API_BASE}/api/applications/${application.applicationId}`, {
        method: 'DELETE',
        credentials: 'include'
    })

    return (response.json() || {});
}

export async function saveApplication(application){
    if(application.applicationId){
        await fetch(`${API_BASE}/api/applications/${application.applicationId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(application),
            credentials: 'include'
        });
    }else{
        await fetch(`${API_BASE}/api/applications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(application),
            credentials: 'include'
        });
    }
}