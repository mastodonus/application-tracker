import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';

function ModalApplicationEdit({ open, onClose, onSave, application }) {
    const [draft, setDraft] = useState({});

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

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: 1,
                }}
            >
                <h2>{application?.company ?? 'Add Application'}</h2>
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



                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={onClose} sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSave}>
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default ModalApplicationEdit