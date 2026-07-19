import { useEffect, useState } from "react";
import Button from "../../Button/Button";
import Numpad from "../../KeyBoard/Numpad/Numpad";
import "./SaleByKg.css";
import { useDispatch, useSelector } from "react-redux";
import { inputFieldFocus, saleByKgBgBtn } from "../../../assets/btn-bg";
import { showOrder } from "../../../feature/displayOrderSlice";
import { v4 as uuidv4 } from "uuid";

export const SaleByKg = ({ onClose }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [shake, setShake] = useState("");
  const [activeInput, setActiveInput] = useState("salebykg");
  const weight = useSelector((state) => state.weight)
  const [input, setInput] = useState({
    salebykg: "",
  });

  const handleButtonClick = (e) => {
    const buttonName = e.target.innerText;
    if (buttonName === "SUBMIT") {
      if (input.salebykg === "" || Number(input.salebykg) <= 0) {
        if (shake === "") {
          setShake("shake");
        }

        setError("error");
      } else {
        dispatch(
          showOrder({
            name: "Sale By Kg",
            weight:2,
            // weight,
            price: Number(input.salebykg),
            size: "slider",
            uniqueId: uuidv4(),
            quantity: 1,
          })
        );
        onClose();
      }
    } else if (buttonName === "CANCEL") {
      onClose();
    }
  };

  const handleInputChange = (value) => {
    const regex = /^\d+(\.\d{0,2})?$/;
    if (value === "" || regex.test(value)) {
      setInput((prevInput) => ({
        ...prevInput,
        [activeInput]: value,
      }));
      
    }
    
  };

  useEffect(() => {
    if (shake === "shake") {
      const timer = setTimeout(() => {
        setShake("");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [shake]);

  return (
    <div className="sbk-container">
      <h1> SALE BY KG </h1>
      <input
        type="text"
        className={`${error} ${shake}`}
        value={input.salebykg}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => setActiveInput("salebykg")}
        readOnly
        autoComplete="off"
        style={activeInput === "salebykg" ? inputFieldFocus : {}}
        placeholder="Enter Price"
      />
      <div className="keyboard">
        <Numpad input={input[activeInput]} setInput={handleInputChange} />
      </div>
      <div className="btn-container">
        <Button
          item="SUBMIT"
          style={{ backgroundColor: "green", color: "white" }}
          handleClick={handleButtonClick}
          background={saleByKgBgBtn[0]}
        />
        <Button
          item="CANCEL"
          style={{ backgroundColor: "red", color: "white" }}
          handleClick={handleButtonClick}
          background={saleByKgBgBtn[1]}
        />
      </div>
    </div>
  );
};
