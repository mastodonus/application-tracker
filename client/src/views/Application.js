import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SaveIcon from '@mui/icons-material/Save';
import { getApplication, saveApplication } from '../store/ApplicationStore';
import ToolBar from "../components/ToolBar";


function Application(){
    const { id } = useParams();
    const isEditMode = id;
    const [draft, setDraft] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (isEditMode) {
            getApplication(id)
            .then(application => setDraft({
                ...application,
                applied: application.applied ? DateTime.fromISO(application.applied) : null
            }));
        }else{
            setDraft({});
        }
    }, []);

    function updateField(field, value) {
        setDraft(prev => ({
            ...prev,
            [field]: value
        }));
    }

    return (
        <>
            <ToolBar />
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        mt: 2
                    }}
                >
                    <IconButton
                        size="large"
                        onClick={() => navigate('/dashboard')}
                    >
                        <ArrowBackIosIcon />
                    </IconButton>

                    <Box component="h2" sx={{ m: 0, ml: '0.5rem' }}>
                        {draft?.company 
                        ? `Edit ${draft?.company} ${draft?.title ? `- ${draft?.title}`.trim() : ''}`
                        : 'Add Application'}
                    </Box>
                </Box>
                <Box sx={{width: '100%', height: '100%', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridGap: '1rem'}}>
                    <Card sx={{gridRow: '1 / span 5', gridColumn: '1 / span 3'}}>
                        <Box sx={{m: '1rem'}}>
                            <h3>Details</h3>
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
                    </Card>
                    <Card sx={{gridRow: '1 / span 2', gridColumn: '4 / span 2'}}>
                        <Box sx={{m: '1rem'}}>
                            <h3>Documents</h3>
                        </Box>
                    </Card>
                    <Card sx={{gridRow: '3 / span 3', gridColumn: '4 / span 2'}}>
                        <Box sx={{m: '1rem'}}>
                            <h3>Interviews</h3>
                        </Box>
                    </Card>
                </Box>
                <Box 
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        mt: 2,
                        justifyContent: 'space-between',
                        width: '100%'
                    }}>
                    <IconButton
                        size="small"
                        onClick={() => navigate('/dashboard')}
                        sx={{border: '1px solid', borderRadius: '12px', p: '0.75rem' }}
                    >
                        <ArrowBackIosIcon sx={{mr: '0.5rem'}} />
                        Back
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={async () => {
                            await saveApplication(draft);
                            navigate('/dashboard');
                        }}
                        color='primary'
                        sx={{border: '1px solid', borderRadius: '12px', p: '0.75rem' }}
                    >
                        Save
                        <SaveIcon sx={{ml: '0.5rem'}}/>
                    </IconButton>
                </Box>
            </Container>
        </>
    );
}

export default Application;