import React, { useEffect, useState } from 'react'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import PlusIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

function ModalApplicationEdit({ open, onClose, onSave, application }) {
    const [draft, setDraft] = useState({});
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        if (application) {
            setDraft({
                ...application,
                applied: application.applied ? DateTime.fromISO(application.applied) : null
            });
        }
    }, [application]);


    function updateField(field, value) {
        setDraft(prev => ({
            ...prev,
            [field]: value
        }));
    }

    async function handleSave() {
        if(draft.applicationId){
            await fetch(`/api/applications/${draft.applicationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(draft)
            });
        }else{
            await fetch(`/api/applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(draft)
            });
        }

        onSave();
        onClose();
    }

    const fetchDocuments = () => {
        if(!draft.applicationId){
            console.log('no applicationId', draft)
            return;
        }

        fetch(`/api/documents?applicationId=${draft.applicationId}`)
            .then(res => res.json())
            .then(data => setDocuments((data.documents || [])));
    };
    
    useEffect(() => {
        fetchDocuments();
    }, [draft])

    async function uploadDocuments(documents){
        await Promise.all(documents.map((document) => {
            const formData = new FormData();
            formData.append('applicationId', draft.applicationId);
            formData.append('document', document);

            fetch(`/api/documents`, {
                method: 'POST',
                body: formData
            });
        }));
        fetchDocuments();
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

            // Try to get filename from headers
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

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogContent>
                <h2>{(application?.company 
                    ? `${application?.company} - ${application?.title}`
                    : 'Add Application')}</h2>
                <Box sx={{display: 'flex', justifyContent: 'space-evenly', gap: '1rem'}}>
                    <Box>
                        <TextField
                            label="Company"
                            fullWidth
                            margin="normal"
                            value={draft.company ?? ''}
                            onChange={e => updateField('company', e.target.value)}
                        />

                        <TextField
                            label="Title"
                            fullWidth
                            margin="normal"
                            value={draft.title ?? ''}
                            onChange={e => updateField('title', e.target.value)}
                        />

                        <TextField
                            label="Position"
                            fullWidth
                            margin="normal"
                            value={draft.position ?? ''}
                            onChange={e => updateField('position', e.target.value)}
                        />

                        <TextField
                            label="Location"
                            fullWidth
                            margin="normal"
                            value={draft.site ?? ''}
                            onChange={e => updateField('site', e.target.value)}
                        />

                        <TextField
                            label="Salary Min"
                            type="number"
                            margin="normal"
                            value={draft.salaryMin ?? ''}
                            onChange={e => updateField('salaryMin', e.target.value)}
                        />

                        <TextField
                            label="Salary Max"
                            type="number"
                            margin="normal"
                            value={draft.salaryMax ?? ''}
                            onChange={e => updateField('salaryMax', e.target.value)}
                            sx={{
                                marginLeft: '0.5rem',
                            }}
                        />

                        <TextField
                            label="Link"
                            fullWidth
                            margin="normal"
                            value={draft.link ?? ''}
                            onChange={e => updateField('link', e.target.value)}
                        />

                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            margin="normal"
                            value={draft.description ?? ''}
                            onChange={e => updateField('description', e.target.value)}
                        />

                        <LocalizationProvider dateAdapter={AdapterLuxon}>
                            <DatePicker
                                label="Applied"
                                value={draft.applied}
                                onChange={date => updateField('applied', date)}
                                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                                sx={{
                                    marginTop: '0.5rem',
                                }}
                            />
                        </LocalizationProvider>

                        <TextField
                            select
                            label="Status"
                            fullWidth
                            margin="normal"
                            value={draft.status ?? ''}
                            onChange={e => updateField('status', e.target.value)}
                        >
                            <MenuItem value="INTERVIEWING">INTERVIEWING</MenuItem>
                            <MenuItem value="OPEN">OPEN</MenuItem>
                            <MenuItem value="REJECTED">REJECTED</MenuItem>
                        </TextField>
                    </Box>
                    <Box sx={{minWidth: '40%'}}>
                        
                        <List sx={{pt: '1rem', ml: '1rem'}}>
                            <ListItem disablePadding>
                                <ListItemButton 
                                    component="label"
                                    variant="contained">
                                    <ListItemIcon sx={{minWidth: 0, marginRight: '0.5rem'}}>
                                        <PlusIcon />
                                    </ListItemIcon>
                                    Upload Document
                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        onChange={(e)=> uploadDocuments(Array.from(e.target.files))}
                                    />
                                </ListItemButton>
                            </ListItem>
                            {
                                documents.map((document, i) => (
                                    <ListItem disablePadding>
                                        <ListItemButton 
                                            key={document.documentId}
                                            onClick={() => downloadDocument(document.documentId)}>
                                            <ListItemIcon sx={{minWidth: 0, marginRight: '0.5rem'}}>
                                                <FileDownloadIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={document.filename}/>
                                        </ListItemButton>
                                    </ListItem>
                                ))
                            }
                        </List>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={onClose} sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSave}>
                        Save
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default ModalApplicationEdit