import { useEffect, useState } from "react";
import "./CurrentOrder.css";
import DraggableNumpad from "../../KeyBoard/DraggableNumpad/DraggableNumpad";
import CurrentOrderTable from "./CurrentOrderTable/CurrentOrderTable";
import { useDispatch, useSelector } from "react-redux";
import { ordernumber } from "../../../api/orderNumber";
import OrderHistory from "./Orderhistory";
import { orderNumber as holdedOrderNo } from "../../../feature/showorderslice";
import WebOrderHistory from "./CurrentOrderTable/weborder/weborderhistory";
import { toast } from "react-toastify";
import { fetchLatestOrder } from "../../../api/fetchLatestOrder";
import { sendMessage, socket } from "../../../app/driverConnection";
import { fetchLatestWebOrder } from "../../../api/fetchLatestWebOrder";
import { updateOrder } from "../../../api/updateOrder";
// const socket = io(SITE_CONFIG.socketIp)
const CurrentOrder = () => {
  const dispatch = useDispatch();
  const [orderNumber, setOrderNumber] = useState("");
  const [uid, setuid] = useState("");
  const [loading, setLoading] = useState(false);
  const [called, setCalled] = useState(false);
  const [search, setSearch] = useState("");
  const [printdata, setprintdata] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);

  const display = useSelector((state) => state.displayOrder.orders);
  const holdOrderNumber = useSelector((state) => state.footer.orderNumber);
  const unique_id = useSelector((state) => state.footer.uniqueId);
  const { webOrder, orders } = useSelector((state) => state.footer);
  const posData = useSelector((state) => state.posData);
  const viewButtonOrder = useSelector((state) => state.displayViewOrder.order);

  const totalPrice = display.reduce((sum, item) => {
    const itemTotal =
      item.size === "variations" || item.size === "novariations"
        ? item.price * item.quantity
        : item.weight * item.price * item.quantity;

    return sum + parseFloat(itemTotal.toFixed(2));
  }, 0);

  const fetchOrderNumber = async () => {
    if (display.length > 0) {
      const storedOrderNumber = localStorage.getItem("orderNumber");
      const uniqueId = localStorage.getItem("uniqueId");
      const storedDate = localStorage.getItem("currentDate");
      const currentDate = new Date().toLocaleDateString();

      if (storedDate !== currentDate) {
        localStorage.removeItem("orderNumber");
        localStorage.removeItem("uniqueId");
        localStorage.removeItem("currentDate");
      }
      // console.log("storedOrderNumber", storedOrderNumber);
      //   if (storedOrderNumber && uniqueId) {
      if (!holdOrderNumber) {
        if (!storedOrderNumber || !uniqueId || storedDate !== currentDate) {
          try {
            setCalled(true);
            const storeId = posData?.store?._id;
            // setCalled(true);
            const result = await ordernumber(storeId);
            const fetchedOrderNumber = result.orderNumber;
            const uniqid = result.uniqueId;

            localStorage.setItem("orderNumber", fetchedOrderNumber);
            localStorage.setItem("uniqueId", uniqid);
            localStorage.setItem("currentDate", currentDate);

            setuid(uniqid);
            setOrderNumber(fetchedOrderNumber);
            if (
              localStorage.getItem("orderNumber") &&
              localStorage.getItem("uniqueId")
            ) {
              setCalled(false);
            }
            //   dispatch(
            //     setOrderNumber_uid({
            //       orderNumber: fetchedOrderNumber,
            //       uniqueId: uniqid,
            //     })
            //   );
          } catch (error) {
            console.error("Error fetching order number:", error);
          }
        } else {
          setOrderNumber(storedOrderNumber);
          setuid(uniqueId);
        }
      }
    } else {
      setOrderNumber("");
      setuid("");
    }
  };

  const handlePrint = async () => {
    const date = new Date();
    const start_date = new Date(date.setHours(0, 0, 0, 0)).toISOString();
    const end_date = new Date(date.setHours(23, 59, 59, 999)).toISOString();

    try {
      setLoading(true);
      let response;
      // console.log(viewButtonOrder);

      if (orders) {
        if (
          Object.keys(viewButtonOrder).length !== 0 &&
          viewButtonOrder.status === "paid"
        ) {
          response = viewButtonOrder;
        }
      } else if (webOrder) {
        // console.log(Object.keys(viewButtonOrder).length)
        if (
          Object.keys(viewButtonOrder).length !== 0 &&
          viewButtonOrder.status === "paid"
        ) {
          response = viewButtonOrder;
        }
      } else {
        console.log("fetch last order");
        response = await fetchLatestOrder(
          start_date,
          end_date,
          posData?.store?._id
        );
        console.log(response);
      }

      // const getuser = async () => {
      //     if (viewButtonOrder.user_id) {
      //       const userResponse = await fetchuserbyid(viewButtonOrder.user_id)
      //       if (userResponse) {
      //         // Merging user details and viewButtonOrder
      //         const mergedData = { ...viewButtonOrder, userDetails: userResponse };
      //         setprintdata(mergedData);
      //         setUserData(userResponse);
      //       }
      //     }
      //     else {
      //       setprintdata(viewButtonOrder);
      //     }
      //   }

      if (orders) {
        if (response) {
          console.log(response);
          sendMessage({
            command: "print",
            data: response,
          });
        }
      } else if (webOrder) {
        //  console.log(response)
        if (response) {
          console.log(response);

          sendMessage({
            command: "webprint",
            data: response,
          });
          const payload = { _id: response._id, isPrinted: true };
          const res = updateOrder(payload);
          // console.log(res);
        }
      } else {
        console.log("hii");
        if (response) {
          sendMessage({
            command: "print",
            data: response,
          });
        }
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // console.log("viewButtonOrder", viewButtonOrder);

  useEffect(() => {
    if (display.length > 0 && !called) {
      fetchOrderNumber();
    } else {
      dispatch(holdedOrderNo(null));
    }
  }, [display]);

  useEffect(() => {
    if (!(webOrder || orders) || viewButtonOrder) {
      setInputFocused(false);
    }
  }, [webOrder, orders, viewButtonOrder]);

  //   console.log(orderNumber);

  return (
    <div className="display-currentOrder-container h-full overflow-y-auto overflow-x-hidden">
      <div className="filter">
        <p style={{ fontWeight: 600 }}>
          Order No :{" "}
          {holdOrderNumber?.length
            ? display.length > 0 && holdOrderNumber
            : display.length > 0 && orderNumber}
        </p>
        <input
          type="text"
          placeholder="Search Order No..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setInputFocused(true)}
          disabled={!(webOrder || orders)}
          readOnly
        />
      </div>
      {orders ? (
        <OrderHistory search={search} setSearch={setSearch} />
      ) : webOrder ? (
        <WebOrderHistory search={search} setSearch={setSearch} />
      ) : (
        // webOrderVal ? (
        //     <WebOrders onStatusChange={handleHoldButtonText} />
        // )
        <CurrentOrderTable />
      )}

      <div className="total">
        <div className="print">
          <button onClick={handlePrint} disabled={display.length !== 0}>
            PRINT
          </button>
        </div>
        <div className="total-item">
          <span>ITEM:</span> {display.length}
        </div>
        <div className="total-price">
          <span>TOTAL:</span> ${totalPrice.toFixed(2)}
        </div>
      </div>
      {inputFocused && (
        <DraggableNumpad
          setInputFocused={setInputFocused}
          searchTerm={search}
          setSearchTerm={setSearch}
        />
      )}
    </div>
  );
};

export default CurrentOrder;
