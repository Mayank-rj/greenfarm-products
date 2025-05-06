import React, { forwardRef } from 'react'
import { Typography, Button, Dialog, DialogContent, DialogActions, Slide } from '@mui/material';

const ConfirmationModal = ({ open, handleOnClose, handleOnConfirm, heading, text=null }) => {
    const Transition = forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });
    return (
        <Dialog
            open={open}
            keepMounted
            onClose={handleOnClose} // If clicked outside, it won't close until an action is taken
            aria-describedby="alert-dialog-slide-description"
           
        >   
            <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 }, display: 'flex', justifyContent: 'center' ,flexDirection:"column",alignItems:"center"}}>
                <Typography variant='h6'>{heading}</Typography>
                <Typography variant='p'>{text}</Typography>
            </DialogContent>
            
            <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Button variant='contained' color='primary' onClick={handleOnConfirm}>Confirm</Button>
                <Button variant='contained' color='error' onClick={handleOnClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationModal
