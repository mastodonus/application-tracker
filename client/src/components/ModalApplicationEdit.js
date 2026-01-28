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
import API_BASE from '../utilities/ApiUtilities';

function ModalApplicationEdit({ open, onClose, onSave, application }) {
    const [draft, setDraft] = useState({});

    useEffect(() => {
        if (application) {
            setDraft({
                ...application,
                applied: application.applied ? DateTime.fromISO(application.applied) : null
            });
        }else{
            setDraft({});
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
            await fetch(`${API_BASE}/api/applications/${draft.applicationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(draft)
            });
        }else{
            await fetch(`${API_BASE}/api/applications`, {
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

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogContent>
                <h2>{(application?.company 
                    ? `Edit ${application?.company} - ${application?.title}`
                    : 'Add Application')}</h2>
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