import React, { useEffect, useState } from "react";
import { validateProduct } from "../../schemas/ProductSchema";
import {
  Container,
  Typography,
  Grid2 as Grid,
  TextField,
  Paper,
  MenuItem,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
} from "@mui/material";
import BackButton from "../../components/buttons/BackButton";
import SelectInput from "../../components/inputFields/SelectInput";
import { fetchSubcategoryByCategoryId } from "../../api";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/modals/ConfirmationModal";
import fetchData from "../../api/fetchData";
import { useLocation, useNavigate } from "react-router";
import ImageUpload from "../../components/imageUpload/ImageUpload";
import errorHandler from "../../api/errorHandler";
import AddEditButton from "../../components/buttons/AddEditButton";
import getApi from "../../api/getApi";
import postApi from "../../api/postApi";
import AddEditVariationModal from "../../components/modals/AddEditVariationModal";
import { MdDeleteOutline } from "react-icons/md";

const ProductManage = ({ edit, heading }) => {
  const initialValues = {
    store: "",
    cover: "",
    name: "",
    images: ["", "", "", "", "", ""],
    original_price: "",
    sell_price: "",
    discount: "",
    descriptions: "",
    rating: "0",
    status: "active",
    in_offer: false,
    variations: [],
    size: "",
    category: "",
    in_stock: "",
    unit: "",
    quantity: "",
    sub_category: "",
  };

  const unitData = [
    { _id: "gram", label: "gram", value: "gram" },
    { _id: "kg", label: "kg", value: "kg" },
    { _id: "liter", label: "liter", value: "liter" },
    { _id: "ml", label: "ml", value: "ml" },
    { _id: "pcs", label: "pcs", value: "pcs" },
    { _id: "pack", label: "pack", value: "pack" },
    { _id: "box", label: "box", value: "box" },
    { _id: "carton", label: "carton", value: "carton" },
  ];
  const size = [
    { _id: "slider", label: "Slider Selection", value: "slider" },
    { _id: "variations", label: "Have Variations", value: "variations" },
    { _id: "novariations", label: "No Variations", value: "novariations" },
  ];

  const inStock = [
    { _id: "1", label: "In Stock", value: true },
    { _id: "0", label: "Out Of Stock", value: false },
  ];
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [productInfo, setProductInfo] = useState(initialValues);
  const [openVariationModal, setOpenVariationModal] = useState(false);
  const [variations, setVariations] = useState([]);
  const [errors, setErrors] = useState(initialValues);
  const [storesData, setStoresData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [subcategoriesData, setSubCategoriesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateProduct(productInfo, setErrors, variations)) {
      let dataToSend = { ...productInfo };
      if (productInfo.size === "variations") {
        dataToSend = { ...productInfo, variations: variations };
      } else {
        dataToSend = { ...productInfo, variations: [] };
      }

      try {
        let apiPromise;
        if (edit) {
          apiPromise = postApi("/product/update", dataToSend);
          toast.promise(apiPromise, {
            pending: "Product updating...",
            success: "Product updated Successfully!",
            error: {
              render({ data }) {
                // Extract and return the error message
                return (
                  data?.response?.data?.message || "Product updating Failed!"
                );
              },
            },
          });
        } else {
          apiPromise = postApi("/product/add", dataToSend);
          toast.promise(apiPromise, {
            pending: "Adding Product...",
            success: "Product added Successfully!",
            error: {
              render({ data }) {
                // Extract and return the error message
                return (
                  data?.response?.data?.message || "Product adding Failed!"
                );
              },
            },
          });
        }

        setLoading(true);
        const data = await apiPromise;
        if (data.success) {
          setProductInfo(initialValues);
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
    if (e.target.name == "category") {
      setProductInfo({
        ...productInfo,
        category: e.target.value,
        sub_category: "",
      });
    } else {
      setProductInfo({ ...productInfo, [e.target.name]: e.target.value });
    }
    setErrors({ ...errors, [e.target.name]: "" });
  };
 
  const handleImageSet = (value) => {
    // if (index === 0) {
    setProductInfo({ ...productInfo, cover: value });
    // }
  };
  const handleImageOther = (value, index) => {
    setProductInfo((prev) => {
      const newImgs = prev.images;
      newImgs[index] = value;
      return { ...prev, images: newImgs };
    });
  };

  const handleCloseDialog = () => {
    setSuccessDialogOpen(false);
  };
  const handleVariationDelete = (index) => {
    if (index > -1 && index < variations.length) {
      setVariations((prev) => {
        let updatedValue = [...prev];
        updatedValue.splice(index, 1);
        return updatedValue;
      });
    }
  };
  useEffect(() => {
    fetchData(
      () => getApi("/store"),
      setStoresData,
      "Unable to fetch stores",
      "Fetching stores"
    );
    fetchData(
      () => getApi("/category"),
      setCategoriesData,
      "Unable to fetch categories",
      "Fetching categories"
    );
  }, []);
  useEffect(() => {
    if (edit) {
      const paramValue = queryParams.get("id");
      fetchData(
        () => getApi(`/product?id=${paramValue}`),
        (data) => {
          setProductInfo(data);
          setVariations(data?.variations);
        },
        "Unable to fetch product",
        "Fetching product"
      );
    }
  }, []);
  useEffect(() => {
    if (productInfo.category !== "") {
      // setSubCategoriesData(productInfo.category?.subcategories || [])
      fetchData(
        () =>
          fetchSubcategoryByCategoryId(productInfo.category, productInfo.store),
        setSubCategoriesData,
        "Unable to fetch subcategory",
        "Fetching subcategory"
      );
    }
  }, [productInfo.category, productInfo.store]);
  useEffect(() => {
    const calculateSellPrice = () => {
      setProductInfo((prev) => {
        let result = (prev.original_price * (100 - prev.discount)) / 100;
        let updatedData = { ...prev };
        updatedData.sell_price = result.toFixed(2);
        return updatedData;
      });
    };
    calculateSellPrice();
  }, [productInfo.discount, productInfo.original_price]);

  // useEffect(()=>{
  //     if(productInfo.size!=="variations"){
  //         setVariations([]);
  //     }
  // },[productInfo.size])

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
          <Grid size={12}>
            <TextField
              select
              name={"store"}
              label={"Select Store"}
              value={productInfo.store}
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
              name={"category"}
              label={"Select Category"}
              value={productInfo.category}
              onChange={handleOnChange}
              error={!!errors.category}
              helperText={errors.category}
              required
              fullWidth
            >
              {categoriesData.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item["name"]}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              select
              name={"sub_category"}
              label={"Select Sub Category"}
              value={productInfo.sub_category}
              onChange={handleOnChange}
              error={!!errors.sub_category}
              helperText={errors.sub_category}
              required
              fullWidth
            >
              {subcategoriesData.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item["name"]}
                </MenuItem>
              ))}
            </TextField>
            {/* <SelectInput
                            name={"sub_category"}
                            label={"Select Sub Category"}
                            options={subcategoriesData}
                            value={productInfo.sub_category}
                            handleOnChange={handleOnChange}
                            valueProperty={"_id"}
                            titleProperty={"name"}
                            isError={!!errors.sub_category}
                            helperText={errors.sub_category}
                            required={true}

                        /> */}
          </Grid>
          <Grid size={12}>
            <TextField
              name={"name"}
              label={"Name"}
              value={productInfo.name}
              onChange={handleOnChange}
              error={!!errors.name}
              helperText={errors.name}
              required
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              label="Price/Cost"
              name="original_price"
              value={productInfo.original_price || ""} // Ensure empty value is handled properly
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
                    rawValue >= 0 &&
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
              value={productInfo.discount}
              error={!!errors.discount}
              helperText={errors.discount}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              label="Selling Price (After Discount)"
              name="sell_price"
              value={productInfo.sell_price}
              inputMode="numeric"
              slotProps={{
                readOnly: true, // Makes the field read-only
              }}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              label="Discount Given"
              slotProps={{ readOnly: true }}
              value={
                (productInfo.original_price - productInfo.sell_price >= 0
                  ? productInfo.original_price - productInfo.sell_price
                  : 0
                ).toFixed(2) || 0.0
              }
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <TextField
              label="Quantity Value (Single Product)"
              name="quantity"
              value={productInfo.quantity}
              error={!!errors.quantity}
              helperText={errors.quantity}
              // InputProps={{
              //     inputProps: {
              //         min: 0
              //     }
              // }}
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
              variant="outlined"
              inputMode="numeric"
              fullWidth
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <SelectInput
              name={"unit"}
              label={"Quantity Unit"}
              options={unitData}
              value={productInfo.unit}
              valueProperty={"value"}
              titleProperty={"label"}
              isError={!!errors.unit}
              helperText={errors.unit}
              handleOnChange={handleOnChange}
              isRequired={true}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <SelectInput
              name={"size"}
              label={"Size"}
              options={size}
              value={productInfo.size}
              valueProperty={"value"}
              titleProperty={"label"}
              isError={!!errors.size}
              helperText={errors.size}
              handleOnChange={handleOnChange}
              isRequired={true}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <SelectInput
              label="In Stock"
              name="in_stock"
              options={inStock}
              value={productInfo.in_stock}
              valueProperty={"value"}
              titleProperty={"label"}
              error={!!errors.in_stock}
              helperText={errors.in_stock}
              handleOnChange={handleOnChange}
              isRequired={true}
            />
          </Grid>
          {productInfo.size === "variations" && (
            <Grid container size={12} spacing={2}>
              <Grid size={12} sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h6" color="#1976d2" fontWeight="bold">
                  Add variations
                </Typography>
                <AddEditButton
                  title={"Add"}
                  handleOnClick={() => setOpenVariationModal(true)}
                />
                {errors.variations && (
                  <Typography color="error" variant="body2">
                    {errors.variations}
                  </Typography>
                )}
              </Grid>

              {variations.map((variation, index) => (
                <Grid
                  key={index}
                  size={12}
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <TextField
                    label="Name"
                    value={variation.name}
                    variant="filled"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                  <TextField
                    label="Original Price $"
                    value={parseFloat(variation.original_price).toFixed(2)}
                    variant="filled"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                  <TextField
                    label="Discount %"
                    value={parseFloat(variation?.discount).toFixed(2)}
                    variant="filled"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                  <TextField
                    label="Sell Price $"
                    value={parseFloat(variation?.sell_price).toFixed(2)}
                    variant="filled"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleVariationDelete(index)}
                  >
                    <MdDeleteOutline fontSize={25} />
                  </Button>
                </Grid>
              ))}
              <AddEditVariationModal
                open={openVariationModal}
                setOpen={setOpenVariationModal}
                setData={setVariations}
                fromErrors={errors}
                setFromErrors={setErrors}
                variations={variations}
              />
            </Grid>
          )}
          <Grid size={12}>
            <TextField
              label="Description"
              name="descriptions"
              value={productInfo.descriptions}
              onChange={handleOnChange}
              variant="outlined"
              fullWidth
              multiline
              rows={5}
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
              <Typography variant="h6">
                Upload Cover Image
                {errors.cover !== "" && (
                  <Typography sx={{ color: "red", fontSize: "12px" }}>
                    {errors.cover}
                  </Typography>
                )}
              </Typography>

              <ImageUpload
                InitialImage={
                  productInfo.cover !== "" ? productInfo.cover : null
                }
                width="250px" // Custom width
                height="250px" // Custom height
                handleImageSet={(value) => handleImageSet(value)}
                index={0}
              />
            </Box>
          </Grid>
          <Grid container spacing={2}>
            {productInfo.images.map((fileName, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography variant="h6">Upload Image {index + 1}</Typography>
                  <ImageUpload
                    InitialImage={fileName !== "" ? fileName : null}
                    width="250px" // Custom width
                    height="250px" // Custom height
                    handleImageSet={(value) => handleImageOther(value, index)}
                    index={index + 1}
                  />
                </Box>
              </Grid>
            ))}
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
        heading={edit ? "Update Product" : "Add Product"}
        text={"Please confirm your action"}
      />
    </Container>
  );
};

export default ProductManage;
