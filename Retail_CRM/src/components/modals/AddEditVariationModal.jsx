import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid2 as Grid,
  TextField,
  Box,
  Button,
} from "@mui/material";
import { MdAddCircleOutline, MdOutlineCancel } from "react-icons/md";
import { validateProductVariation } from "../../schemas/ProductVariationSchema";

const AddEditVariationModal = ({
  open,
  setOpen,
  setData,
  fromErrors,
  setFromErrors,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
  variations,
}) => {
  const initialValues = {
    name: "",
    sell_price: "",
    discount: "",
    original_price: "",
  };
  const [variationInfo, setVariationInfo] = useState(initialValues);
  const [errors, setErrors] = useState(initialValues);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setVariationInfo((prev) => ({ ...prev, [name]: value }));
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSaveVariation = () => {
    const duplicate = variations.some(
      (variation) =>
        variation.name.toLowerCase() === variationInfo.name.toLowerCase()
    );

    if (duplicate) {
      // Set error message for duplicate
      setErrors({
        ...errors,
        name: "Variation with the same name already exists.",
      });
    } else {
      //validation if alredy exist with this validation name and sell_price and variations is array of existing variations
      if (validateProductVariation(variationInfo, setErrors)) {
        setData((prev) => {
          let updatedData = [...prev];
          updatedData.push(variationInfo);
          return updatedData;
        });
        setFromErrors({
          ...fromErrors,
          variations: "",
        });
        handleClose();
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setVariationInfo(initialValues);
  };
  useEffect(() => {
    const calculateSellPrice = () => {
      setVariationInfo((prev) => {
        let result = (prev.original_price * (100 - prev.discount)) / 100;
        let updatedData = { ...prev };
        updatedData.sell_price = result.toFixed(2);
        return updatedData;
      });
    };
    calculateSellPrice();
  }, [variationInfo.discount, variationInfo.original_price]);
  return (
    <Dialog open={open} onClose={handleClose} keepMounted>
      <DialogTitle
        sx={{ textAlign: "center", fontWeight: "bold", color: "#1976d2" }}
      >
        {" "}
        Add Variation{" "}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} marginTop={2}>
          <Grid size={12}>
            <TextField
              label="Name"
              name="name"
              value={variationInfo.name}
              onChange={handleOnChange}
              error={!!errors.name}
              helperText={errors.name}
              variant="outlined"
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              label="Price/Cost"
              name="original_price"
              value={variationInfo.original_price || ""} // Ensure empty value is handled properly
              error={!!errors.original_price}
              helperText={errors.original_price}
              onChange={(e) => {
                const rawValue = e.target.value;

                if (rawValue === "") {
                  handleOnChange({
                    target: { name: e.target.name, value: rawValue },
                  });
                } else {
                  const regex = /^\d+(\.\d{0,2})?$/;
                  // If the input is not a valid integer or is out of the range 0-100, ignore it
                  if (
                    !isNaN(rawValue) &&
                    parseFloat(rawValue) >= 0 &&
                    regex.test(rawValue)
                  ) {
                    handleOnChange({
                      target: { name: e.target.name, value: rawValue },
                    });
                  }
                }
              }}
              variant="outlined"
              inputMode="numeric"
              fullWidth
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              label="Discount"
              name="discount"
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
                  const regex = /^([0-9]{1,2}(\.[0-9]{0,2})?|100(\.00?)?)$/;
                  //   const regex = /^\d{0,2}+(\.\d{0,2})?$/;
                  //   const regex = /^\d+(\.\d{0,2})?$/;
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
              value={variationInfo.discount}
              error={!!errors.discount}
              helperText={errors.discount}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              label="Selling Price (After Discount)"
              name="sell_price"
              value={variationInfo.sell_price}
              inputMode="numeric"
              slotProps={{
                readOnly: true,
              }}
              fullWidth
              readOnly
            />
          </Grid>
          <Grid size={12}>
            <DialogActions
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={handleClose}
                endIcon={<MdOutlineCancel />}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveVariation}
                fullWidth
                variant="contained"
                endIcon={<MdAddCircleOutline />}
              >
                Add
              </Button>
            </DialogActions>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditVariationModal;
