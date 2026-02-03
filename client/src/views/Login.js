
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import Box from '@mui/material/Box';
import { useAuth } from "../utilities/AuthProvider";
import Logo from "../components/Logo";
import API_BASE from '../utilities/ApiUtilities';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate("/dashboard", { replace: true });
  };

  return (
    <>
        <Box sx={{position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'}}>
            <Logo  sx={{fontSize: '4rem', filter: 'brightness(1.5)' }}/>
            <GoogleLogin
                onSuccess={async (credentialResponse) => {
                    const { credential } = credentialResponse;

                    try {
                        const userResponse = await fetch(`${API_BASE}/api/user/login`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            credentials: 'include',
                            body: JSON.stringify({
                                token: credential
                            })
                        });

                        const user = await userResponse.json();

                        login(user);
                        navigate('/dashboard', { replace: true });
                    } catch (err) {
                        console.error('Login failed', err);
                    }
                }}

                onError={() => {
                    console.error('Google Login Failed');
                }}
            />
        </Box>
    </>
  );
}