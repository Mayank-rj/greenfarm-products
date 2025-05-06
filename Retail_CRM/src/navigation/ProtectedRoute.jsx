import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../utils/context/AuthContext';
import LoadingScreen from '../components/loadingScreen/loadingScreen';
import { useState } from 'react';
import { useEffect } from 'react';

const ProtectedRoute = () => {
    const { isAuthenticated,loading,logout } = useAuth();
    const location = useLocation(); 
    const [loadingDelay, setLoadingDelay] = useState(true); // Add delay state

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoadingDelay(false);
        }, 1000); // 2 seconds delay

        return () => clearTimeout(timer); // Cleanup the timeout
    }, []);

    if(loading || loadingDelay){
        return (<LoadingScreen/>);
    }else{
        if(!isAuthenticated){
            logout();
            return <Navigate to="/retailcrm/admin/login" state={{ from: location.pathname+location.search }}/>;
        }else{
            return <Outlet />;
        }
    }
 
};

export default ProtectedRoute;
