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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SaveIcon from '@mui/icons-material/Save';
import PlusIcon from '@mui/icons-material/AddOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownloadOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import { getApplication, saveApplication } from '../store/ApplicationStore';
import { getDocumentHeaders, uploadDocuments, deleteDocument, downloadDocument  } from '../store/DocumentStore';
import { getInterviews, deleteInterview, saveInterview } from '../store/InterviewStore';
import ToolBar from "../components/ToolBar";
import ModalInterview from '../components/ModalInterview';


function Application(){
    const [draft, setDraft] = useState({});
    const [documents, setDocuments] = useState([]);
    const [draftDocuments, setDraftDocuments] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [draftInterviews, setDraftInterviews] = useState([]);
    const [selectedInterview, setSelectedInterview] = useState({});
    const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);


    const { id } = useParams();
    const isEditMode = id;
    const navigate = useNavigate();

    async function refreshDocuments(){
        if(isEditMode){
            await getDocumentHeaders(id).then(response =>
                setDocuments(response)
            );
        }
    }

    async function refreshInterviews(){
        if(isEditMode){
            await getInterviews(id).then(response => {
                setInterviews(response.map(i => ({
                    ...i,
                    interviewDate: i.interviewDate ? DateTime.fromISO(i.interviewDate) : i.interviewDate
                })))
            });
        }
    }

    useEffect(() => {
        if (isEditMode) {
            getApplication(id).then(application => 
                setDraft({
                    ...application,
                    applied: application.applied ? DateTime.fromISO(application.applied) : null
                }
            ));

            refreshDocuments();
            refreshInterviews();
        }else{
            setDraft({});
            setDocuments([]);
            setDraftDocuments([]);
            setInterviews([]);
            setDraftInterviews([]);
        }
    }, []);

    function updateField(field, value) {
        setDraft(prev => ({
            ...prev,
            [field]: value
        }));
    }

    async function saveHandler(){
        const createdApplicationId = await saveApplication(draft);

        if(!isEditMode){
            if(draftDocuments.length){
                await uploadDocuments({
                    documents: draftDocuments.map(d => d.file),
                    applicationId: createdApplicationId
                });
            }
            if(draftInterviews.length){
                await Promise.all(draftInterviews.map(interview => 
                    saveInterview({
                        ...interview,
                        applicationId: createdApplicationId
                    })));
            }
        }

        navigate('/dashboard');
    }

    async function deleteDocumentHandler(documentId){
        const document = documents.find(d => d.documentId === documentId)
        
        const confirmed = window.confirm(
            `Are you sure you want to delete ${document.filename}?`
        );

        if (!confirmed) {
            return;
        }

        await deleteDocument(document.documentId);
        await refreshDocuments();
    }

    async function deleteDraftDocumentHandler(draftDocumentId){
        const draft = draftDocuments.find(d => d.draftId === draftDocumentId);
        
        const confirmed = window.confirm(
            `Are you sure you want to delete ${draft.file.name}?`
        );

        if (!confirmed) {
            return;
        }

        setDraftDocuments(draftDocuments.filter(d => d.draftId !== draft.draftId));
    }

    async function uploadFilesHandler(files){
        if(isEditMode){
            await uploadDocuments({
                documents: files,
                applicationId: draft.applicationId
            });

            await refreshDocuments();
        }else{
            setDraftDocuments([
                ...draftDocuments,
                ...files.map(f => ({
                    draftId: crypto.randomUUID(),
                    file: f
            }))]);
        }
    }

    async function deleteDraftDocumentHandler(draftDocumentId){
        const draft = draftDocuments.find(d => d.draftId === draftDocumentId);
        
        const confirmed = window.confirm(
            `Are you sure you want to delete ${draft.file.name}?`
        );

        if (!confirmed) {
            return;
        }

        setDraftDocuments(draftDocuments.filter(d => d.draftId !== draft.draftId));
    }

    async function saveInterviewHandler(interview){
        interview.applicationId = id;
        interview.interviewDate = interview.interviewDate 
            ? DateTime.fromISO(interview.interviewDate)
            : interview.interviewDate;
        if(isEditMode){
            await saveInterview(interview);
            refreshInterviews();
        }else{
            setDraftInterviews([
                ...draftInterviews.filter(i => i.draftId !== interview.draftId),
                {
                    draftId: crypto.randomUUID(),
                    ...interview
                }
            ])
        }

        setIsInterviewModalOpen(false);
    }

    async function deleteInterviewHandler(interview){
        const confirmed = window.confirm(
            `Are you sure you want to delete the interview on ${interview.interviewDate}?`
        );

        if (!confirmed) {
            return;
        }


        if(interview.interviewId){
            await deleteInterview(interview.interviewId);
            refreshInterviews();
        }else{
            setDraftInterviews(draftInterviews.filter(i => i.draftId !== interview.draftId));
        }
    }

    async function editInterviewHandler(interview){
        setSelectedInterview(interview);
        setIsInterviewModalOpen(true);
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
                                    value={draft.applied ?? null}
                                    onChange={(date) => {
                                        updateField('applied', date)}}                   
                                    format="DDD"
                                    slotProps={{
                                        textField: {
                                        fullWidth: true,
                                        margin: "normal"
                                        }
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
                                                onClick={async () => await deleteDocumentHandler(document.documentId)}
                                                sx={{maxWidth: '3rem', display: 'flex', justifyContent: 'center'}}>
                                                <ListItemIcon sx={{minWidth: 0}}>
                                                    <DeleteIcon />
                                                </ListItemIcon>
                                            </ListItemButton>
                                        </ListItem>
                                    ))
                                }
                                {
                                    draftDocuments.map((draftDocument, i) => (
                                        <ListItem key={draftDocument.draftId} disablePadding>
                                            <ListItemText primary={draftDocument.file.name}/>
                                            <ListItemButton
                                                onClick={async () => await deleteDraftDocumentHandler(draftDocument.draftId)}
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
                                            onChange={(e)=> uploadFilesHandler(Array.from(e.target.files))}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Box>
                    </Card>
                    <Card sx={{gridRow: '3 / span 3', gridColumn: '4 / span 2'}}>
                        <Box sx={{m: '1rem'}}>
                            <h3>Interviews</h3>                            
                            {
                                interviews.concat(draftInterviews).map((interview, i) => (
                                    <ListItem key={interview.interviewId} disablePadding>
                                        <ListItemText primary={interview.interviewDate.toLocaleString(DateTime.DATETIME_FULL)}/>
                                        <ListItemButton
                                            onClick={() => editInterviewHandler(interview)}
                                            sx={{maxWidth: '3rem', display: 'flex', justifyContent: 'center'}}>
                                            <ListItemIcon sx={{minWidth: 0}}>
                                                <EditIcon />
                                            </ListItemIcon>
                                        </ListItemButton>
                                        <ListItemButton
                                            onClick={async () => await deleteInterviewHandler(interview)}
                                            sx={{maxWidth: '3rem', display: 'flex', justifyContent: 'center'}}>
                                            <ListItemIcon sx={{minWidth: 0}}>
                                                <DeleteIcon />
                                            </ListItemIcon>
                                        </ListItemButton>
                                    </ListItem>
                                ))
                            }
                            <List sx={{pt: '1rem', ml: '1rem'}}>
                                <ListItem disablePadding>
                                    <ListItemButton 
                                        component="label"
                                        variant="contained"
                                        sx={{pl: 0}}
                                        onClick={() => setIsInterviewModalOpen(true)}>
                                        <ListItemIcon sx={{minWidth: 0, marginRight: '0.5rem'}}>
                                            <PlusIcon />
                                        </ListItemIcon>
                                        Add Interview
                                    </ListItemButton>
                                </ListItem>
                            </List>
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
                        onClick={async () => await saveHandler()}
                        color='primary'
                        sx={{border: '1px solid', borderRadius: '12px', p: '0.75rem' }}
                    >
                        Save
                        <SaveIcon sx={{ml: '0.5rem'}}/>
                    </IconButton>
                </Box>
            </Container>
            <ModalInterview 
                interview={selectedInterview}
                isOpen={isInterviewModalOpen} 
                handleClose={() => {
                    setIsInterviewModalOpen(false)
                    setSelectedInterview({})}}
                handleSave={saveInterviewHandler}/>
        </>
    );
}

export default Application;