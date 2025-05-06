import React, { useEffect, useState } from "react";
import { validateCoupon } from "../../schemas/CouponSchema.js";
import {
  Container,
  Typography,
  Grid2 as Grid,
  TextField,
  Paper,
  Box,
  MenuItem,
} from "@mui/material";
import BackButton from "../../components/buttons/BackButton";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import fetchData from "../../api/fetchData";
import { useLocation, useNavigate } from "react-router";
import ImageUpload from "../../components/imageUpload/ImageUpload";
import errorHandler from "../../api/errorHandler";
import AddEditButton from "../../components/buttons/AddEditButton";
import getApi from "../../api/getApi.js";
import postApi from "../../api/postApi.js";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider.js";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const CouponManage = ({ edit, heading }) => {
  const initialValues = {
    coupon_code: "",
    description: "",
    discount_type: "",
    discount_value: "",
    status: "active",
    exp_date: "",
  };
  const discountTypeOptions = [
    { id: "percentage", label: "Percent", value: "percent" },
    { id: "flat", label: "Flat", value: "flat" },
  ];
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [couponInfo, setCouponInfo] = useState(initialValues);
  const [errors, setErrors] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateCoupon(couponInfo, setErrors)) {
      try {
        let apiPromise;
        if (edit) {
          apiPromise = postApi("/coupon/update", couponInfo);
          toast.promise(apiPromise, {
            pending: "Coupon updating...",
            success: "Coupon updated Successfully!",
            error: {
              render({ data }) {
                // Extract and return the error message
                return (
                  data?.response?.data?.message || "Coupon updating Failed!"
                );
              },
            },
          });
        } else {
          apiPromise = postApi("/coupon/add", couponInfo);
          toast.promise(apiPromise, {
            pending: "Adding Coupon...",
            success: "Coupon added Successfully!",
            error: {
              render({ data }) {
                // Extract and return the error message
                return data?.response?.data?.message || "Coupon adding Failed!";
              },
            },
          });
        }

        setLoading(true);
        const data = await apiPromise;
        if (data.success) {
          setCouponInfo(initialValues);
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
    setCouponInfo({ ...couponInfo, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    if (e.target.name === "exp_date" && e.target.value) {
      const today = dayjs().endOf("day");
      if (dayjs(e.target.value).isBefore(today)) {
        setErrors({ ...errors, exp_date: "Expiry date must be in the future" });
      }
    }
  };

  const handleCloseDialog = () => {
    setSuccessDialogOpen(false);
  };

  useEffect(() => {
    if (edit) {
      const paramValue = queryParams.get("id");
      fetchData(
        () => getApi(`/coupon?id=${paramValue}`),
        setCouponInfo,
        "Unable to fetch coupon",
        "Fetching coupon"
      );
      console.log(couponInfo);
    } else {
      const today = dayjs().startOf("day");
      setSelectedDate(today);
      setCouponInfo({ ...couponInfo, exp_date: today.toISOString() });
    }
  }, []);

  useEffect(() => {
    if (edit) {
      setSelectedDate(dayjs(couponInfo?.exp_date));
      setErrors({
        ...errors,
        exp_date: "",
      });
    }
  }, [couponInfo]);

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
              label="Coupon code"
              name="coupon_code"
              fullWidth
              variant="outlined"
              onChange={(e) =>
                handleOnChange({
                  target: {
                    name: e.target.name,
                    value: e.target.value,
                  },
                })
              }
              value={couponInfo.coupon_code}
              error={!!errors.coupon_code}
              helperText={errors.coupon_code}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              select
              label="Discount Type"
              name="discount_type"
              variant="outlined"
              value={couponInfo.discount_type}
              error={!!errors.discount_type}
              helperText={errors.discount_type}
              onChange={handleOnChange}
              fullWidth
              required
            >
              {discountTypeOptions.map((option) => (
                <MenuItem key={option.id} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              label="Discount Value"
              name="discount_value"
              fullWidth
              variant="outlined"
              inputMode="numeric"
              onChange={(e) => {
                const rawValue = e.target.value;
                console.log(rawValue);

                if (rawValue === "") {
                  handleOnChange({
                    target: { name: e.target.name, value: rawValue },
                  });
                } else {
                  const regex = /^\d+(\.\d{0,2})?$/;

                  if (couponInfo.discount_type === "flat") {
                    if (
                      !isNaN(rawValue) &&
                      rawValue >= 0 &&
                      regex.test(rawValue)
                    ) {
                      handleOnChange({
                        target: { name: e.target.name, value: rawValue },
                      });
                    }
                  } else if (couponInfo.discount_type === "percent") {
                    if (
                      !isNaN(rawValue) &&
                      rawValue >= 0 &&
                      rawValue <= 100 &&
                      regex.test(rawValue)
                    ) {
                      handleOnChange({
                        target: { name: e.target.name, value: rawValue },
                      });
                    }
                  }
                }
              }}
              disabled={couponInfo.discount_type === ""}
              value={couponInfo.discount_value}
              error={!!errors.discount_value}
              helperText={errors.discount_value}
              required
            />
          </Grid>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Expiry Date"
              defaultValue={dayjs()}
              views={["year", "month", "day"]}
              value={selectedDate}
              onChange={(date) => {
                handleOnChange({
                  target: {
                    name: "exp_date",
                    value: date.endOf("day").toISOString(), // Ensure it's in ISO format
                  },
                });
                setSelectedDate(date); // Update the selected date
              }}
              // minDate={dayjs()}
              error={!!errors.exp_date} // Check if there's an error for exp_date
              helperText={errors.exp_date} // Display the error message for exp_date
            />
          </LocalizationProvider>

          <Grid size={12}>
            <TextField
              label="Description"
              name="description"
              fullWidth
              variant="outlined"
              onChange={handleOnChange}
              value={couponInfo.description}
              error={!!errors.description}
              helperText={errors.description}
              required
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
        heading={edit ? "Update Coupon" : "Add Coupon"}
        text={"Please confirm your action"}
      />
    </Container>
  );
};

export default CouponManage;
