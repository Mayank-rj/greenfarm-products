import React, { useEffect, useState } from 'react'
import { validateCategory } from '../../schemas/CategorySchema.js';
import { Container, Typography, Grid2 as Grid, TextField, Paper, Box } from '@mui/material';
import BackButton from '../../components/buttons/BackButton';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import fetchData from '../../api/fetchData';
import { useLocation, useNavigate } from 'react-router';
import ImageUpload from '../../components/imageUpload/ImageUpload';
import errorHandler from '../../api/errorHandler';
import AddEditButton from '../../components/buttons/AddEditButton';
import getApi from '../../api/getApi.js';
import postApi from '../../api/postApi.js';

const CategoryManage = ({ edit, heading }) => {

    const initialValues = {
        name: "",
        cover: "",
        status: "active",
    }

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [categoryInfo, setCategoryInfo] = useState(initialValues);
    const [errors, setErrors] = useState(initialValues);
    const [loading, setLoading] = useState(false);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateCategory(categoryInfo, setErrors)) {
            try {
                let apiPromise;
                if (edit) {
                    apiPromise = postApi('/category/update', categoryInfo);
                    toast.promise(
                        apiPromise,
                        {
                            pending: 'Category updating...',
                            success: 'Category updated Successfully!',
                            error: {
                                render({ data }) {
                                    // Extract and return the error message
                                    console.log(data?.response?.data?.message);
                                    
                                    return data?.response?.data?.message || 'Category updating Failed!';
                                },
                            },
                        }
                    );
                } else {
                    apiPromise = postApi('/category/add', categoryInfo);
                    toast.promise(
                        apiPromise,
                        {
                            pending: 'Adding Category...',
                            success: 'Category added Successfully!',
                            error: {
                                render({ data }) {
                                    // Extract and return the error message
                                    return data?.response?.data?.message || 'Category adding Failed!';
                                },
                            },
                        }
                    );
                }

                setLoading(true);
                const data = await apiPromise;
                if (data.success) {
                    setCategoryInfo(initialValues);
                    navigate(-1);
                } else {
                    errorHandler(null, data.message)
                }
            } catch (error) {
                console.error(error.message);
                
                // errorHandler(error, error.response.data.message);
            } finally {
                setLoading(false)

            }
        } else {
            handleCloseDialog();
        }
    };
    const handleOnChange = (e) => {
        // console.log(e);

        setCategoryInfo({ ...categoryInfo, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" })
    }
    const handleImageSet = (value, index) => {
        if (index === 0) {
            setCategoryInfo({ ...categoryInfo, cover: value });
        } else {
            setCategoryInfo(prev => {
                const newImgs = prev.images;
                newImgs[index] = value;
                return { ...prev, images: newImgs };
            })
        }

    }

    const handleCloseDialog = () => {
        setSuccessDialogOpen(false);
    };

    useEffect(() => {
        if (edit) {
            const paramValue = queryParams.get("id");
            fetchData(() => getApi(`/category?id=${paramValue}`), setCategoryInfo, "Unable to fetch category", "Fetching category");
        }
    }, [])

    return (
        <Container>
            <BackButton handleOnClick={() => navigate(-1)} />
            <Typography variant='h4' fontWeight="bold" sx={{ textAlign: "center", color: "#1976d2" }} >{heading}</Typography>
            <Paper sx={{ padding: 3, marginBottom: { xs: 10, sm: 10, md: 5 } }} >
                <Grid container spacing={2}>

                    <Grid size={12}>
                        <TextField
                            name={"name"}
                            label={"Name"}
                            value={categoryInfo.name}
                            onChange={(e) => handleOnChange({
                                target: {
                                    name: e.target.name,
                                    value: e.target.value
                                }
                            })}
                            onBlur={(e) => handleOnChange({
                                target: {
                                    name: e.target.name,
                                    value: e.target.value.toUpperCase()
                                }
                            })}
                            error={!!errors.name}
                            helperText={errors.name}
                            required
                            fullWidth

                        />
                    </Grid>

                    <Grid size={12}>
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "space-around",
                            }}
                        >

                            <Typography variant="h6">Upload Cover Image
                                {errors.cover !== "" && <Typography sx={{ color: "red", fontSize: "12px" }}>{errors.cover}</Typography>}

                            </Typography>

                            <ImageUpload
                                InitialImage={categoryInfo.cover!==""?categoryInfo.cover : null}
                                width="250px"  // Custom width
                                height="250px" // Custom height
                                handleImageSet={(value) => handleImageSet(value, 0)}
                                index={0}
                            />
                        </Box>
                    </Grid>

                    <Grid size={12} textAlign={'end'}>
                        <AddEditButton title={edit ? "Update" : "Add"} handleOnClick={() => setSuccessDialogOpen(true)} idDisabled={loading} />
                    </Grid>

                </Grid>

            </Paper>
            <ConfirmationModal
                open={successDialogOpen}
                handleOnClose={handleCloseDialog}
                handleOnConfirm={handleSubmit}
                heading={edit ? "Update Category" : "Add Category"}
                text={"Please confirm your action"}
            />
        </Container>
    )
}

export default CategoryManage
