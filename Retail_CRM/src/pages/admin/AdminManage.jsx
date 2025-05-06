import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import errorHandler from '../../api/errorHandler';
import { countries } from 'countries-list';
import { Container, Typography, Grid2 as Grid, TextField, Paper, MenuItem, InputAdornment } from '@mui/material';
import BackButton from '../../components/buttons/BackButton';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import AddEditButton from '../../components/buttons/AddEditButton';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { validateAdmin } from '../../schemas/AdminSchema';
import fetchData from '../../api/fetchData';
import getApi from '../../api/getApi';
import postApi from '../../api/postApi';

const AdminManage = ({ edit, heading }) => {
  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    gender: "",
    mobile: "",
    type: "admin",
    status: "active",
    cover: "",
    country_code: ""
  }
  if (edit) {
    delete initialValues.password;
  }
  // Options for gender selection
  const genderOptions = [
    { id: "male", value: 'male' },
    { id: "female", value: 'female' },
    { id: "other", value: 'other' }
  ];

  const countryCodes = Object.keys(countries).filter(code => code !== 'HM' && code !== 'CX' && code !== 'CC').map((code) => ({
    code: code,
    phone: `+${countries[code].phone}`,
    label: `${countries[code].name} (+${countries[code].phone})`,
  }));
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [adminInfo, setAdminInfo] = useState(initialValues);
  const [errors, setErrors] = useState(initialValues);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  // Handle input changes in the form fields
  const handleOnChange = (e) => {
    setAdminInfo({ ...adminInfo, [e.target.name]: e.target.value });
  };
  // Handle form submission to add admin
  const handleUpload = async (e) => {
    e.preventDefault();
    if (validateAdmin(adminInfo, setErrors)) {
      try {
        let apiPromise;
        if (edit) {
          apiPromise = postApi('/user/update', adminInfo);
          toast.promise(
            apiPromise,
            {
              pending: 'Admin updating...',
              success: 'Admin updated Successfully!',
              error: {
                render({ data }) {
                  // Extract and return the error message
                  return data?.response?.data?.message || 'Admin updating Failed!';
                },
              },
            }
          );
        } else {
          apiPromise = postApi('/user/register', adminInfo);
          toast.promise(
            apiPromise,
            {
              pending: 'Registering Admin...',
              success: 'Admin added Successfully!',
              error: {
                render({ data }) {
                  // Extract and return the error message
                  return data?.response?.data?.message || 'Admin adding Failed!';
                },
              },
            }
          );
        }

        setLoading(true);
        const data = await apiPromise;
        if (data.success) {
          setAdminInfo(initialValues);
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

  useEffect(() => {
    if (edit) {
      const paramValue = queryParams.get("id");
      fetchData(() => getApi(`/user/adminuser?id=${paramValue}`), setAdminInfo, "Unable to fetch admin", "Fetching admin");
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
              value={adminInfo.first_name}
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
              value={adminInfo.last_name}
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
              value={adminInfo.email}
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
              value={adminInfo.password}
              error={!!errors.password}
              helperText={errors.password}
              onChange={handleOnChange}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end" onClick={handleClickShowPassword} sx={{ cursor: 'pointer' }}>
                    {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                  </InputAdornment>,
                }
              }}
              // InputProps={{
              //   endAdornment: (
              //     <InputAdornment position="end" onClick={handleClickShowPassword} sx={{ cursor: 'pointer' }}>
              //       {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
              //     </InputAdornment>
              //   )
              // }}
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
              value={adminInfo.country_code}
              error={!!errors.country_code}
              helperText={errors.country_code}
              onChange={handleOnChange}
              required
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
              variant="outlined"
              value={adminInfo.mobile}
              error={!!errors.mobile}
              helperText={errors.mobile}
              onChange={handleOnChange}
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              select
              label="Gender"
              name='gender'
              variant="outlined"
              value={adminInfo.gender}
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
          <Grid size={12} textAlign={'end'}>
            <AddEditButton title={edit ? "Update" : "Add"} handleOnClick={() => setSuccessDialogOpen(true)} idDisabled={loading} />
          </Grid>
        </Grid>

      </Paper>
      <ConfirmationModal
        open={successDialogOpen}
        handleOnClose={handleCloseDialog}
        handleOnConfirm={handleUpload}
        heading={edit ? "Update Admin" : "Add Admin"}
        text={"Please confirm your action"}
      />
    </Container>
  )
}

export default AdminManage
