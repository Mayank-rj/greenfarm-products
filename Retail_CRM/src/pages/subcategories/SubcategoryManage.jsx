import React, { useEffect, useState } from 'react'
import { validateSubcategory } from '../../schemas/SubcategorySchema.js';
import { Container, Typography, Grid2 as Grid, TextField, Paper, Box, MenuItem } from '@mui/material';
import BackButton from '../../components/buttons/BackButton.jsx';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../components/modals/ConfirmationModal.jsx';
import fetchData from '../../api/fetchData.js';
import { useLocation, useNavigate } from 'react-router';
import ImageUpload from '../../components/imageUpload/ImageUpload.jsx';
import errorHandler from '../../api/errorHandler.js';
import AddEditButton from '../../components/buttons/AddEditButton.jsx';
import getApi from '../../api/getApi.js';
import postApi from '../../api/postApi.js';

const SubcategoryManage = ({ edit, heading }) => {

    const initialValues = {
        name: "",
        cover: "",
        store: "",
        status: "active",
        category: "",
    }

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [subcategoryInfo, setSubcategoryInfo] = useState(initialValues);
    const [errors, setErrors] = useState(initialValues);
    const [loading, setLoading] = useState(false);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [categoriesData, setCategoriesData] = useState([]);
    const [storesData, setStoresData] = useState([]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateSubcategory(subcategoryInfo, setErrors)) {
            try {
                let apiPromise;
                if (edit) {
                    apiPromise = postApi('/subcategory/update', subcategoryInfo);
                    toast.promise(
                        apiPromise,
                        {
                            pending: 'Subcategory updating...',
                            success: 'Subcategory updated Successfully!',
                            error: {
                                render({ data }) {
                                    // Extract and return the error message
                                    return data?.response?.data?.message || 'Subcategory updating Failed!';
                                },
                            },
                        }
                    );
                } else {
                    apiPromise = postApi('/subcategory/add', subcategoryInfo);
                    toast.promise(
                        apiPromise,
                        {
                            pending: 'Adding Subcategory...',
                            success: 'Subcategory added Successfully!',
                            error: {
                                render({ data }) {
                                    // Extract and return the error message
                                    return data?.response?.data?.message || 'Subcategory adding Failed!';
                                },
                            },
                        }
                    );
                }

                setLoading(true);
                const data = await apiPromise;
                if (data.success) {
                    setSubcategoryInfo(initialValues);
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
        setSubcategoryInfo({ ...subcategoryInfo, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" })
    }
    const handleImageSet = (value, index) => {
        if (index === 0) {
            setSubcategoryInfo({ ...subcategoryInfo, cover: value });
        } else {
            setSubcategoryInfo(prev => {
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
        fetchData(() => getApi('/store'), setStoresData, "Unable to fetch stores", "Fetching stores");
        fetchData(() => getApi('/category'), setCategoriesData, "Unable to fetch categories", "Fetching categories");
    }, []);
    useEffect(() => {
        if (edit) {
            const paramValue = queryParams.get("id");
            fetchData(() => getApi(`/subcategory?id=${paramValue}`), setSubcategoryInfo, "Unable to fetch subcategory", "Fetching subcategory");
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
                            select
                            name={"store"}
                            label={"Select Store"}
                            value={subcategoryInfo.store}
                            onChange={handleOnChange}
                            error={!!errors.store}
                            helperText={errors.store}
                            required
                            fullWidth
                        >
                            {storesData.map((item) => (
                                <MenuItem key={item._id} value={item._id}>
                                    {item["name"]}
                                </MenuItem>
                            ))}
                        </TextField>

                    </Grid>
                    <Grid size={12}>
                        <TextField
                            select
                            label="Select Category"
                            name='category'
                            value={subcategoryInfo.category}
                            error={!!errors.category}
                            helperText={errors.category}
                            onChange={handleOnChange}
                            variant="outlined"
                            fullWidth
                            required
                        >
                            {categoriesData.map((category, index) => (
                                <MenuItem key={index} value={category._id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            name={"name"}
                            label={"Name"}
                            value={subcategoryInfo.name}
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
                                InitialImage={subcategoryInfo.cover !== "" ? subcategoryInfo.cover : null}
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
                heading={edit ? "Update Subcategory" : "Add Subcategory"}
                text={"Please confirm your action"}
            />
        </Container>
    )
}

export default SubcategoryManage
