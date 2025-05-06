import { Container, InputAdornment, TextField } from '@mui/material'
import { AiOutlineSearch } from 'react-icons/ai';
import React from 'react'

const TableSearchbar = ({ label, searchTerm, handleSearch }) => {
    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 5, marginTop: 5 }}>
            <TextField
                id="search"
                type="search"
                label={label}
                value={searchTerm}
                onChange={handleSearch}
                sx={{ width: { xs: 350, sm: 500, md: 800 }, }}
                slotProps={{
                    input: {
                        endAdornment: <InputAdornment position="end"><AiOutlineSearch /></InputAdornment>,
                    }
                }}
            />
        </Container>
    )
}

export default TableSearchbar
