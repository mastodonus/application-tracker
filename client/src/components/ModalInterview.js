import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';

function ModalInterview({interview, isOpen, handleClose, handleSave}){
    const [draft, setDraft] = useState({});

    useEffect(() => {
        if(isOpen && interview){
            setDraft({
                ...interview,
                interviewDate: interview.interviewDate ? DateTime.fromISO(interview.interviewDate) : null
            })
        }else{
            setDraft({})
        }
    }, [isOpen])

    function updateField(field, value) {
        setDraft(prev => ({
            ...prev,
            [field]: value
        }));
    }

    return (
        <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Add Interview</DialogTitle>
            <DialogContent>
                <Box>
                    <LocalizationProvider dateAdapter={AdapterLuxon}>
                        <DateTimePicker
                            label="Interview Date"
                            value={draft.interviewDate ?? null}
                            onChange={(date) => {
                                updateField('interviewDate', date)}}                   
                            format="DDD t"
                            slotProps={{
                                textField: {
                                fullWidth: true,
                                margin: "normal"
                                }
                            }}
                            />
                    </LocalizationProvider>

                    <TextField
                        label="Details"
                        fullWidth
                        multiline
                        rows={3}
                        margin="normal"
                        value={draft.details ?? ''}
                        onChange={e => updateField('details', e.target.value)}
                    />
                </Box>
                 <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={handleClose} sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={() => {
                        handleSave(draft)
                    }}>
                        Save
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default ModalInterview;