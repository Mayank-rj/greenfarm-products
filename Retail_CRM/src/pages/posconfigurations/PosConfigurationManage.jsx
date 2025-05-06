import React, { useEffect, useState } from "react";
import { validatePosConfiguration } from "../../schemas/PosConfigurationSchema.js";
import {
  Container,
  Typography,
  Grid2 as Grid,
  TextField,
  Paper,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import BackButton from "../../components/buttons/BackButton.jsx";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/modals/ConfirmationModal.jsx";
import fetchData from "../../api/fetchData.js";
import { useLocation, useNavigate } from "react-router";
import errorHandler from "../../api/errorHandler.js";
import AddEditButton from "../../components/buttons/AddEditButton.jsx";
import getApi from "../../api/getApi.js";
import postApi from "../../api/postApi.js";

const PosConfigurationManage = ({ edit, heading }) => {
  const initialValues = {
    store_ip: "",
    mac_address: "",
    weight_scale_port: "",
    store: "",
    boud_rate: "",
    data_bits: "",
    parity: "",
    stop_bits: "",
    flow_type: "",
    printer_ip: "",
    printer_port: "",
    surcharge: "",
    status: "active",
    pos_name: "",
    pin: "",
  };

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [posConfigurationInfo, setPosConfigurationInfo] =
    useState(initialValues);
  const [errors, setErrors] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [storesData, setStoresData] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validatePosConfiguration(posConfigurationInfo, setErrors)) {
      try {
        let apiPromise;
        if (edit) {
          apiPromise = postApi(
            "/posConfiguration/update",
            posConfigurationInfo
          );
          toast.promise(apiPromise, {
            pending: "PosConfiguration updating...",
            success: "PosConfiguration updated Successfully!",
            error: {
              render({ data }) {
                // Extract and return the error message
                return (
                  data?.response?.data?.message ||
                  "PosConfiguration updating Failed!"
                );
              },
            },
          });
        } else {
          apiPromise = postApi("/posConfiguration/add", posConfigurationInfo);
          toast.promise(apiPromise, {
            pending: "Adding PosConfiguration...",
            success: "PosConfiguration added Successfully!",
            error: {
              render({ data }) {
                // Extract and return the error message
                return (
                  data?.response?.data?.message ||
                  "PosConfiguration adding Failed!"
                );
              },
            },
          });
        }

        setLoading(true);
        const data = await apiPromise;
        if (data.success) {
          setPosConfigurationInfo(initialValues);
          navigate(-1);
        } else {
          errorHandler(null, data.message);
        }
      } catch (error) {
        console.error(error.message);
        // errorHandler(error, error.response.data.message);
      } finally {
        setLoading(false);
      }
    } else {
      handleCloseDialog();
    }
  };
  const handleOnChange = (e) => {
    // console.log(e);

    setPosConfigurationInfo({
      ...posConfigurationInfo,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleCloseDialog = () => {
    setSuccessDialogOpen(false);
  };
  useEffect(() => {
    fetchData(
      () => getApi("/store"),
      setStoresData,
      "Unable to fetch stores",
      "Fetching stores"
    );
  }, []);
  useEffect(() => {
    if (edit) {
      const paramValue = queryParams.get("id");
      fetchData(
        () => getApi(`/posConfiguration?id=${paramValue}`),
        setPosConfigurationInfo,
        "Unable to fetch posConfiguration",
        "Fetching posConfiguration"
      );
    }
  }, []);

  return (
    <Container>
      <BackButton handleOnClick={() => navigate(-1)} />
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ textAlign: "center", color: "#1976d2" }}
      >
        {heading}
      </Typography>
      <Paper sx={{ padding: 3, marginBottom: { xs: 10, sm: 10, md: 5 } }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              label="POS Name"
              name="pos_name"
              fullWidth
              variant="outlined"
              onChange={handleOnChange}
              value={posConfigurationInfo.pos_name}
              required
              error={!!errors.pos_name}
              helperText={errors.pos_name}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              label="MAC Address"
              name="mac_address"
              fullWidth
              variant="outlined"
              onChange={handleOnChange}
              value={posConfigurationInfo.mac_address}
              required
              error={!!errors.mac_address}
              helperText={errors.mac_address}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              select
              name={"store"}
              label={"Select Store"}
              value={posConfigurationInfo.store}
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
              label="Store IP"
              name="store_ip"
              variant="outlined"
              fullWidth
              onChange={handleOnChange}
              value={posConfigurationInfo.store_ip}
              required
              error={!!errors.store_ip}
              helperText={errors.store_ip}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              label="Pin"
              name="pin"
              variant="outlined"
              fullWidth
              onChange={handleOnChange}
              value={posConfigurationInfo.pin}
              required
              error={!!errors.pin}
              helperText={errors.pin}
              type="text"
              inputProps={{
                maxLength: 4,
                pattern: "[0-9]*",
              }}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              label="Weight Scale Port"
              name="weight_scale_port"
              variant="outlined"
              fullWidth
              onChange={handleOnChange}
              value={posConfigurationInfo.weight_scale_port}
              required
              error={!!errors.weight_scale_port}
              helperText={errors.weight_scale_port}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              label="Boud Rate"
              name="boud_rate"
              variant="outlined"
              fullWidth
              onChange={(e) => {
                const rawValue = e.target.value;
                if (rawValue === "") {
                  handleOnChange({
                    target: { name: e.target.name, value: rawValue },
                  });
                } else {
                  // Only accept integers (ignore any non-integer characters)
                  const integerValue = parseInt(rawValue, 10);

                  // If the input is not a valid integer or is out of the range 0-100, ignore it
                  if (!isNaN(integerValue) && integerValue >= 0) {
                    handleOnChange({
                      target: { name: e.target.name, value: integerValue },
                    });
                  }
                }
              }}
              value={posConfigurationInfo.boud_rate}
              required
              error={!!errors.boud_rate}
              helperText={errors.boud_rate}
              inputMode="numeric"
              // type='number'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              label="Data Bits"
              name="data_bits"
              variant="outlined"
              fullWidth
              onChange={(e) => {
                const rawValue = e.target.value;
                if (rawValue === "") {
                  handleOnChange({
                    target: { name: e.target.name, value: rawValue },
                  });
                } else {
                  // Only accept integers (ignore any non-integer characters)
                  const integerValue = parseInt(rawValue, 10);

                  // If the input is not a valid integer or is out of the range 0-100, ignore it
                  if (!isNaN(integerValue) && integerValue >= 0) {
                    handleOnChange({
                      target: { name: e.target.name, value: integerValue },
                    });
                  }
                }
              }}
              value={posConfigurationInfo.data_bits}
              inputMode="numeric"
              // type='number'
              required
              error={!!errors.data_bits}
              helperText={errors.data_bits}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              select
              name={"parity"}
              label={"Select Parity"}
              value={posConfigurationInfo.parity}
              onChange={handleOnChange}
              error={!!errors.parity}
              helperText={errors.parity}
              required
              fullWidth
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="odd">Odd</MenuItem>
              <MenuItem value="even">Even</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              label="Stop Bits"
              name="stop_bits"
              variant="outlined"
              fullWidth
              onChange={handleOnChange}
              value={posConfigurationInfo.stop_bits}
              inputMode="numeric"
              type="number"
              required
              error={!!errors.stop_bits}
              helperText={errors.stop_bits}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              select
              name={"flow_type"}
              label={"Select Flow Type"}
              value={posConfigurationInfo.flow_type}
              onChange={handleOnChange}
              error={!!errors.flow_type}
              helperText={errors.flow_type}
              required
              fullWidth
            >
              <MenuItem value={"true"}>True</MenuItem>
              <MenuItem value={"false"}>False</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              label="Printer IP"
              name="printer_ip"
              variant="outlined"
              fullWidth
              onChange={handleOnChange}
              value={posConfigurationInfo.printer_ip}
              required
              error={!!errors.printer_ip}
              helperText={errors.printer_ip}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              label="Printer Port"
              name="printer_port"
              variant="outlined"
              fullWidth
              onChange={handleOnChange}
              value={posConfigurationInfo.printer_port}
              required
              error={!!errors.printer_port}
              helperText={errors.printer_port}
              inputMode="numeric"
              type="number"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              label="Surcharge"
              name="surcharge"
              variant="outlined"
              fullWidth
              onChange={(e) => {
                const rawValue = e.target.value;
                if (rawValue === "") {
                  handleOnChange({
                    target: { name: e.target.name, value: rawValue },
                  });
                } else {
                  const regex = /^\d+(\.\d{0,2})?$/;
                  if (
                    !isNaN(rawValue) &&
                    rawValue >= 0 &&
                    regex.test(rawValue)
                  ) {
                    handleOnChange({
                      target: { name: e.target.name, value: rawValue },
                    });
                  }
                }
              }}
              value={posConfigurationInfo.surcharge}
              required
              error={!!errors.surcharge}
              helperText={errors.surcharge}
              inputMode="numeric"
              // type='number'
            />
          </Grid>

          <Grid size={12} textAlign={"end"}>
            <AddEditButton
              title={edit ? "Update" : "Add"}
              handleOnClick={() => setSuccessDialogOpen(true)}
              idDisabled={loading}
            />
          </Grid>
        </Grid>
      </Paper>
      <ConfirmationModal
        open={successDialogOpen}
        handleOnClose={handleCloseDialog}
        handleOnConfirm={handleSubmit}
        heading={edit ? "Update POS Configuration" : "Add POS Configuration"}
        text={"Please confirm your action"}
      />
    </Container>
  );
};

export default PosConfigurationManage;
