import { useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItem  from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import PlusIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import LogoutIcon from '@mui/icons-material/Logout';
import CardApplication from '../components/CardApplication';
import ModalApplicationEdit from '../components/ModalApplicationEdit';
import ModalDocumentsEdit from '../components/ModalDocumentsEdit';
import Logo from "../components/Logo";
import API_BASE from '../utilities/ApiUtilities';
import { useAuth } from "../utilities/AuthProvider";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [applications, setApplications] = useState([{}])
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditDocumentsModalOpen, setIsEditDocumentsModalOpen] = useState(false);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [applyFilters, setApplyFilters] = useState(false);
    const [filterCompany, setFilterCompany] = useState('');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const fetchApplications = () => {
        fetch(`${API_BASE}/api/applications`, {
                credentials: 'include'
            })
            .then(res => res.json())
            .then(data => (data || []).filter((a) => 
                !filterCompany || a.company.toUpperCase().includes(filterCompany.toUpperCase())
            ))
            .then(applications => setApplications(applications))
            .then(setApplyFilters(false));
    };
  
    useEffect(() => {
        fetchApplications();
    }, [applyFilters])

    function editApplication(application){
        setSelectedApplication(application);
        setIsEditModalOpen(true);
    }

    function addApplication(){
        setSelectedApplication(null);
        setIsEditModalOpen(true);
    }

    function editDocuments(application){
        setSelectedApplication(application);
        setIsEditDocumentsModalOpen(true)
    }

    function clearFilters(){
        setFilterCompany('');
        setApplyFilters(true);
    }

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    async function deleteApplication(application){
        const confirmed = window.confirm(
            `Are you sure you want to delete ${application.company ?? 'this application'}?`
        );

        if (!confirmed) {
            return;
        }

        await fetch(`${API_BASE}/api/applications/${application.applicationId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        fetchApplications();
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Job Hunt
                    </Typography> */}
                    <Logo sx={{fontSize: '2rem', flexGrow: 1, filter: 'brightness(2)'}}/>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => addApplication()}
                    >
                        <PlusIcon />
                    </IconButton>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => setIsFilterDrawerOpen(true)}
                    >
                        <FilterAltIcon />
                    </IconButton>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => clearFilters()}
                    >
                        <FilterAltOffIcon />
                    </IconButton>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => handleLogout()}
                    >
                        <LogoutIcon />
                    </IconButton>
                    <Avatar src={user?.avatar} slotProps={{ referrerPolicy: 'no-referrer' }}/>
                </Toolbar>
            </AppBar>
            <Drawer open={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)}>
                <Box sx={{ width: '20rem' }} role="presentation">
                    <List>
                        <ListItem disablePadding>
                            <TextField
                                label="Search"
                                fullWidth
                                margin="normal"
                                value={filterCompany}
                                onChange={e => setFilterCompany(e.target.value)}
                                sx={{ margin: '1rem' }}
                            />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => setApplyFilters(true)}>
                                <ListItemText primary="Apply" sx={{textAlign: 'center'}}></ListItemText>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
            <div className="job-hunt-container">
            {
                (typeof applications === 'undefined') ? (
                    <p>loading...</p>
                ) : (!applications.length && !filterCompany) ? (
                    <Box sx={{textAlign: 'center'}}>To start tracking applications, press the + icon.</Box>
                ) : (!applications.length) ? (
                    <Box sx={{textAlign: 'center'}}>No applications found.</Box>
                ) : (
                    applications.map((application, i) => (
                        <CardApplication 
                            key={application.applicationId} 
                            application={application}
                            onEdit={() => editApplication(application)}
                            onDelete={() => deleteApplication(application)}
                            onEditDocuments={() => editDocuments(application)} />
                    ))
                )
            }
                <ModalApplicationEdit
                    open={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={() => fetchApplications()}
                    application={selectedApplication}
                />
                <ModalDocumentsEdit
                    open={isEditDocumentsModalOpen}
                    onClose={() => setIsEditDocumentsModalOpen(false)}
                    onSave={() => fetchApplications()}
                    application={selectedApplication}
                />
            </div>
        </>
    )
}

export default Dashboard