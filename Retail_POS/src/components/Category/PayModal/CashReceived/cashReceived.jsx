import "./CashReceived.css";

import Button from "../../../Button/Button";
import { changeBgBtn } from "../../../../assets/btn-bg";
import { clearOrder } from "../../../../feature/displayOrderSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { sendMessage } from "../../../../app/driverConnection";

export default function CashReceived({
  handlePrint,
  sendOrderDetails,
  onClose,
  changeAmount,
  printData,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // console.log(changeAmount)
  const dispatch = useDispatch();
  const handleClick = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await sendOrderDetails("cash", "paid", 0, 0);
      dispatch(clearOrder());
      // sendMessage({
      //   command: "open-drawer",
      // });
      onClose();
    } catch (error) {
      console.log("Error Calling Send Order API: ", error);
    } finally {
      setIsSubmitting(false);
    }

    // localStorage.setItem("discountAmount", "");
  };
  const printHandler = () => {
    handlePrint({ ...printData, payment_mode: "cash", status: "paid" });
  };
  return (
    <>
      <div className="cash-container">
        <h1 className="heading">CHANGE</h1>
        <h3 className="output-box">${changeAmount}</h3>
        <div className="btn-box">
          <Button
            item={isSubmitting ? "Processing" : "OK"}
            handleClick={handleClick}
            style={{ backgroundColor: "blue" }}
            background={changeBgBtn[0]}
          />
          <Button
            item="PRINT"
            handleClick={printHandler}
            style={{ backgroundColor: "green" }}
            background={changeBgBtn[1]}
          />
        </div>
      </div>
    </>
  );
}
