import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid2 as Grid,
  Paper,
  Box,
  Divider,
} from "@mui/material";
import BackButton from "../../components/buttons/BackButton.jsx";
import fetchData from "../../api/fetchData.js";
import { Link, useLocation, useNavigate } from "react-router";
import getApi from "../../api/getApi.js";

const OrderManage = ({ heading }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [orderInfo, setOrderInfo] = useState({});
  const [userInfo, setUserInfo] = useState();
  const [storeInfo, setStoreInfo] = useState();

  useEffect(() => {
    const paramValue = queryParams.get("id");
    fetchData(
      () => getApi(`/order?id=${paramValue}`),
      setOrderInfo,
      "Unable to fetch order",
      "Fetching order"
    );
  }, []);

  useEffect(() => {
    const user_id = orderInfo?.user_id;
    const store_id = orderInfo?.store_id?._id;
    if (user_id && store_id) {
      fetchData(
        () => getApi(`/user?id=${user_id}`),
        setUserInfo,
        "Unable to fetch user",
        "Fetching user"
      );
      fetchData(
        () => getApi(`/store?id=${store_id}`),
        setStoreInfo,
        "Unable to fetch store",
        "Fetching store"
      );
    }
  }, [orderInfo]);

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
            <Typography fontWeight="bold" variant="h6">
              Order ID: {orderInfo?.order_number}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography fontWeight="bold" variant="h6">
              Store Name:{" "}
              <Link
                to={`/retailcrm/admin/stores/edit?id=${orderInfo?.store_id?._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {orderInfo?.store_id?.name}
              </Link>
            </Typography>
          </Grid>
          <Grid size={12}>
            <Divider sx={{ borderStyle: "dashed" }} />
          </Grid>
          {orderInfo?.order_type === "online" && (
            <>
              <Box
                sx={{
                  minWidth: "100%",
                }}
              >
                <Typography
                  className="order-type"
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: "2vw",
                  }}
                >
                  Order Type: {orderInfo?.deliverytype?.toUpperCase()}
                </Typography>

                <Typography
                  className="customer-title"
                  sx={{ fontWeight: "bold", fontSize: "1.4vw" }}
                >
                  Customer Details
                </Typography>

                <Box
                  sx={{
                    minWidth: "100%",
                    display: "flex",
                    flexWrap: "wrap",
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: "bold", fontSize: "1.4vw" }}>
                      Name:{" "}
                      <span style={{ fontWeight: "600" }}>
                        {userInfo?.first_name} {userInfo?.last_name}
                      </span>
                    </Typography>

                    <Typography sx={{ fontWeight: "bold", fontSize: "1.4vw" }}>
                      Email:{" "}
                      <span style={{ fontWeight: "600" }}>
                        {userInfo?.email}
                      </span>
                    </Typography>

                    <Typography sx={{ fontWeight: "bold", fontSize: "1.4vw" }}>
                      Mobile:{" "}
                      <span style={{ fontWeight: "600" }}>
                        {userInfo?.mobile}
                      </span>
                    </Typography>
                    <Typography sx={{ fontWeight: "bold", fontSize: "1.4vw" }}>
                      Address:{" "}
                      <span style={{ fontWeight: "600" }}>
                        {orderInfo?.deliverytype === "pickup"
                          ? storeInfo?.address
                          : orderInfo?.address}
                      </span>
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Grid size={12}>
                <Divider sx={{ borderStyle: "dashed" }} />
              </Grid>
            </>
          )}
          <Grid size={12}>
            <Typography fontWeight="bold" variant="h5">
              Item Details
            </Typography>
          </Grid>
          <Grid
            size={12}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography
              sx={{ width: "40%", fontWeight: "bold" }}
              variant="subtitle1"
            >
              Item{" "}
            </Typography>
            <Typography
              sx={{ width: "20%", fontWeight: "bold" }}
              variant="subtitle1"
              textAlign={"right"}
            >
              Price ($)
            </Typography>
            <Typography
              sx={{ width: "20%", fontWeight: "bold" }}
              variant="subtitle1"
              textAlign={"right"}
            >
              Total Price ($)
            </Typography>
            <Typography
              sx={{ width: "20%", fontWeight: "bold" }}
              variant="subtitle1"
              textAlign={"right"}
            >
              Weight
            </Typography>
            <Typography
              sx={{ width: "20%", fontWeight: "bold" }}
              variant="subtitle1"
              textAlign={"center"}
            >
              Quantity
            </Typography>
          </Grid>
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid
            container
            size={12}
            spacing={2}
            sx={{ maxHeight: "210px", overflowY: "auto" }}
          >
            {orderInfo && orderInfo?.product_details ? (
              JSON.parse(orderInfo?.product_details).map((item, index) => (
                <Grid
                  key={item?.uniqueId}
                  size={12}
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Box sx={{ width: "40%", wordWrap: " break-word" }}>
                    <Typography>
                      {item?.product?.size === "variations" &&
                      item?.variationId !== ""
                        ? `${item?.product?.name} - ${
                            item?.product?.variations.find(
                              (item1) => item1?._id === item?.variationId
                            )?.name
                          }`
                        : item?.product?.name || item?.name}
                    </Typography>
                  </Box>

                  <Typography sx={{ width: "20%" }} textAlign={"right"}>
                    {item?.product?.size === "variations" &&
                    item?.variationId !== ""
                      ? item?.product?.variations
                          .find((item1) => item1?._id === item?.variationId)
                          ?.sell_price.toFixed(2)
                      : item?.product?.sell_price.toFixed(2) ||
                        item?.price?.toFixed(2)}
                  </Typography>
                  <Typography sx={{ width: "20%" }} textAlign={"right"}>
                    {orderInfo?.order_type === "online"
                      ? item?.weight
                        ? (
                            item?.weight *
                            item?.quantity *
                            (item?.product?.size === "variations" &&
                            item?.variationId !== ""
                              ? item?.product?.variations.find(
                                  (item1) => item1?._id === item?.variationId
                                )?.sell_price
                              : item?.product?.sell_price)
                          ).toFixed(2)
                        : (
                            item?.quantity *
                            (item?.product?.size === "variations" &&
                            item?.variationId !== ""
                              ? item?.product?.variations.find(
                                  (item1) => item1?._id === item?.variationId
                                )?.sell_price
                              : item?.product?.sell_price)
                          ).toFixed(2)
                      : item?.weight
                      ? (item?.price * item?.weight * item?.quantity)?.toFixed(
                          2
                        )
                      : (item?.price * item?.quantity)?.toFixed(2)}
                  </Typography>
                  <Typography sx={{ width: "20%" }} textAlign={"right"}>
                    {item?.weight}
                  </Typography>
                  <Typography sx={{ width: "20%" }} textAlign={"center"}>
                    {item?.quantity}
                  </Typography>
                </Grid>
              ))
            ) : (
              <Grid size={12}>
                <Typography>No Data</Typography>
              </Grid>
            )}
          </Grid>
          <Grid size={12}>
            <Divider sx={{ borderStyle: "dashed" }} />
          </Grid>
          <Grid size={12}>
            <Typography fontWeight="bold" variant="h5">
              Basic Details
            </Typography>
          </Grid>
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid
            size={12}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography fontWeight="bold">Payment method</Typography>
            <Typography>{orderInfo?.payment_mode?.toUpperCase()}</Typography>
          </Grid>
          <Grid
            size={12}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography fontWeight="bold">Sub Total</Typography>
            <Typography>${orderInfo?.sub_total?.toFixed(2)}</Typography>
          </Grid>
          {orderInfo?.payment_mode?.toUpperCase() === "SPLIT PAYMENT" && (
            <>
              <Grid
                size={12}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Typography fontWeight="bold">Cash Amount</Typography>
                <Typography>
                  ${orderInfo?.split_cash_amount?.toFixed(2)}
                </Typography>
              </Grid>
              <Grid
                size={12}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Typography fontWeight="bold">Card Amount</Typography>
                <Typography>
                  ${orderInfo?.split_card_amount?.toFixed(2)}
                </Typography>
              </Grid>
            </>
          )}
          <Grid
            size={12}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography fontWeight="bold">Delivery Charge</Typography>
            <Typography>${orderInfo?.delivery_charge?.toFixed(2)}</Typography>
          </Grid>
          <Grid
            size={12}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography fontWeight="bold">Discount</Typography>
            <Typography>${orderInfo?.discount?.toFixed(2)}</Typography>
          </Grid>
          {orderInfo?.payment_mode?.toUpperCase() === "SPLIT PAYMENT" ||
            (orderInfo?.payment_mode?.toUpperCase() === "EFTPOS" && (
              <Grid
                size={12}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Typography fontWeight="bold">Surcharge</Typography>
                <Typography>{orderInfo?.surcharge}%</Typography>
              </Grid>
            ))}
          <Grid
            size={12}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography fontWeight="bold">Grand Total</Typography>
            <Typography>${orderInfo?.grand_total?.toFixed(2)}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default OrderManage;
