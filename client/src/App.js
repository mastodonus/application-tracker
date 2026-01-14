import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import PlusIcon from '@mui/icons-material/Add';
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

    function addApplication(){
        setSelectedApplication(null);
        setIsEditModalOpen(true);
    }

    async function deleteApplication(application){
        const confirmed = window.confirm(
            `Are you sure you want to delete ${application.company ?? 'this application'}?`
        );

        if (!confirmed) {
            return;
        }

        await fetch(`/api/applications/${application.applicationId}`, {
            method: 'DELETE',
        });
        fetchApplications();
    }

    return (
        <div className="job-hunt-container">
            <Card className="application-card add-application-card">
                <IconButton onClick={() => addApplication()}>
                    <PlusIcon sx={{ fontSize: 40 }}  />
                </IconButton>
            </Card>
        {
            (typeof backendData.applications === 'undefined') ? (
                <p>loading...</p>
            ) : (
                backendData.applications.map((application, i) => (
                    <CardApplication 
                        key={application.applicationId} 
                        application={application}
                        onEdit={() => editApplication(application)}
                        onDelete={() => deleteApplication(application)} />
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