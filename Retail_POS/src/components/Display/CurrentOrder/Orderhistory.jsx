import { useEffect, useState } from "react";
import "./OrderHistory.css";
import { fetchOrders } from "../../../api/fetchOrders";
import { useSelector, useDispatch } from "react-redux";
import { clearViewOrder, showViewOrder } from "../../../feature/viewOrderSlice";
import { toast } from "react-toastify";

const OrderHistory = ({ search, setSearch }) => {
  const dispatch = useDispatch();
  const viewButtonOrder = useSelector((state) => state.displayViewOrder.order);
  const posData = useSelector((state) => state.posData);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { dltorders } = useSelector((state) => state.footer);
  useEffect(() => {
    const fetchOrderHistory = async () => {
      const date = new Date();
      const start_date = new Date(date.setHours(0, 0, 0, 0)).toISOString();
      const end_date = new Date(date.setHours(23, 59, 59, 999)).toISOString();
      if (!posData?.store?._id) {
        toast.error("Store Data is missing. Please Connect the driver");
        return;
      }
      try {
        setLoading(true);
        const response = await fetchOrders(
          start_date,
          end_date,
          posData?.store?._id
        );
        const filteredOrders = response.filter(
          (order) => order.order_type === "pos"
        );

        setOrderHistory(filteredOrders);
        // console.log(response);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();

    return () => {
      setSearch("");
      dispatch(clearViewOrder());
    };
  }, [dltorders]);

  const handleCheckboxChange = (order, isChecked) => {
    if (isChecked) {
      // setCheckedOrder(order);
      dispatch(showViewOrder(order));
    } else {
      // setCheckedOrder({});
      dispatch(clearViewOrder());
    }
  };

  const handleRowClick = (order, event) => {
    // Check if the clicked target is the row itself, not the checkbox
    const checkbox = event.target
      .closest("tr")
      .querySelector('input[type="checkbox"]');
    if (checkbox) {
      const newCheckedState = !checkbox.checked; // Toggle checkbox state
      checkbox.checked = newCheckedState; // Update checkbox UI
      handleCheckboxChange(order, newCheckedState); // Call the handler
    }
  };

  // console.log(orderHistory);

  return (
    <div className="order-history-container scrollable">
      {loading ? (
        <div className="flex justify-center items-center h-full space-x-2">
          {/* Spinner and Loading message */}
          <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
          <span className="text-lg font-semibold text-gray-500">
            Loading Orders...
          </span>
        </div>
      ) : orderHistory.length === 0 ? (
        <div className="no-orders-message text-center text-3xl font-semibold text-gray-500 mt-10">
          No Order Found in History
        </div>
      ) : (
        <table>
          <thead>
            <tr className="heading">
              <td width="100px">Order No</td>
              <td>Name</td>
              <td width="120px">Status</td>
              <td width="100px">Mode</td>
              <td width="100px">$Amount</td>
            </tr>
          </thead>
          <tbody>
            {orderHistory
              .filter((data) => data.order_number.includes(search))
              .map((order) => (
                <tr key={order._id}>
                  <td>
                    <label>
                      <input
                        type="checkbox"
                        id={order.orderNo}
                        onChange={(e) =>
                          handleCheckboxChange(order, e.target.checked)
                        }
                        checked={order._id === viewButtonOrder._id}
                      />
                      <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
                        {" "}
                        {order.order_number}
                      </span>
                    </label>
                  </td>
                  <td
                    style={{ textAlign: "start" }}
                    onClick={(e) => handleRowClick(order, e)}
                  >
                    <label
                      style={{ display: "block", textTransform: "capitalize" }}
                    >
                      {"SALE"}
                    </label>
                  </td>
                  <td onClick={(e) => handleRowClick(order, e)}>
                    <label
                      className={`status-label ${
                        order.status.toUpperCase() === "PAID"
                          ? "status-completed"
                          : order.status.toUpperCase() === "HOLD"
                          ? "status-pending"
                          : "status-cancelled"
                      }`}
                    >
                      {order?.status?.toUpperCase()}
                    </label>
                  </td>
                  <td onClick={(e) => handleRowClick(order, e)}>
                    <label
                      style={{ display: "block", textTransform: "uppercase" }}
                    >
                      {order.payment_mode}
                    </label>
                  </td>
                  <td onClick={(e) => handleRowClick(order, e)}>
                    <label>
                      ${order.grand_total.toFixed(2)}
                      {/* {order.payment_mode === "eftpos"
                        ? (order.sub_total - order.discount).toFixed(2)
                        : order.grand_total.toFixed(2)} */}
                    </label>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistory;
