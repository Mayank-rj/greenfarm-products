import React, { useEffect, useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaShippingFast } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FaStore } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Widget from "../../components/Widget";
import {
  CircularProgress,
  Container,
  Grid2 as Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import getApi from "../../api/getApi";
import postApi from "../../api/postApi";
import { useNavigate } from "react-router";

const Dashboard = () => {
  const navigate = useNavigate();
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [storesCount, setStoresCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [productData, setProductData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear - i);

  // Function to fetch product by category count
  const fetchOrdersbyMonthCount = async (selectedYear) => {
    try {
      const data = await postApi(`/order/ordersbymonth`, {
        year: selectedYear,
      });
      setOrderData(data.orderCount);
    } catch (error) {
      console.error("Error fetching product by category count:", error);
    }
  };
  useEffect(() => {
    // Function to fetch product count
    const fetchProductCount = async () => {
      try {
        const data = await getApi(`/product/count`);
        setProductsCount(data.total);
      } catch (error) {
        console.error("Error fetching product count:", error);
      }
    };

    // Function to fetch store count
    const fetchStoreCount = async () => {
      try {
        const data = await getApi(`/store/count`);
        setStoresCount(data.total);
      } catch (error) {
        console.error("Error fetching store count:", error);
      }
    };
    // Function to fetch store count
    const fetchUserCount = async () => {
      try {
        const data = await getApi(`/user/count`);
        setUsersCount(data.total);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };
    const fetchOrderCount = async () => {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0); // Set to 00:00:00.000 (midnight)

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      try {
        const data = await getApi(
          `/order/count?start_date=${startOfDay.toISOString()}&end_date=${endOfDay.toISOString()}`
        );
        setOrdersCount(data.total);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };
    // Function to fetch product by category count
    const fetchProductbyCategoryCount = async () => {
      try {
        const data = await getApi(`/product/getProductsByCategoryCount`);
        setProductData(data.productCount);
      } catch (error) {
        console.error("Error fetching product by category count:", error);
      }
    };

    // Fetch all data and update the loading state accordingly
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchProductCount(),
        fetchStoreCount(),
        fetchUserCount(),
        fetchOrderCount(),
        fetchProductbyCategoryCount(),
      ]);
      setLoading(false);
    };

    fetchData();
  }, []); // Empty dependency array means this runs only once after the first render

  useEffect(() => {
    const fetchOrdersbyMonthCountData = async () => {
      setLoading(true);
      await Promise.all([fetchOrdersbyMonthCount(selectedYear)]);
      setLoading(false);
    };

    fetchOrdersbyMonthCountData();
  }, [selectedYear]);

  if (loading) {
    return (
      <Container maxWidth={false}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ textAlign: "center", color: "#1976d2" }}
        >
          DASHBOARD
        </Typography>
        <Paper sx={{ padding: 3, marginBottom: { xs: 10, sm: 10, md: 5 } }}>
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress size={35} color="primary" />
            <Typography sx={{ textAlign: "center", color: "#1976d2" }}>
              Loading ...
            </Typography>
          </Grid>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth={false}>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ textAlign: "center", color: "#1976d2" }}
      >
        DASHBOARD
      </Typography>
      <Paper sx={{ padding: 3, marginBottom: { xs: 10, sm: 10, md: 5 } }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Widget
              numbers={storesCount}
              heading="Stores"
              color="#9932CC"
              icon={<FaStore />}
              onClickHandler={() => {
                localStorage.removeItem("selectedDate"),
                  navigate("/retailcrm/admin/stores");
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Widget
              numbers={productsCount}
              heading="Products"
              color="#FFC300"
              icon={<AiOutlineShoppingCart />}
              onClickHandler={() => {
                localStorage.removeItem("selectedDate"),
                  navigate("/retailcrm/admin/products");
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Widget
              numbers={usersCount}
              heading="Users"
              color="#FF69B4"
              icon={<CgProfile />}
              onClickHandler={() => {
                localStorage.removeItem("selectedDate"),
                  navigate("/retailcrm/admin/users");
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Widget
              numbers={ordersCount}
              heading="Orders"
              color="#1f77b4  "
              icon={<FaShippingFast />}
              onClickHandler={() => {
                localStorage.removeItem("selectedDate"),
                  navigate("/retailcrm/admin/orders");
              }}
            />
          </Grid>

          <Grid size={12} sx={{ height: 500, overflow: "hidden" }}>
            <Typography
              variant="h6"
              sx={{ textAlign: "center", color: "#8884d8", height: "10%" }}
            >
              Categories
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart width={150} height={40} data={productData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ angle: -45, textAnchor: "end", fontSize: 12 }}
                  interval={0}
                  height={130}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend verticalAlign="top" />
                <Bar dataKey="Product" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
          <Grid size={{ xs: 3, sm: 3, md: 2 }}>
            <TextField
              select
              fullWidth
              id="selectedYear"
              label="Year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={12} sx={{ height: 500 }}>
            <Typography
              variant="h6"
              sx={{ textAlign: "center", color: "#8884d8", padding: 2 }}
            >
              Orders
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart width={150} height={40} data={orderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend verticalAlign="bottom" height={80} />
                <Bar dataKey="orders" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard;
