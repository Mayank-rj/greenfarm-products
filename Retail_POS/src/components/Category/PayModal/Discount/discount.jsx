import { useState } from "react";
import "./Discount.css";


import { useSelector } from "react-redux";
import Numpad from "../../../KeyBoard/Numpad/Numpad";
import { payBgBtn } from "../../../../assets/btn-bg";
import Button from "../../../Button/Button";
import { toast } from "react-toastify";

const PayDiscount = ({ handleClose, setDisAmount, setDiscount, discount }) => {
    const display = useSelector((state) => state.displayOrder.orders);
  const totalRoundOff =  display.reduce((sum, item) => {
    const itemTotal = (item.size === 'variations' || item.size === 'novariations') 
      ? (item.price * item.quantity) 
      : (item.weight * item.price * item.quantity);
      return sum + parseFloat(itemTotal.toFixed(2));
    }, 0);
  // console.log(totalRoundOff);
  

  const [input, setInput] = useState({
    disc: discount ? discount : "",
  });
  // const [error, setError] = useState("");

  const handleInputChange = (value) => {
    // Allow only numbers with up to two decimal places
    const isValid = /^(\d+(\.\d{0,2})?)?$/.test(value);
    if (isValid) {
      setInput((prevInput) => ({
        ...prevInput,
        disc: value,
      }));
    }
  };
  

  const handleClick = (e) => {
    const buttonName = e.target.innerText;
    
    if (input.disc !== "" &&   totalRoundOff > Number(input.disc) &&  input.disc!=="0") {
      if (buttonName === "GIVE DISCOUNT") {
        let DiscountAmount =
        totalRoundOff - input.disc;
        setDisAmount(DiscountAmount);
        setDiscount(input.disc);
        handleClose();
      }
    }else{
      toast.error("Please enter valid discount")
    }
  };

  // console.log( totalRoundOff > Number(input.disc) )

  return (
    <div className="discount-container">
      <div className="discount-heading">
        <h1>DISCOUNT</h1>
      </div>
      <div>
        <div>
          <div className="total-amt">
            <p>Total Amount</p>
            <h2>${totalRoundOff.toFixed(2)}</h2>
          </div>
        </div>
        <div className="input-box">
          <p>Discounted Amount</p>
          <input
            placeholder="$00.00"
            type="text"
            value={input.disc}
            onChange={(e) => handleInputChange(e.target.value)}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "1vw",
        }}
      >
        <Numpad input={input.disc} setInput={handleInputChange} />

        <Button
          item="GIVE DISCOUNT"
          style={{ backgroundColor: "green" }}
          handleClick={handleClick}
          background={payBgBtn[2]}
        />
      </div>
    </div>
  );
};

export default PayDiscount;
