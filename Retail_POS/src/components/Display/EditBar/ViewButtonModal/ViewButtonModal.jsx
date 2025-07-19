import "./ViewButtonModal.css";
import { useEffect, useState } from "react";
import Button from "../../../Button/Button";
import { fetchuserbyid } from "../../../../api/fetchuserbyid";
import { sendMessage, socket } from "../../../../app/driverConnection";
import { updateOrder } from "../../../../api/updateOrder";
import { toast } from "react-toastify";

export default function ViewButtonModal({ viewButtonOrder, onClose }) {
  const [productDetails, setProductDetails] = useState([]);
  const [formattedDateTime, setFormattedDateTime] = useState("");
  const [prindata, setprintdata] = useState([]);
  const [userData, setUserData] = useState([]);
  //------------------------- DISPLAY TOTAL PRICE --------------------------------
  // const viewBtnTotal = useMemo(() => {
  //   let total = 0
  //   console.log(viewButtonOrder)
  //   if (viewButtonOrder !== 0) {
  //     viewButtonOrder[0].forEach((order, i) => {
  //       const currentItemPrice = order.size === '2' ? order.weight * order.price : order.price
  //       const itemTotalPrice = currentItemPrice * viewButtonOrder[1][i]
  //       total += itemTotalPrice
  //     })
  //     return total
  //   }
  // }, [viewButtonOrder])

  // const originalDateTimeString = viewButtonOrder[3]
  console.log(viewButtonOrder);

  useEffect(() => {
    const originalDate = new Date(viewButtonOrder.date_time);

    const formattedDateTime = originalDate
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/\//g, "-");
    setFormattedDateTime(formattedDateTime);
  }, [viewButtonOrder.date_time]);

  useEffect(() => {
    setProductDetails(JSON.parse(viewButtonOrder.product_details) || []);
  }, [viewButtonOrder]);

  // const adjustedSubtotal =
  //   viewButtonOrder.payment_mode === "eftpos"
  //     ? (viewButtonOrder.sub_total * 1.015).toFixed(2) // Include 1.5% surcharge
  //     : viewButtonOrder.sub_total.toFixed(2);

  const adjustedGrandTotal =
    viewButtonOrder.payment_mode === "eftpos"
      ? (
          (viewButtonOrder.sub_total - viewButtonOrder.discount) *
          1.015
        ).toFixed(2)
      : viewButtonOrder.grand_total.toFixed(2);

  // console.log(productDetails);

  // const getuser = async () => {
  //   if (viewButtonOrder.user_id) {
  //     console.log(viewButtonOrder.user_id)
  //     const userResponse = await fetchuserbyid(viewButtonOrder.user_id);
  //     console.log(userResponse)
  //     if (userResponse) {
  //       // Merging user details and viewButtonOrder
  //       const mergedData = { ...viewButtonOrder, userDetails: userResponse };
  //       setprintdata(mergedData);
  //       setUserData(userResponse);
  //     }
  //   } else {
  //     setprintdata(viewButtonOrder);
  //   }
  // };

  useEffect(() => {
    setprintdata({ ...viewButtonOrder, userDetails: viewButtonOrder.user_id });
  }, [viewButtonOrder]);

  // // console.log(prindata);
  // useEffect(() => {
  //   const handleMessage = (event) => {
  //     console.log(event);
  //     const parsedData = JSON.parse(event.data);
  //     console.log(parsedData);
  //     if (parsedData?.type === "response") {
  //       if (parsedData.success) {
  //         // const payload = { _id: parsedData._id, isPrinted: true };
  //         // const res = updateOrder(payload);
  //         // console.log(res);
  //       }
  //       // console.log(prindata);
  //     }
  //   };
  //   socket.addEventListener("message", handleMessage);
  //   return () => {
  //     socket.removeEventListener("message", handleMessage);
  //   };
  // }, []);
  console.log(viewButtonOrder);

  const handlePrint = async () => {
    if (viewButtonOrder.order_type === "pos") {
      // if (viewButtonOrder.status === "HOLD") {
      //   toast.error("Hold order not print")
      // }
      // else {
      if (prindata) {
        sendMessage({
          command: "print",
          data: prindata,
        });
      }
      // }
    } else {
      if (prindata) {
        sendMessage({
          command: "webprint",
          data: prindata,
        });
        // console.log(prindata);
        // console.log(data2);
        const payload = { _id: prindata._id, isPrinted: true };
        const res = updateOrder(payload);
        // console.log(res);
      }
    }
  };
  console.log(productDetails);

  return (
    <div className="view-button ">
      <h3>Order Number : {viewButtonOrder.order_number}</h3>
      <div>
        {viewButtonOrder?.order_type === "online" && (
          <>
            <p className="font-bold text-center text-[2vw]">
              {viewButtonOrder?.deliverytype?.toUpperCase()}
            </p>{" "}
            <p className="font-bold text-[1.4vw] ">Customer Details</p>
            <div className="flex w-full">
              <div className="w-1/2">
                <p className="font-bold text-[1.4vw]">
                  Name:{" "}
                  <span className="font-semibold">
                    {viewButtonOrder.user_id.first_name}{" "}
                    {viewButtonOrder.user_id.last_name}
                  </span>
                </p>
                <p className="font-bold text-[1.4vw]">
                  Email:{" "}
                  <span className="font-semibold">
                    {viewButtonOrder.user_id.email}
                  </span>
                </p>
                <p className="font-bold text-[1.4vw]">
                  Mobile:{" "}
                  <span className="font-semibold">
                    {viewButtonOrder.user_id.mobile}
                  </span>
                </p>
              </div>
              {viewButtonOrder?.deliverytype === "delivery" && (
                <div className="w-1/2">
                  <p className="font-bold text-[1.4vw] h-18 overflow-y-auto">
                    Address:{" "}
                    <span className="font-semibold">
                      {viewButtonOrder.address}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </>
        )}
        {viewButtonOrder?.deliverytype === "pickup" && (
          <>
            <p className="font-bold text-[1.4vw] my-4">
              Pick Up Date :{" "}
              {new Date(viewButtonOrder?.pickup_date).toDateString()}
            </p>
          </>
        )}
        {viewButtonOrder?.notes && (
          <>
            <p className="font-bold text-[1.4vw] my-2 italic">
              Notes : {viewButtonOrder?.notes}
            </p>
          </>
        )}
      </div>
      <div
        className={`max-h-[15vw] overflow-y-auto ${
          viewButtonOrder?.order_type === "pos" && "mt-4"
        }`}
      >
        <table>
          <thead className="sticky top-0">
            <tr>
              <th width="5%">Qty</th>
              <th>Description</th>
              <th width="15%">Rate</th>
              <th width="15%">weight</th>
              <th width="20%">Price</th>
            </tr>
          </thead>
          <tbody>
            {productDetails?.map((order, i) => (
              <tr key={i}>
                <td style={{ textAlign: "center" }}>{order.quantity}</td>
                <td>
                  {" "}
                  {order.order_type === "pos"
                    ? order?.product?.name
                    : order?.product?.size === "variations" &&
                      order?.variationId
                    ? `${order?.product?.name} - ${
                        order?.product?.variations.find(
                          (item1) => item1?._id === order?.variationId
                        )?.name || ""
                      }`
                    : order?.product?.name || order?.name}
                </td>
                <td style={{ textAlign: "end" }}>
                  {order.order_type === "pos"
                    ? order?.product?.price
                    : order?.product?.size === "variations" &&
                      order?.variationId
                    ? order?.product?.variations
                        .find((item1) => item1?._id === order?.variationId)
                        ?.sell_price?.toFixed(2) || "0.00"
                    : order?.product?.sell_price?.toFixed(2) ||
                      order?.sell_price?.toFixed(2) ||
                      order?.price?.toFixed(2) ||
                      "0.00"}
                </td>
                <td style={{ textAlign: "end" }}>{order.weight} kg</td>

                {order?.product?.size === "variations" && order?.variationId ? (
                  <td style={{ textAlign: "end" }}>
                    {" "}
                    $
                    {(
                      (order?.product?.variations?.[0]?.sell_price || 0) *
                      order.quantity
                    ).toFixed(2)}
                  </td>
                ) : (
                  <td style={{ textAlign: "end" }}>
                    $
                    {(order?.product?.size === "slider" ||
                    order?.size === "slider"
                      ? (order?.product?.sell_price ||
                          order?.price?.toFixed(2)) *
                        order.quantity *
                        order?.weight
                      : (order?.product?.sell_price ||
                          order?.price?.toFixed(2)) * order.quantity
                    ).toFixed(2)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <div className="view-total">
          <div className="view-left">
            <p>Items : {productDetails.length}</p>
            <p>Date & Time: {formattedDateTime}</p>
            <p>Mode : {viewButtonOrder.payment_mode.toLowerCase()}</p>
            {viewButtonOrder.payment_mode === "split payment" && (
              <>
                <p>
                  Split Card Amount: $
                  {viewButtonOrder.split_card_amount.toFixed(2)}
                </p>
                <p>
                  Split Cash Amount: $
                  {viewButtonOrder.split_cash_amount.toFixed(2)}
                </p>
              </>
            )}
          </div>
          <div className="view-right">
            <p>SUB TOTAL : ${viewButtonOrder.sub_total.toFixed(2)}</p>

            {viewButtonOrder.discount !== 0 &&
            viewButtonOrder.status !== "HOLD" ? (
              <p>DISCOUNT : ${viewButtonOrder.discount.toFixed(2)}</p>
            ) : null}
            {viewButtonOrder.delivery_charge !== 0 && (
              <p>
                DELIVERY CHARGE : ${viewButtonOrder.delivery_charge.toFixed(2)}
              </p>
            )}
            {/*viewButtonOrder.payment_mode === "eftpos" ? (
              <p>SURCHARGE : 1.5 %</p>
            ) : null*/}
            {viewButtonOrder.status !== "HOLD" && (
              <p>AMOUNT PAID : ${viewButtonOrder.grand_total.toFixed(2)}</p>
            )}
          </div>
        </div>
      </div>
      <div className="view-btn">
        <Button item={"Print"} handleClick={handlePrint} />
        <Button item={"OK"} handleClick={onClose} />
      </div>
    </div>
  );
}
