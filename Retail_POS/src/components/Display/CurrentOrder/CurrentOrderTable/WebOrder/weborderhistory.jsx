import { useEffect, useState } from "react";
import "./weborderhistory.css";

import { useSelector, useDispatch } from "react-redux";

import { toast } from "react-toastify";
import { fetchOrders } from "../../../../../api/fetchOrders";
import {
  clearViewOrder,
  showViewOrder,
} from "../../../../../feature/viewOrderSlice";
import { fetchWebOrders } from "../../../../../api/fetchWebOrders";

const WebOrderHistory = ({ search, setSearch }) => {
  const dispatch = useDispatch();
  const viewButtonOrder = useSelector((state) => state.displayViewOrder.order);
  const webOrderBadgeCount = useSelector((state) => state.webOrderBadgeCount);
  const posData = useSelector((state) => state.posData);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      const date = new Date();
      const start_date1 = new Date(date.setHours(0, 0, 0, 0)).toISOString();
      // const end_date = new Date(date.setHours(23, 59, 59, 999)).toISOString();
      const end_date = new Date(date.setHours(23, 59, 59, 999)).toISOString();
      date.setDate(date.getDate() - 7);
      const start_date = new Date(date.setHours(0, 0, 0, 0)).toISOString();
      if (!posData?.store?._id) {
        toast.error("Store Data is missing. Please Connect the driver");
        return;
      }
      try {
        setLoading(true);
        const response = await fetchWebOrders(
          start_date,
          end_date,
          posData?.store?._id
        );
        // const filteredOrders = response.filter((order) => {
        //   // console.log(order.isPrinted);
        //   // console.log(order.pickup_date); //output>2025-01-20T18:30:00.000Z
        //   // console.log(start_date1); //output> 2025-01-28T1 8:30:00.000Z
        //   return (
        //     order.order_type === "online" &&
        //     (!order.pickup_date ||
        //       new Date(order.pickup_date) >= new Date(start_date1)) &&
        //     (!order.delivery_date ||
        //       new Date(order.delivery_date) >= new Date(start_date1))
        //   );
        // });
        // const index = 0;
        const filteredOrders = response.filter((order) => {
          // console.log(index++);
          // Ensure order is of type "online"
          const isOnlineOrder = order.order_type === "online";
          const paymentStatus = order.payment_status === "completed";

          // Check if pickup or delivery date is valid (i.e., not in the past)
          const isValidPickupDate = order?.pickup_date
            ? new Date(order?.pickup_date) >= new Date(start_date1)
            : false;
          const isValidDeliveryDate =
            order?.deliverytype === "delivery"
              ? new Date(order?.date_time) >= new Date(start_date1)
              : false;

          // If the order has a pickup or delivery date, we check if it is in the future or today.
          // If isPrinted is false, include the order even if it has a past date.
          // const isNotPrinted =  === false;
          //
          // console.log("isValidPickupDate", isValidPickupDate);
          // console.log("isValidDeliveryDate", isValidDeliveryDate);
          const isValidOrderDate = isValidPickupDate || isValidDeliveryDate;
          // const isValidOrder = !(
          //   isValidOrderDate === false && order.isPrinted === true
          // );
          // console.log(isValidOrder);
          return isOnlineOrder && isValidOrderDate && paymentStatus;
        });

        // console.log(filteredOrders);
        // const jsonConverted = filteredOrders.map((order) => {
        //   if (order.product_details) {
        //     try {
        //       order.product_details = JSON.parse(order.product_details);
        //     } catch (error) {
        //       console.error("Error parsing product details:", error);
        //       order.product_details = null;
        //     }
        //   }
        //   return order
        // });
        // console.log(filteredOrders.length);
        setOrderHistory(filteredOrders);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderHistory();
    return () => {
      setSearch("");
    };
  }, []);

  const handleCheckboxChange = (order, isChecked) => {
    if (isChecked) {
      dispatch(showViewOrder(order));
    } else {
      dispatch(clearViewOrder());
    }
  };

  const handleRowClick = (order, event) => {
    const checkbox = event.target
      .closest("tr")
      .querySelector('input[type="checkbox"]');
    if (checkbox) {
      const newCheckedState = !checkbox.checked;
      checkbox.checked = newCheckedState;
      handleCheckboxChange(order, newCheckedState);
    }
  };

  return (
    <div className="web-order-history-container scrollable">
      {loading ? (
        <div className="flex justify-center items-center h-full space-x-2">
          <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
          <span className="text-lg font-semibold text-gray-500">
            Loading Orders...
          </span>
        </div>
      ) : orderHistory.length === 0 ? (
        <div className="no-orders-message text-center text-3xl font-semibold text-gray-500 mt-10">
          No Order Found in Web Orders
        </div>
      ) : (
        <table>
          <thead>
            <tr className="heading">
              <td width="120px">Order ID</td>
              <td width="130px">Name</td>
              <td>Type</td>
              <td width="100px">Date</td>
              <td width="100px">$Amount</td>
            </tr>
          </thead>
          <tbody>
            {orderHistory
              .filter((data) => data.order_number.includes(search))
              .map((order, index) => (
                <tr
                  key={order._id}
                  className={`${
                    index <= webOrderBadgeCount - 1 && "bg-blue-800 text-white"
                  }`}
                >
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
                      {order.user_id?.first_name} {order.user_id?.last_name}
                    </label>
                  </td>
                  <td onClick={(e) => handleRowClick(order, e)}>
                    <label
                      style={{ display: "block", textTransform: "uppercase" }}
                    >
                      {order?.deliverytype}
                    </label>
                  </td>
                  <td onClick={(e) => handleRowClick(order, e)}>
                    <label
                      style={{ display: "block", textTransform: "uppercase" }}
                    >
                      {order?.deliverytype === "pickup"
                        ? new Date(order?.pickup_date).toDateString()
                        : "-"}
                    </label>
                  </td>
                  <td onClick={(e) => handleRowClick(order, e)}>
                    <label>${order.grand_total.toFixed(2)}</label>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WebOrderHistory;
