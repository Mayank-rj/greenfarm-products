import { useEffect, useState } from "react";
import { fetchOrders } from "../../../api/fetchOrders";
import { useOutletContext } from "react-router";
import ReportsTable from "../ReportsTable/ReportsTable";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
export const HoldReport = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [paidOrders, setPaidOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const posData = useSelector((state) => state.posData);

  const { startDate, endDate } = useOutletContext();

  const fetchOrderHistory = async () => {
    if (!posData?.store?._id) {
      return;
    }
    try {
      const response = await fetchOrders(
        startDate,
        endDate,
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
  }, [startDate, endDate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Filter only "PAID" orders
  // const paidOrders = orderHistory.filter((order) => order.status === "HOLD");
  useEffect(() => {
    setPaidOrders(
      orderHistory.filter(
        (order) => order.status === "HOLD" && order.payment_mode !== "STRIPE"
      )
    );
  }, [orderHistory]);
  return (
    <div>
      <ReportsTable groupedData={paidOrders} type={"hold"} />
      {/* Pass only PAID orders as prop to ReportsTable */}
    </div>
  );
};
