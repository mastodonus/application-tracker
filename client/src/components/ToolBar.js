import { useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from "../utilities/AuthProvider";
import Logo from "./Logo";

function ToolBar({children}){
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Logo sx={{fontSize: '2rem', flexGrow: 1, filter: 'brightness(2)'}} logoSize="4rem" />
                {children}
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
                <Avatar src={user?.avatar} imgProps={{ referrerPolicy: 'no-referrer' }}/>
            </Toolbar>
        </AppBar>
    );
}

export default ToolBar;