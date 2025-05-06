import React, { useEffect, useState } from 'react'
import { validateBanner } from '../../schemas/BannerSchema.js';
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

const BannerManage = ({ edit, heading }) => {

    const initialValues = {
        type: "",
        link: "",
        cover: "",
        position: "",
        message: "",
        store: "",
        page: "",
        status: "active",
    }
    const typeOptions = [
        { id: "category", value: "category", label: "Category" },
        { id: "product", value: "product", label: "Product" },
        { id: "external", value: "external", label: "External Link" },
    ];
    const positionOptions = [
        { id: "top", label: 'Top', value: 'top' },
        { id: "bottom", label: 'Bottom', value: 'bottom' },
        { id: "between", label: 'Between', value: 'between' }
    ];
    const pageOptions = [
        { id: "home", label: 'Home', value: 'home' },
        { id: "catalogue", label: 'Catalogue', value: 'catalogue' },
        // { id: "product", label: 'Product', value: 'product' }
    ];

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [bannerInfo, setBannerInfo] = useState(initialValues);
    const [errors, setErrors] = useState(initialValues);
    const [loading, setLoading] = useState(false);
    const [storesData, setStoresData] = useState([]);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateBanner(bannerInfo, setErrors)) {
            try {
                let apiPromise;
                if (edit) {
                    apiPromise = postApi('/banner/update', bannerInfo);
                    toast.promise(
                        apiPromise,
                        {
                            pending: 'Banner updating...',
                            success: 'Banner updated Successfully!',
                            error: {
                                render({ data }) {
                                    // Extract and return the error message
                                    return data?.response?.data?.message || 'Banner updating Failed!';
                                },
                            },
                        }
                    );
                } else {
                    apiPromise = postApi('/banner/add', bannerInfo);
                    toast.promise(
                        apiPromise,
                        {
                            pending: 'Adding Banner...',
                            success: 'Banner added Successfully!',
                            error: {
                                render({ data }) {
                                    // Extract and return the error message
                                    return data?.response?.data?.message || 'Banner adding Failed!';
                                },
                            },
                        }
                    );
                }

                setLoading(true);
                const data = await apiPromise;
                if (data.success) {
                    setBannerInfo(initialValues);
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
        setBannerInfo({ ...bannerInfo, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" })
    }
    const handleImageSet = (value, index) => {
        if (index === 0) {
            setBannerInfo({ ...bannerInfo, cover: value });
        } else {
            setBannerInfo(prev => {
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
    }, []);
    useEffect(() => {
        if (edit) {
            const paramValue = queryParams.get("id");
            fetchData(() => getApi(`/banner?id=${paramValue}`), setBannerInfo, "Unable to fetch banner", "Fetching banner");
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
                            value={bannerInfo.store}
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
                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <TextField
                            select
                            name="type"
                            label="Select Type"
                            variant="outlined"
                            fullWidth
                            value={bannerInfo?.type}
                            error={!!errors.type}
                            helperText={errors.type}
                            onChange={handleOnChange}
                            required
                        >
                            {typeOptions.map((option) => (
                                <MenuItem key={option.id} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <TextField
                            select
                            name="position"
                            label=" select Position"
                            variant="outlined"
                            fullWidth
                            value={bannerInfo?.position}
                            error={!!errors.position}
                            helperText={errors.position}
                            onChange={handleOnChange}
                            required
                            disabled={!bannerInfo.page}
                        >
                            {bannerInfo.page === "catalogue" ? (
                                <MenuItem value="top">Top</MenuItem> 
                            ) : (
                                positionOptions.map((option) => (
                                    <MenuItem key={option.id} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))
                            )}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <TextField
                            select
                            name="page"
                            label=" select Page"
                            variant="outlined"
                            fullWidth
                            value={bannerInfo?.page}
                            error={!!errors.page}
                            helperText={errors.page}
                            onChange={handleOnChange}
                            required
                        >
                            {pageOptions.map((option) => (
                                <MenuItem key={option.id} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            label="Message"
                            name="message"
                            error={!!errors.message}
                            helperText={errors.message}
                            fullWidth
                            variant="outlined"
                            onChange={handleOnChange}
                            value={bannerInfo.message}
                            required
                        />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            label="Link"
                            name="link"
                            fullWidth
                            variant="outlined"
                            onChange={handleOnChange}
                            value={bannerInfo.link}
                            error={!!errors.link}
                            helperText={errors.link}
                            required
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

                            <Typography variant="h6">Upload Image
                                {errors.cover !== "" && <Typography sx={{ color: "red", fontSize: "12px" }}>{errors.cover}</Typography>}

                            </Typography>

                            <ImageUpload
                                InitialImage={bannerInfo.cover !== "" ? bannerInfo.cover : null}
                                width="100%"  // Custom width
                                height="400px" // Custom height
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
                heading={edit ? "Update Banner" : "Add Banner"}
                text={"Please confirm your action"}
            />
        </Container>
    )
}

export default BannerManage
