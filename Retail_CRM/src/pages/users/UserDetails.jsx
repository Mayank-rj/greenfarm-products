import React, { useEffect, useState } from 'react'
import { Container, Typography, Grid2 as Grid, Paper, Box, Divider, Avatar, Tabs, Tab, TextField, InputAdornment } from '@mui/material';
import BackButton from '../../components/buttons/BackButton.jsx';
import fetchData from '../../api/fetchData.js';
import { Link, useLocation, useNavigate } from 'react-router';
import getApi from '../../api/getApi.js';
import user from "../../assets/images/user.png";
import CONFIG from '../../config/index.js';
import { toast } from 'react-toastify';
import postApi from '../../api/postApi.js';
import { AiOutlineSearch } from 'react-icons/ai';
const UserDetails = ({ heading }) => {

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [userInfo, setUserInfo] = useState();
  const [value, setValue] = useState(0);
  const [userOrderInfo, setUserOrderInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleOrderItemClick = (id) => {
    navigate(`/retailcrm/admin/orders/edit?id=${id}`)
  }
  useEffect(() => {
    const paramValue = queryParams.get("id");
    fetchData(() => getApi(`/user?id=${paramValue}`), setUserInfo, "Unable to fetch user", "Fetching user");
  }, [])
  useEffect(() => {
    const fetchOrdersByStore = async () => {
      const apiPromise = postApi('/order/byuserid', { userId: queryParams.get("id") });
      toast.promise(
        apiPromise,
        {
          pending: 'Getting Order',
          error: {
            render({ data }) {
              // Extract and return the error message
              return data?.response?.data?.message || 'Order fetching Failed!';
            },
          },
        }
      );
      setLoading(true);
      const data = await apiPromise;
      if (data.success) {
        setUserOrderInfo(data.data);
      }
      setLoading(false)
    }
    fetchOrdersByStore();
  }, [])


  return (
    <Container>
      <BackButton handleOnClick={() => navigate(-1)} />
      <Typography variant='h4' fontWeight="bold" sx={{ textAlign: "center", color: "#1976d2" }} >{heading}</Typography>
      <Paper sx={{ padding: 3, marginBottom: { xs: 10, sm: 10, md: 5 } }} >
        <Grid container spacing={2} >
          <Grid container spacing={2} size={{ xs: 12, md: 6 }}>
            <Grid size={12} >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2 }}>
                <Avatar
                  alt="Profile Picture"
                  src={
                    userInfo?.cover && userInfo.cover !== ""
                      ? `${CONFIG.imageURL}${userInfo.cover}`
                      : user
                  }
                  sx={{
                    width: 100,
                    height: 100,
                  }}
                />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {userInfo?.first_name} {userInfo?.last_name}
                  </Typography>

                  {/* Email */}
                  <Typography variant="body2" color="textSecondary">
                    {userInfo?.email}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ marginBottom: 2 }} />
              <Box sx={{ display: "flex", width: "100%", justifyContent: "" }}>
                <Box sx={{ width: "100%" }}>
                  <Typography variant="body2" color="textSecondary">
                    Orders
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {userOrderInfo.length}
                  </Typography>
                </Box>

                <Box sx={{ width: "100%" }}>
                  <Typography variant="body2" color="textSecondary">
                    Address
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {userInfo?.address?.length || "0"}
                  </Typography>
                </Box>

                <Box sx={{ width: "100%" }}>
                  <Typography variant="body2" color="textSecondary">
                    Reviews
                  </Typography>
                  <Typography variant="h6" color="primary">
                    0
                  </Typography>
                </Box>
              </Box>

            </Grid>
          </Grid>
          <Grid container spacing={2} size={{ xs: 12, md: 6 }}>
            <Grid size={12}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Orders" />
                <Tab label="Address" />
                <Tab label="Reviews" />
              </Tabs>
              {/* {value === 0 && <TextField
                id="search"
                type="search"
                label="search"
                // value={searchTerm}
                // onChange={handleSearch}
                sx={{ width: "100%", marginTop: 1, position: "sticky" }}
                slotProps={{
                  input: {
                    endAdornment: <InputAdornment position="end"><AiOutlineSearch /></InputAdornment>,
                  }
                }}
              />} */}

              <Box sx={{
                overflowY: "auto",
                height: 350
              }}>

                {value === 0 && (userOrderInfo.length === 0 ? (
                  <Typography>No Orders</Typography>
                ) : (
                  userOrderInfo?.map((item) => (
                    <Box
                      key={item._id}
                      sx={{
                        // boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                        borderRadius: 2,
                        padding: 2,
                        marginTop: 1,
                        backgroundColor: "#E9F4FF"
                      }}
                      onClick={() => handleOrderItemClick(item._id)}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >

                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Order Number: {item.order_number}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Store: {item.store_id?.name}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider />

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignContent: "center", width: "100%" }}>
                        <Typography gutterBottom>
                          ITEMS
                        </Typography>
                        <Typography gutterBottom>
                          X {JSON.parse(item.product_details)?.length}
                        </Typography>
                      </Box>

                      <Divider
                        sx={{
                          borderStyle: "dashed",
                        }}
                      />
                      <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignContent: "center",
                        width: "100%"
                      }}>

                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            gutterBottom
                          >
                            ORDERED ON
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            {new Date(item.date_time)?.toLocaleString()}
                          </Typography>
                        </Box>

                        <Box sx={{ textAlign: "end" }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            gutterBottom
                          >
                            TOTAL AMOUNT
                          </Typography>
                          <Typography gutterBottom>
                            ${parseFloat(item.grand_total)?.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))))}
                {value === 1 && (userInfo?.address.length === 0 ? (
                  <Typography>No Addresses</Typography>
                ) : (
                  userInfo?.address.map(item => (
                    <Box
                      key={item.id}

                      sx={{
                        // boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                        borderRadius: 2,
                        padding: 2,
                        marginTop: 1,
                        backgroundColor: "#E9F4FF"
                      }}

                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        Type: {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          whiteSpace: 'normal',
                          overflowWrap: 'break-word'
                        }}
                      >
                        Address: {item.address}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          whiteSpace: 'normal',
                          overflowWrap: 'break-word'
                        }}>
                        House: {item.house}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          whiteSpace: 'normal',
                          overflowWrap: 'break-word'
                        }}
                      >
                        Landmark: {item.landmark}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Pincode: {item.pincode}
                      </Typography>
                    </Box>
                  ))))}
                {value === 2 && (
                  <Typography>No Reviews</Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>

      </Paper>
    </Container>
  )
}

export default UserDetails
