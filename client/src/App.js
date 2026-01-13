import React, { useEffect, useState } from 'react'
import CardApplication from './components/CardApplication'
import ModalApplicationEdit from './components/ModalApplicationEdit'

function App() {
    const [backendData, setBackendData] = useState([{}])
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchApplications = () => {
        fetch("/api/applications")
            .then(res => res.json())
            .then(data => setBackendData(data));
    };
  
    useEffect(() => {
        fetchApplications();
    }, [])

    function editApplication(application){
        setSelectedApplication(application);
        setIsEditModalOpen(true);
    }

    return (
        <div className="job-hunt-container">
        {
            (typeof backendData.applications === 'undefined') ? (
                <p>loading...</p>
            ) : (
                backendData.applications.map((application, i) => (
                    <CardApplication 
                        key={application.applicationId} 
                        application={application}
                        onEdit={() => editApplication(application)} />
                ))
            )
        }
            <ModalApplicationEdit
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={() => fetchApplications()}
                application={selectedApplication}
            />
        </div>
    )
}

export default App