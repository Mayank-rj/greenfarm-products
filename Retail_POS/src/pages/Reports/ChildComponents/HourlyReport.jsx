import { useEffect, useState } from "react";
import { fetchOrders } from "../../../api/fetchOrders";
import { useOutletContext } from "react-router";
import ReportsTable from "../ReportsTable/ReportsTable";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
export const HourlyReport = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [paidOrders, setPaidOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const posData = useSelector((state) => state.posData);
  const { startHourlyTime, endHourlyTime, startDate, endDate } =
    useOutletContext();

  const fetchOrderHistory = async () => {
    if (!posData?.store?._id) {
      return;
    }
    try {
      const response = await fetchOrders(
        startHourlyTime,
        endHourlyTime,
        posData?.store?._id
      );
      setOrderHistory(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const intervalId = setTimeout(() => {
      fetchOrderHistory();
    }, 1000);

    return () => clearTimeout(intervalId);
  }, [startHourlyTime, endHourlyTime, startDate, endDate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Filter only "PAID" orders
  // const paidOrders = orderHistory.filter((order) => order.status === "PAID");
  useEffect(() => {
    setPaidOrders(
      orderHistory.filter(
        (order) => order.status === "paid" && order.payment_mode !== "STRIPE"
      )
    );
  }, [orderHistory]);
  return (
    <div>
      <ReportsTable groupedData={paidOrders} type={"hourly"} />
      {/* Pass only PAID orders as prop to ReportsTable */}
    </div>
  );
};
