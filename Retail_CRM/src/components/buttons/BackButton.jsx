import { Button } from '@mui/material'
import React from 'react'
import { IoArrowBack } from "react-icons/io5";
const BackButton = ({handleOnClick}) => {
    return (
        <Button
            onClick={handleOnClick}
            sx={{
                color: "#1976d2",
                marginLeft: 5,
                display:'flex'
            }}
        >
            <IoArrowBack /> back
        </Button>
    )
}

export default BackButton
