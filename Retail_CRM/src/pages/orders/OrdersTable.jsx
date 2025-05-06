import {
  Box,
  Button,
  Container,
  Paper,
  TableCell,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BackButton from "../../components/buttons/BackButton";
import { useNavigate } from "react-router";
import TableSearchbar from "../../components/searchbar/TableSearchbar";
import TableComponent from "../../components/table/TableComponent";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import errorHandler from "../../api/errorHandler";
import postApi from "../../api/postApi";

const columns = [
  { width: 50, label: "Order no.", dataKey: "order_number" },
  { width: 100, label: "Store", dataKey: "store_id" },
  { width: 80, label: "Order Type", dataKey: "ordertype" },
  { width: 120, label: "Ordered On", dataKey: "date_time" },
  { width: 50, label: "Amount", dataKey: "grand_total" },
  { width: 80, label: "Action", dataKey: "action" },
];

const OrdersTable = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value) {
      const filteredData = rows.filter(
        (row) =>
          row.order_number.toLowerCase().includes(value.toLowerCase()) ||
          row.grand_total.toString().includes(value.toLowerCase()) ||
          row.store_id?.name.toLowerCase().includes(value.toLowerCase()) ||
          row.order_type?.toLowerCase().includes(value.toLowerCase()) ||
          row.deliverytype?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredRows(filteredData);
    } else {
      setFilteredRows(rows); // If search term is empty, show all rows
    }
  };

  function rowContent(_index, row) {
    return columns.map((column) => {
      switch (column.dataKey) {
        case "date_time":
          return (
            <TableCell key={column.dataKey} align="center">
              {new Date(row[column.dataKey])?.toLocaleString()}
            </TableCell>
          );
        case "ordertype":
          return (
            <TableCell key={column.dataKey} align="center">
              {row?.order_type === "pos" ? row?.order_type : row?.deliverytype}
            </TableCell>
          );
        case "grand_total":
          return (
            <TableCell key={column.dataKey} align="center">
              ${row[column.dataKey]?.toFixed(2)}
            </TableCell>
          );
        case "store_id":
          return (
            <TableCell key={column.dataKey} align="center">
              {row[column.dataKey]?.name}
            </TableCell>
          );
        case "action":
          return (
            <TableCell key={column.dataKey} align="center">
              <Button
                style={{
                  position: "static",
                  borderRadius: "20px",
                  border: "1px solid green",
                  color: "green",
                }}
                onClick={() => navigate(`edit?id=${row._id}`)}
              >
                View
              </Button>
            </TableCell>
          );
        default:
          return (
            <TableCell key={column.dataKey} align="center">
              {row[column.dataKey]}
            </TableCell>
          );
      }
    });
  }
  const fetchOrdersByDate = async (dateRange) => {
    try {
      const apiPromise = postApi("/order/bydate", dateRange);
      toast.promise(apiPromise, {
        pending: "Fetching Orders...",
        // success: 'Orders fetched Successfully!',
        error: {
          render({ data }) {
            // Extract and return the error message
            return data?.response?.data?.message || "Fetching Orders Failed!";
          },
        },
      });
      const data = await apiPromise;
      if (data.success) {
        setRows(data.data);
      } else {
        errorHandler(null, data.message);
      }
    } catch (error) {
      // errorHandler(error, error.response?.data?.message);
      console.error(error);
    }
  };
  const selectedDateChangeHandler = (date) => {
    setSelectedDate(date);
    setSearchTerm("");
    localStorage.setItem("selectedDate", date.toISOString()); // Store selected date in localStorage
    fetchOrdersByDate({
      start_date: date.startOf("day").toISOString(),
      end_date: date.endOf("day").toISOString(),
    });
  };
  useEffect(() => {
    // Check if there's a date in localStorage, if yes use it, otherwise use today
    const savedDate = localStorage.getItem("selectedDate");
    const initialDate = savedDate ? dayjs(savedDate) : dayjs(); // Use saved date or today's date

    setSelectedDate(initialDate);
    fetchOrdersByDate({
      start_date: initialDate.startOf("day").toISOString(),
      end_date: initialDate.endOf("day").toISOString(),
    });
  }, []);

  useEffect(() => {
    setFilteredRows(rows); // Initialize filtered rows when `rows` change
  }, [rows]);

  return (
    <Container>
      <BackButton handleOnClick={() => navigate(-1)} />
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          color: "#1976d2",
          fontWeight: "bold",
          marginBottom: "30px",
        }}
      >
        ORDERS
      </Typography>
      <TableSearchbar
        label={"Search Orders"}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
      />
      <Box sx={{ display: "flex", p: 2, gap: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            defaultValue={selectedDate}
            views={["year", "month", "day"]}
            value={selectedDate}
            onChange={selectedDateChangeHandler}
            slotProps={{
              textField: {
                helperText: "MM/DD/YYYY",
              },
            }}
          />
        </LocalizationProvider>
      </Box>
      <Paper>
        <TableComponent
          rows={filteredRows}
          columns={columns}
          rowContent={rowContent}
        />
      </Paper>
    </Container>
  );
};

export default OrdersTable;
