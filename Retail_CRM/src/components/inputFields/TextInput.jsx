import { TextField } from '@mui/material'
import React from 'react'

const TextInput = ({ name, label, value, isError, helperText, handleOnChange, isRequired = false,readOnly=false }) => {
    return (
        <TextField
            name={name}
            label={label}
            value={value}
            onChange={handleOnChange}
            error={!!isError}
            helperText={helperText}
            required={isRequired}
            fullWidth
            slotProps={{
                input: {
                  readOnly: {readOnly},
                },
              }}
        // autoFocus
        />
    )
}

export default TextInput
