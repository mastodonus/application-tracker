import API_BASE from '../utilities/ApiUtilities';

export async function getInterview(interviewId){
    const response = await fetch(`${API_BASE}/interviews/${interviewId}`, {
        credentials: 'include'
    });

    return response.json();
}

export async function getInterviews(applicationId){
    const response = await fetch(`${API_BASE}/api/interviews?applicationId=${applicationId}`, {
        credentials: 'include'
    });

    return (response.json() || []);
}

export async function deleteInterview(interviewId){
    await fetch(`${API_BASE}/api/interviews/${interviewId}`, {
        method: 'DELETE',
        credentials: 'include'
    });
}

export async function saveInterview(interview){
    if(interview.interviewId){
        var response = await fetch(`${API_BASE}/api/interviews/${interview.interviewId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(interview),
            credentials: 'include'
        });

        return response.json();
    }else{
        var response = await fetch(`${API_BASE}/api/interviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(interview),
            credentials: 'include'
        });

        return response.json();
    }
}