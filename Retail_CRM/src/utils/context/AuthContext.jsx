import React, { createContext, useState, useContext, useEffect } from 'react';
import { verifyUser } from '../../api';
import errorHandler from '../../api/errorHandler';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);


    const verifyUserHandler = async () => {
        try {
            setLoading(true);
            const data = await verifyUser();
            if (data.success) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }

    }
    // Check for stored user and token on initial load
    useEffect(() => {
        const authToken = localStorage.getItem("AdminAuthToken");
        if (authToken) {
            verifyUserHandler();
        }
        
    }, []);

    // Function to log in
    const login = (token) => {
        localStorage.setItem("AdminAuthToken", token);
        setIsAuthenticated(true);
    };

    // Function to log out
    const logout = () => {
        localStorage.removeItem("AdminAuthToken");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout,loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
const styleSheet = document.createElement("style");

styleSheet.innerText = `
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}`;
document.head.appendChild(styleSheet);