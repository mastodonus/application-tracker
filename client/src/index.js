import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import theme from './theme';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './utilities/AuthProvider';
import ProtectedRoute from './utilities/ProtectedRoute';
import Dashboard from './views/Dashboard';
import Login from './views/Login';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <BrowserRouter>
                    <AuthProvider>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                            <Route path="*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        </Routes>
                    </AuthProvider>
                </BrowserRouter>
            </GoogleOAuthProvider>
        </ThemeProvider>
    </React.StrictMode>
);

reportWebVitals();
