import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PlusIcon from '@mui/icons-material/AddOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownloadOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

function ModalDocumentsEdit({open, onClose, application}){
    const [documents, setDocuments] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const fetchDocuments = () => {
        if (!application){
            return;
        }
        fetch(`/api/documents?applicationId=${application.applicationId}`)
            .then(res => res.json())
            .then(data => setDocuments((data.documents || [])))
            .then(setRefresh(false));
    };
    
    useEffect(() => {
        fetchDocuments();
    }, [application, refresh]);

    async function uploadDocuments(documents){
        await Promise.all(documents.map((document) => {
            const formData = new FormData();
            formData.append('applicationId', application.applicationId);
            formData.append('document', document);

            fetch(`/api/documents`, {
                method: 'POST',
                body: formData
            });
        }));
        setRefresh(true);
    }

    async function downloadDocument(documentId) {
        try {
            const response = await fetch(`/api/documents/${documentId}`, {
                method: 'GET',
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

    async function deleteDocument(document){
        const confirmed = window.confirm(
            `Are you sure you want to delete ${document.filename}?`
        );

        if (!confirmed) {
            return;
        }

        await fetch(`/api/documents/${document.documentId}`, {
            method: 'DELETE',
        });
        setRefresh(true);
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogContent>
                <h2>Edit Documents</h2>
                <h5>{application?.company} - {application?.title}</h5>
                <List sx={{pt: '1rem', ml: '1rem'}}>
                    {
                        documents.map((document, i) => (
                            <ListItem key={document.documentId} disablePadding>
                                <ListItemText primary={document.filename}/>
                                <ListItemButton
                                    onClick={() => downloadDocument(document.documentId)}
                                    sx={{maxWidth: '3rem', display: 'flex', justifyContent: 'center'}}>
                                    <ListItemIcon sx={{minWidth: 0}}>
                                        <FileDownloadIcon />
                                    </ListItemIcon>
                                </ListItemButton>
                                <ListItemButton
                                    onClick={() => deleteDocument(document)}
                                    sx={{maxWidth: '3rem', display: 'flex', justifyContent: 'center'}}>
                                    <ListItemIcon sx={{minWidth: 0}}>
                                        <DeleteIcon />
                                    </ListItemIcon>
                                </ListItemButton>
                            </ListItem>
                        ))
                    }
                    <ListItem disablePadding>
                        <ListItemButton 
                            component="label"
                            variant="contained"
                            sx={{pl: 0}}>
                            <ListItemIcon sx={{minWidth: 0, marginRight: '0.5rem'}}>
                                <PlusIcon />
                            </ListItemIcon>
                            Upload Documents
                            <input
                                type="file"
                                hidden
                                multiple
                                onChange={(e)=> uploadDocuments(Array.from(e.target.files))}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </DialogContent>
        </Dialog>
    );
}

export default ModalDocumentsEdit