import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import errorHandler from '../../api/errorHandler';
import { countries } from 'countries-list';
import { Container, Typography, Grid2 as Grid, TextField, Paper, MenuItem, Box, InputAdornment } from '@mui/material';
import BackButton from '../../components/buttons/BackButton';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import AddEditButton from '../../components/buttons/AddEditButton';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { validateDriver } from '../../schemas/DriverSchema';
import fetchData from '../../api/fetchData';
import ImageUpload from '../../components/imageUpload/ImageUpload';
import postApi from '../../api/postApi';
import getApi from '../../api/getApi';

const DriverManage = ({ edit, heading }) => {
    const initialValues = {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        gender: "",
        city: "",
        address: "",
        mobile: "",
        status: "active",
        cover: "",
        current_status: "",
        others: "",
        country_code: ""
    }
    if(edit){
        delete initialValues.password;
    }
    // Options for gender selection
    const genderOptions = [
        { id: "male", value: 'male' },
        { id: "female", value: 'female' },
        { id: "other", value: 'other' }
    ];
    const currentStatusOptions = [
        { id: "available", label: "Available", value: 'available' },
        { id: "unavailable", label: "Unavailable", value: 'unavailable' }
    ]
    const countryCodes = Object.keys(countries).filter(code => code !== 'HM' && code !== 'CX' && code !== 'CC').map((code) => ({
        code: code,
        phone: `+${countries[code].phone}`,
        label: `${countries[code].name} (+${countries[code].phone})`,
    }));
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [driverInfo, setDriverInfo] = useState(initialValues);
    const [errors, setErrors] = useState(initialValues);
    const [citiesData, setCitiesData] = useState([]);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    // Handle input changes in the form fields
    const handleOnChange = (e) => {
        setDriverInfo({ ...driverInfo, [e.target.name]: e.target.value });
    };
    // Handle form submission to add driver
    const handleUpload = async (e) => {
        e.preventDefault();
        if (validateDriver(driverInfo, setErrors)) {
            try {
                let apiPromise;
                if (edit) {
                    apiPromise = postApi('/driver/update', driverInfo);
                    toast.promise(
                        apiPromise,
                        {
                            pending: 'Driver updating...',
                            success: 'Driver updated Successfully!',
                            error: {
                                render({ data }) {
                                    // Extract and return the error message
                                    return data?.response?.data?.message || 'Driver updating Failed!';
                                },
                            },
                        }
                    );
                } else {
                    apiPromise = postApi('/driver/add', driverInfo);
                    toast.promise(
                        apiPromise,
                        {
                            pending: 'Adding Driver...',
                            success: 'Driver added Successfully!',
                            error: {
                                render({ data }) {
                                    // Extract and return the error message
                                    return data?.response?.data?.message || 'Driver adding Failed!';
                                },
                            },
                        }
                    );
                }

                setLoading(true);
                const data = await apiPromise;
                if (data.success) {
                    setDriverInfo(initialValues);
                    navigate(-1);
                } else {
                    errorHandler(null, data.message)
                }
            } catch (error) {
                console.error(error.message);
                // errorHandler(error, error.response.data.message);
            } finally {
                setLoading(false);
                handleCloseDialog();
            }
        } else {
            handleCloseDialog();
        }
    }

    const handleCloseDialog = () => {
        setSuccessDialogOpen(false);
    };
    const handleImageSet = (value, index) => {
        if (index === 0) {
            setDriverInfo({ ...driverInfo, cover: value });
        } else {
            setDriverInfo(prev => {
                const newImgs = prev.images;
                newImgs[index] = value;
                return { ...prev, images: newImgs };
            })
        }

    }
    useEffect(() => {
        fetchData(() => getApi('/city'), setCitiesData, "Unable to fetch city", "Fetching city");

    }, []);
    useEffect(() => {
        if (edit) {
            const paramValue = queryParams.get("id");
            fetchData(() => getApi(`/driver?id=${paramValue}`), setDriverInfo, "Unable to fetch driver", "Fetching driver");
        }
    }, [])
    return (
        <Container>
            <BackButton handleOnClick={() => navigate(-1)} />
            <Typography variant='h4' fontWeight="bold" sx={{ textAlign: "center", color: "#1976d2" }} >{heading}</Typography>
            <Paper sx={{ padding: 3, marginBottom: { xs: 10, sm: 10, md: 5 } }} >
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <TextField
                            label="First Name"
                            name='first_name'
                            variant="outlined"
                            onChange={handleOnChange}
                            value={driverInfo.first_name}
                            error={!!errors.first_name}
                            helperText={errors.first_name}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <TextField
                            label="Last Name"
                            name='last_name'
                            variant="outlined"
                            onChange={handleOnChange}
                            value={driverInfo.last_name}
                            error={!!errors.last_name}
                            helperText={errors.last_name}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <TextField
                            label="Email"
                            name='email'
                            variant="outlined"
                            onChange={handleOnChange}
                            value={driverInfo.email}
                            error={!!errors.email}
                            helperText={errors.email}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={{ display: edit ? 'none' : 'block' }}>
                        <TextField
                            required
                            label="Password"
                            name='password'
                            type={showPassword ? "text" : "password"}
                            variant="outlined"
                            value={driverInfo.password}
                            error={!!errors.password}
                            helperText={errors.password}
                            onChange={handleOnChange}

                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" onClick={handleClickShowPassword} sx={{ cursor: 'pointer' }}>
                                        {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                                    </InputAdornment>
                                )
                            }}
                            fullWidth
                        // autoComplete="new-password"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <TextField
                            select
                            fullWidth
                            id="countrycode"
                            label="Country Code"
                            name="country_code"
                            value={driverInfo.country_code}
                            error={!!errors.country_code}
                            helperText={errors.country_code}
                            required
                            onChange={handleOnChange}
                        >
                            {countryCodes.map((option) => (
                                <MenuItem key={option.code} value={option.phone}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <TextField
                            label="Contact No"
                            name='mobile'
                            type='number'
                            variant="outlined"
                            value={driverInfo.mobile}
                            error={!!errors.mobile}
                            helperText={errors.mobile}
                            onChange={handleOnChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <TextField
                            label="Address"
                            name='address'
                            variant="outlined"
                            onChange={handleOnChange}
                            value={driverInfo.address}
                            error={!!errors.address}
                            helperText={errors.address}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 6 }} >
                        <TextField
                            select
                            label="Select City"
                            name='city'
                            value={driverInfo.city}
                            onChange={handleOnChange}
                            variant="outlined"
                            error={!!errors.city}
                            helperText={errors.city}
                            fullWidth
                            required
                        >

                            {citiesData.map((city) => (
                                <MenuItem key={city._id} value={city._id}>
                                    {city.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <TextField
                            select
                            label="Gender"
                            name='gender'
                            variant="outlined"
                            value={driverInfo.gender}
                            error={!!errors.gender}
                            helperText={errors.gender}
                            onChange={handleOnChange}
                            fullWidth
                            required
                        >
                            {genderOptions.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.value}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <TextField
                            select
                            label="Current Status"
                            name='current_status'
                            variant="outlined"
                            value={driverInfo.current_status}
                            error={!!errors.current_status}
                            helperText={errors.current_status}
                            onChange={handleOnChange}
                            fullWidth
                            required
                        >
                            {currentStatusOptions.map((option) => (
                                <MenuItem key={option.id} value={option.value}>
                                    {option.label}
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
                                InitialImage={driverInfo.cover !== "" ? driverInfo.cover : null}
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
                handleOnConfirm={handleUpload}
                heading={edit ? "Update Driver" : "Add Driver"}
                text={"Please confirm your action"}
            />
        </Container>
    )
}

export default DriverManage
