import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import { AiOutlineHome, AiFillCloseCircle } from 'react-icons/ai'
import { FiLogIn, FiLogOut } from 'react-icons/fi'
import React, { useState, forwardRef } from 'react'
import { useNavigate } from 'react-router';
import { Button, Dialog, DialogActions, DialogContent, Typography, Slide, BottomNavigationAction } from '@mui/material';
import { toast } from 'react-toastify';
import { useAuth } from '../../utils/context/AuthContext';
import './BottomNavbar.css'
import ConfirmationModal from '../modals/ConfirmationModal';

const BottomNavbar = () => {
    const [openAlert, setOpenAlert] = useState(false);
    const [value, setValue] = useState(0);
    const { logout, isAuthenticated } = useAuth();
    const Transition = forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    const handleClickOpen = () => {
        setOpenAlert(true);
    };

    const handleClose = () => {
        setOpenAlert(false);
    };

    const navigate = useNavigate()

    return (
        <Box className='showMobile' sx={{ alignSelf: "flex-end" }}>
            <BottomNavigation sx={{ position: 'fixed', bottom: 0, width: '100%', fontSize: '50px', zIndex: 10, borderTop: "1px solid #E5E5E5" }}
                showLabels
                // value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            >
                <BottomNavigationAction label="Home" icon={<AiOutlineHome style={{ fontSize: 23 }} onClick={() => navigate('/retailcrm/admin/home')} />} />
                {
                    !isAuthenticated ?
                        <BottomNavigationAction label="Login" icon={<FiLogIn style={{ fontSize: 23 }} onClick={() => navigate('/retailcrm/admin/login')} />} />
                        :
                        <BottomNavigationAction label="Logout" icon={<FiLogOut style={{ fontSize: 23 }} onClick={handleClickOpen} />} />
                }

            </BottomNavigation>

            <ConfirmationModal
                open={openAlert}
                handleOnClose={handleClose}
                handleOnConfirm={() => {
                    logout();  // Perform logout
                    handleClose();  // Close the modal after logout
                }}
                heading={"Do You Want To Logout?"}
            />
        </Box >
    );
}
export default BottomNavbar