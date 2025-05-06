import { Box } from '@mui/material';
import React from 'react';
import { useAuth } from '../utils/context/AuthContext';

const Layout = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return (
        <Box sx={{
            display: "grid",
            gridTemplateColumns: (isAuthenticated?"61px auto":"auto"),
            gridTemplateRows:"1fr",
            width:"100%",
            height:"100vh"
        }}>
            {children}
        </Box >
    );
}

export default Layout;
