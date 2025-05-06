import { Button } from '@mui/material'
import React from 'react'

const AddEditButton = ({ title,handleOnClick,idDisabled=false }) => {
    return (
        <Button
            variant="contained"
            color="primary"
            style={{ margin: 20, borderRadius: 15, padding: 10 }}
            onClick={handleOnClick}
            disabled={idDisabled}
        >
            {title}
        </Button>
    )
}

export default AddEditButton
