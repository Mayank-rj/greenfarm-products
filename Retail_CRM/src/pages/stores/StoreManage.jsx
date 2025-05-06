import React, { useEffect, useState } from 'react'
import { validateStore } from '../../schemas/StoreSchema.js';
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

const StoreManage = ({ edit, heading }) => {

    const initialValues = {
        name: "",
        mobile: "",
        abn: "",
        lat: 0,
        lng: 0,
        address: "",
        description: "",
        cover: "",
        status: "active",
        commission: "",
        open_time: "",
        close_time: "",
        isClosed: false,
        certificate_url: "NA",
        certificate_type: "NA",
        rating: 0,
        city: ""
    }

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [storeInfo, setStoreInfo] = useState(initialValues);
    const [errors, setErrors] = useState(initialValues);
    const [loading, setLoading] = useState(false);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [citiesData, setCitiesData] = useState([]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateStore(storeInfo, setErrors)) {
            try {
                let apiPromise;
                if (edit) {
                    apiPromise = postApi('/store/update', storeInfo);
                    toast.promise(
                        apiPromise,
                        {
                            pending: 'Store updating...',
                            success: 'Store updated Successfully!',
                            error: {
                                render({ data }) {
                                    // Extract and return the error message
                                    return data?.response?.data?.message || 'Store updating Failed!';
                                },
                            },
                        }
                    );
                } else {
                    apiPromise = postApi('/store/add', storeInfo);
                    toast.promise(
                        apiPromise,
                        {
                            pending: 'Adding Store...',
                            success: 'Store added Successfully!',
                            error: {
                                render({ data }) {
                                    // Extract and return the error message
                                    return data?.response?.data?.message || 'Store adding Failed!';
                                },
                            },
                        }
                    );
                }

                setLoading(true);
                const data = await apiPromise;
                if (data.success) {
                    setStoreInfo(initialValues);
                    navigate(-1);
                } else {
                    errorHandler(null, data.message)
                }
            } catch (error) {
                // errorHandler(error, error.response.data.message);
                console.error(error.message);
            } finally {
                setLoading(false)
            }
        } else {
            handleCloseDialog();
        }


    };
    const handleOnChange = (e) => {
        setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" })
    }
    const handleImageSet = (value, index) => {
        if (index === 0) {
            setStoreInfo({ ...storeInfo, cover: value });
        } else {
            setStoreInfo(prev => {
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
        fetchData(() => getApi('/city'), setCitiesData, "Unable to fetch city", "Fetching city");

    }, []);
    useEffect(() => {
        if (edit) {
            const paramValue = queryParams.get("id");
            fetchData(() => getApi(`/store?id=${paramValue}`), setStoreInfo, "Unable to fetch store", "Fetching store");
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
                            label="Store Name"
                            name='name'
                            variant="outlined"
                            onChange={handleOnChange}
                            value={storeInfo.name}
                            error={!!errors.name}
                            helperText={errors.name}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            label="Address"
                            name='address'
                            variant="outlined"
                            onChange={handleOnChange}
                            value={storeInfo.address}
                            error={!!errors.address}
                            helperText={errors.address}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <TextField
                            label="Opening Time"
                            name='open_time'
                            type="time"
                            variant="outlined"
                            onChange={handleOnChange}
                            value={storeInfo.open_time}
                            error={!!errors.open_time}
                            helperText={errors.open_time}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <TextField
                            label="Closing Time"
                            name='close_time'
                            type="time"
                            variant="outlined"
                            onChange={handleOnChange}
                            value={storeInfo.close_time}
                            error={!!errors.close_time}
                            helperText={errors.close_time}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <TextField
                            label="Commision"
                            name='commission'
                            variant="outlined"
                            onChange={handleOnChange}
                            value={storeInfo.commission}
                            error={!!errors.commission}
                            helperText={errors.commission}
                            type='number'
                            inputMode='numeric'
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <TextField
                            label="Mobile"
                            name='mobile'
                            variant="outlined"
                            onChange={handleOnChange}
                            value={storeInfo.mobile}
                            error={!!errors.mobile}
                            helperText={errors.mobile}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            label="Description"
                            name='description'
                            value={storeInfo.description || ''}
                            error={!!errors.description}
                            helperText={errors.description}
                            onChange={handleOnChange}
                            variant="outlined"
                            inputMode='numeric'
                            fullWidth
                            multiline rows={5} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <TextField
                            label="ABN"
                            name='abn'
                            variant="outlined"
                            onChange={handleOnChange}
                            value={storeInfo.abn}
                            error={!!errors.abn}
                            helperText={errors.abn}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 12, md: 6 }} >
                        <TextField
                            select
                            label="Select City"
                            name='city'
                            value={storeInfo.city}  // This should be the selected store_id
                            onChange={handleOnChange}
                            variant="outlined"
                            error={!!errors.city}
                            helperText={errors.city}
                            fullWidth
                            required
                        >
                            <MenuItem value={""}>
                                Select City
                            </MenuItem>
                            {citiesData.map((city) => (
                                <MenuItem key={city._id} value={city._id}>
                                    {city.name}
                                </MenuItem>
                            ))}
                        </TextField>
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
                                InitialImage={storeInfo.cover !== "" ? storeInfo.cover : null}
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
                heading={edit ? "Update Store" : "Add Store"}
                text={"Please confirm your action"}
            />
        </Container>
    )
}

export default StoreManage
