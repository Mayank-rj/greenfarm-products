import React, { useEffect, useState } from 'react'
import { Container, Typography, Grid2 as Grid, TextField, Paper, Box, MenuItem, IconButton, Chip, } from '@mui/material';
import BackButton from '../../components/buttons/BackButton';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import fetchData from '../../api/fetchData';
import { useNavigate } from 'react-router';
import errorHandler from '../../api/errorHandler';
import AddEditButton from '../../components/buttons/AddEditButton';
import getApi from '../../api/getApi.js';
import postApi from '../../api/postApi.js';
import { TiDeleteOutline } from 'react-icons/ti';
import { validateSubMenu } from '../../schemas/subMenuSchema.js';

const ManageSubMenu = ({ edit, heading }) => {

    const initialValues = {
        store: "",
        subMenu: [],
    }

    const navigate = useNavigate();

    const [subMenuInfo, setSubMenuInfo] = useState(initialValues);
    const [errors, setErrors] = useState(initialValues);
    const [loading, setLoading] = useState(false);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [storesData, setStoresData] = useState([]);
    const [categoriesData, setCategoriesData] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...subMenuInfo, subMenu: selectedCategories };
   
        if (validateSubMenu(payload, setErrors)) {
            try {
                let apiPromise;
                if (edit) {
                    apiPromise = postApi('/submenu/update', payload);
                    toast.promise(
                        apiPromise,
                        {
                            pending: 'Submenu updating...',
                            success: 'Submenu updated Successfully!',
                            error: {
                                render({ data }) {
                                    // Extract and return the error message
                                    return data?.response?.data?.message || 'SubMenu updating Failed!';
                                },
                            },
                        }
                    );
                }

                setLoading(true);
                const data = await apiPromise;
                if (data.success) {
                    // setSubMenuInfo(initialValues);
                    // navigate(-1);
                    handleCloseDialog();
                } else {
                    errorHandler(null, data.message)
                }
            } catch (error) {
                errorHandler(error, error.response.data.message);
            } finally {
                setLoading(false)
            }
        }

    };
    const handleOnChange = (e) => {
        setSubMenuInfo({ ...subMenuInfo, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" })
    }

    const handleCloseDialog = () => {
        setSuccessDialogOpen(false);
    };
    const handleDeleteCategory = (id) => {
        setSelectedCategories(selectedCategories.filter(item => item !== id))
    }
    const handleOnCategoryChange = (e) => {
        if (selectedCategories.length > 4) {
            return;
        }
        const { value } = e.target;
        setSelectedCategories(value);
    }
    useEffect(() => {
        fetchData(() => getApi('/store'), setStoresData, "Unable to fetch stores", "Fetching stores");
        fetchData(() => getApi('/category'), setCategoriesData, "Unable to fetch categories", "Fetching categories");
    }, []);


    useEffect(() => {
        const fetchSubMenuByStore  = async ()=>{
            const apiPromise = postApi('/submenu/bystore', {store:subMenuInfo.store});
            toast.promise(
                apiPromise,
                {
                    pending: 'Getting Sub Menu',
                    error: {
                        render({ data }) {
                            // Extract and return the error message
                            return data?.response?.data?.message || 'SubMenu fetching Failed!';
                        },
                    },
                }
            );
            setLoading(true);
            const data = await apiPromise;
            if(data.success){
                if(data.data){

                    setSubMenuInfo(data.data);
                    setSelectedCategories(data.data.subMenu)
                }else{

                    setSubMenuInfo({store:subMenuInfo.store,subMenu:[]});
                    setSelectedCategories([])
                }
            }
            setLoading(false)
        }
        if (edit && subMenuInfo.store !== "") {
            fetchSubMenuByStore();
        }
    }, [subMenuInfo.store])
    // console.log(subMenuInfo);
    

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
                            value={subMenuInfo.store}
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
                            name={"subMenu"}
                            label={"Select Category"}
                            value={selectedCategories}
                            onChange={handleOnCategoryChange}
                            fullWidth
                            disabled={subMenuInfo.store===""}
                            slotProps={{
                                select: {
                                    multiple: true,

                                }
                            }}

                        >
                            {categoriesData.map((item) => (
                                <MenuItem key={item._id} value={item._id}>
                                    {item["name"]}
                                </MenuItem>
                            ))}
                        </TextField>

                    </Grid>
                    {selectedCategories?.length > 0 && (
                        <Grid size={12}>
                            <Typography variant="h6" gutterBottom>
                                Selected Categories:
                            </Typography>
                            <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {selectedCategories.map(id => {
                                    const category = categoriesData.find(category => category._id === id);
                                    return (
                                        category && (
                                            <Chip
                                                key={category._id}
                                                label={category.name}
                                                variant="outlined"
                                                color="primary"
                                                size="medium"
                                                onDelete={() => handleDeleteCategory(category._id)} // Implement this function to handle deletion
                                                deleteIcon={<TiDeleteOutline />}

                                            />
                                        )
                                    );
                                })}
                            </Box>
                        </Grid>
                    )}

                    <Grid size={12} textAlign={'end'}>
                        <AddEditButton title={edit ? "Update" : "Add"} handleOnClick={() => setSuccessDialogOpen(true)} idDisabled={loading} />
                    </Grid>

                </Grid>

            </Paper>
            <ConfirmationModal
                open={successDialogOpen}
                handleOnClose={handleCloseDialog}
                handleOnConfirm={handleSubmit}
                heading={edit ? "Update SubMenu" : "Add SubMenu"}
                text={"Please confirm your action"}
            />
        </Container>
    )
}

export default ManageSubMenu
