import { useEffect, useMemo, useState } from "react";
import { fetchOrders } from "../../../api/fetchOrders";
import { useOutletContext } from "react-router";
import ReportsTable from "../ReportsTable/ReportsTable";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { FaSpinner } from "react-icons/fa";
export const HoldReport = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  // const [paidOrders, setPaidOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const posData = useSelector((state) => state.posData);

  const { startDate, endDate } = useOutletContext();

  const fetchOrderHistory = async () => {
    if (!posData?.store?._id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await fetchOrders(
        startDate,
        endDate,
        posData?.store?._id
      );
      setOrderHistory(response);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
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

  // Filter only "PAID" orders
  // const paidOrders = orderHistory.filter((order) => order.status === "HOLD");

  const paidOrders = useMemo(() => {
    return orderHistory.filter(
      (order) => order.status === "HOLD" && order.payment_mode !== "STRIPE"
    );
  }, [orderHistory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[75vh]">
        <h1 className="px-6 py-3">
          <FaSpinner className="animate-spin text-6xl text-slate-900" />
        </h1>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <ReportsTable groupedData={paidOrders} type={"hold"} />
      {/* Pass only PAID orders as prop to ReportsTable */}
    </div>
  );
};
