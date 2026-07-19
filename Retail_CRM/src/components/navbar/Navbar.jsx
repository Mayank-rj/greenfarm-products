import React, { useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { FiLogOut, } from 'react-icons/fi';
import { NavLink } from 'react-router';
import { Button, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import Logo from '../../assets/images/mainlogo.png';
import './Navbar.css';
import { useAuth } from '../../utils/context/AuthContext';
import ConfirmationModal from '../modals/ConfirmationModal';

const Navbar = () => {
    const { logout, isAuthenticated } = useAuth();
    const [openAlert, setOpenAlert] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClickProfile = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseProfile = () => {
        setAnchorEl(null);
    };
    const handleClickOpen = () => {
        setOpenAlert(true);
    };

    const handleClose = () => {
        setOpenAlert(false);
    };

    return (
        <>
            <nav className='nav'>

                <div className="logo">
                    <img src={Logo} alt="company logo" />
                </div>

                <div className="nav-items">
                    <ul className="nav-items">
                        {isAuthenticated && <li>
                            <Tooltip title='Profile'>
                                <span className='nav-icon-span' onClick={handleClickProfile}>
                                    <CgProfile style={{ fontSize: 29, marginTop: 9, marginRight: 25, }} />
                                </span>
                            </Tooltip>

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleCloseProfile}
                                onClick={handleCloseProfile}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >

                                <MenuItem onClick={handleClickOpen}>
                                    <FiLogOut style={{ fontSize: 25, marginTop: 9, marginRight: 10 }} />
                                    Logout
                                </MenuItem>

                            </Menu>
                        </li>}
                        {!isAuthenticated &&
                            <li className="nav-links">
                                <NavLink to='/retailcrm/admin/login'>
                                    <Button variant='contained' className='nav-icon-span' >
                                        <Typography variant='button'>Login</Typography>
                                    </Button>
                                </NavLink>
                            </li>
                        }
                    </ul>
                </div>

            </nav>

            <ConfirmationModal
                open={openAlert}
                handleOnClose={handleClose}
                handleOnConfirm={() => {
                    logout();  // Perform logout
                    handleClose();  // Close the modal after logout
                }}
                heading={"Do You Want To Logout?"}
            />
        </>
    );
};

export default Navbar;
