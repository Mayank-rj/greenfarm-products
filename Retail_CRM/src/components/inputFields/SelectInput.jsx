import { MenuItem, TextField } from '@mui/material'
import React from 'react'

const SelectInput = ({ name, label, options=[],valueProperty,titleProperty ,value, isError, helperText, handleOnChange, isRequired = false }) => {
    return (
        <TextField
            select
            name={name}
            label={label}
            value={value}
            onChange={handleOnChange}
            error={!!isError}
            helperText={helperText}
            required={isRequired}
            fullWidth
        >
            {options.map((item) => (
                <MenuItem key={item._id} value={item[valueProperty]}>
                    {item[titleProperty]}
                </MenuItem>
            ))}
        </TextField>
    )
}

export default SelectInput
