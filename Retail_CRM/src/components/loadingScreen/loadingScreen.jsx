import { Box, CircularProgress } from '@mui/material'
import React from 'react'

const LoadingScreen = () => {
    return (
        <Box sx={{ display: 'flex' ,width:"100%",height:"80svh",justifyContent:"center",alignItems:"center"}}>
            <CircularProgress />
        </Box>
    )
}

export default LoadingScreen
