import { Button, Container, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router';

const AddNewTitle = ({title,path}) => {
    const navigate = useNavigate();
    return (
        <Container
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 5,
                marginTop: 5,
            }}
        >
            <Typography
                variant="h6"
                textAlign="center"
                color="#1976d2"
                fontWeight="bold"
            >
                {title}
            </Typography>
                <Button
                    sx={{

                        fontSize: 15,
                        backgroundColor: '#b71c1c',
                        color: 'white',
                        border: 'none',
                        borderRadius: 1, // 8px border radius
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#8e0000', // Darker shade for hover effect
                        },
                    }}
                    onClick={()=>navigate(path)}
                >
                    CREATE NEW
                </Button>
        </Container>
    )
}

export default AddNewTitle
