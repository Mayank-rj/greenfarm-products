import React, { useEffect, useState } from 'react'
import { validatePolicyPage } from '../../schemas/PolicyPageSchema.js';
import { Container, Typography, Grid2 as Grid, TextField, Paper, Box } from '@mui/material';
import BackButton from '../../components/buttons/BackButton.jsx';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../components/modals/ConfirmationModal.jsx';
import fetchData from '../../api/fetchData.js';
import { useLocation, useNavigate } from 'react-router';
import errorHandler from '../../api/errorHandler.js';
import AddEditButton from '../../components/buttons/AddEditButton.jsx';
import getApi from '../../api/getApi.js';
import postApi from '../../api/postApi.js';
import QuillEditor from '../../components/quillEditor/QuillEditor.jsx';

const PolicyPageManage = ({ edit, heading }) => {

    const initialValues = {
        title: "",
        content: "",
        status: "active",
    }

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [policyPageInfo, setPolicyPageInfo] = useState(initialValues);
    const [errors, setErrors] = useState(initialValues);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState(policyPageInfo.content || '');
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validatePolicyPage(policyPageInfo, setErrors)) {
            const updatedData = {...policyPageInfo,content:value}
            try {
                let apiPromise;
                if (edit) {
                    apiPromise = postApi('/policyPage/update', updatedData);
                    toast.promise(
                        apiPromise,
                        {
                            pending: 'PolicyPage updating...',
                            success: 'PolicyPage updated Successfully!',
                            error: {
                                render({ data }) {
                                    // Extract and return the error message
                                    return data?.response?.data?.message || 'PolicyPage updating Failed!';
                                },
                            },
                        }
                    );
                } else {
                    apiPromise = postApi('/policyPage/add', updatedData);
                    toast.promise(
                        apiPromise,
                        {
                            pending: 'Adding PolicyPage...',
                            success: 'PolicyPage added Successfully!',
                            error: {
                                render({ data }) {
                                    // Extract and return the error message
                                    return data?.response?.data?.message || 'PolicyPage adding Failed!';
                                },
                            },
                        }
                    );
                }

                setLoading(true);
                const data = await apiPromise;
                if (data.success) {
                    setPolicyPageInfo(initialValues);
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
        setPolicyPageInfo({ ...policyPageInfo, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" })
    }

    const handleCloseDialog = () => {
        setSuccessDialogOpen(false);
    };

    useEffect(() => {
        if (edit) {
            const paramValue = queryParams.get("id");
            fetchData(() => getApi(`/policypage?id=${paramValue}`), setPolicyPageInfo, "Unable to fetch policy page", "Fetching policy page");
        }
    }, [])
    // useEffect(() => {
    //     handleOnChange({target:{name:"content",value:value}})
    // }, [value])

    return (
        <Container>
            <BackButton handleOnClick={() => navigate(-1)} />
            <Typography variant='h4' fontWeight="bold" sx={{ textAlign: "center", color: "#1976d2" }} >{heading}</Typography>
            <Paper sx={{ padding: 3, marginBottom: { xs: 10, sm: 10, md: 5 } }} >
                <Grid container spacing={2}>

                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                        <TextField
                            name={"title"}
                            label={"Title"}
                            value={policyPageInfo.title}
                            onChange={handleOnChange}
                            error={!!errors.title}
                            helperText={errors.title}
                            required
                            fullWidth

                        />
                    </Grid>
                    <Grid size={12}>
                        <QuillEditor value={policyPageInfo.content} setEditorContent={setValue}/>
         
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
                heading={edit ? "Update Policy Page" : "Add Policy Page"}
                text={"Please confirm your action"}
            />
        </Container>
    )
}

export default PolicyPageManage
