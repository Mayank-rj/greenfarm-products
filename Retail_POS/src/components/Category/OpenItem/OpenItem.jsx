import "../OpenItem/OpenItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// import { displayProducts } from "../feature/slices/displayProductSlice";
import { v4 as uuidv4 } from "uuid";

import Button from "../../Button/Button";
import Numpad from "../../KeyBoard/Numpad/Numpad";
import Keypad from "../../KeyBoard/Keypad/Keypad";
import { inputFieldFocus, openItembgBtn } from "../../../assets/btn-bg";
import { showOrder } from "../../../feature/displayOrderSlice";

export default function OpenItem({ onClose }) {
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    qty: 1,
    unitPrice: "",
    totalPrice: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [shake, setShake] = useState("");
  const [activeInput, setActiveInput] = useState("unitPrice");

  const handleQty = (increase) => {
    setInput((prevInput) => {
      const newQty = increase
        ? parseInt(prevInput.qty) + 1
        : Math.max(parseInt(prevInput.qty) - 1, 1);

      const newTotalPrice =
        prevInput.unitPrice !== "" && parseFloat(prevInput.unitPrice) !== 0
          ? (parseFloat(prevInput.unitPrice) * newQty).toFixed(2)
          : "";

      return {
        ...prevInput,
        qty: newQty,
        totalPrice: newTotalPrice,
      };
    });
  };

  const handleInputChange = (value) => {
    setError("");
    setInput((prevInput) => {
      let newQty = prevInput.qty;
      let newUnitPrice = prevInput.unitPrice;
      let newTotalPrice = prevInput.totalPrice;
      let newNotes = prevInput.notes;

      if (activeInput === "qty") {
        if (!isNaN(value) && value !== "") {
          newQty = parseInt(value);
          newTotalPrice = (newQty * parseFloat(newUnitPrice)).toFixed(2);
        } else {
          newQty = value; // Allows non-numeric characters temporarily
        }
      } else if (activeInput === "unitPrice") {
        // Regular expression for valid unit price (up to 2 decimal places)
        const regex = /^\d+(\.\d{0,2})?$/;
      
        if (value === "" || regex.test(value)) {
          newUnitPrice = value;
          newTotalPrice = value === "" ? "0" : (newQty * parseFloat(value)).toFixed(2);
        }
      } else if (activeInput === "totalPrice") {
        if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
          newTotalPrice = value;
          newUnitPrice =
            value === "" ? "0" : (parseFloat(value) / newQty).toFixed(2);
        }
      } else if (activeInput === "notes") {
        newNotes = value;
      }

      return {
        ...prevInput,
        qty: newQty,
        unitPrice: newUnitPrice,
        totalPrice: newTotalPrice,
        notes: newNotes,
      };
    });
  };

  const handleClick = (e) => {
    const buttonName = e.target.innerText;
    if (buttonName === "SUBMIT") {
      if (Number(input.unitPrice) > 0 && input.unitPrice !== "") {
        const notes = input.notes === "" ? "OPEN ITEM" : input.notes;
        dispatch(
          showOrder({
            name: notes,
            weight: 0,
            price: parseFloat(input.unitPrice),
            size: "novariations",
            quantity: Number(input.qty),
            uniqueId: uuidv4(),
          })
        );
        onClose();
      } else {
        if (shake === "") {
          setShake("shake");
        }
        setError("error");
      }
    } else if (buttonName === "CANCEL") {
      onClose();
    } else if (buttonName === "RESET") {
      setInput({
        qty: 1,
        unitPrice: "",
        totalPrice: "",
        notes: "",
      });
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
    <div className="open-item-container">
      <div className="header">
        <h1>OPEN ITEM</h1>
      </div>
      <div className="inputs">
        <div className="quantity">
          <p
            style={{
              fontSize: "2.2vw",
              fontWeight: 900,
            }}
          >
            QUANTITY
          </p>
          <div className="qty">
            <div className="qty-input">
              <input
                type="text"
                value={input.qty}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => setActiveInput("qty")}
                autoComplete="off"
                style={activeInput === "qty" ? inputFieldFocus : {}}
                readOnly
              />
            </div>
            <div className="btn">
              <button
                onClick={() => {
                  handleQty(true);
                  setActiveInput("qty");
                }}
                className="bg-blue-700 text-white p-3 rounded-sm shadow-lg transform transition-all duration-200 ease-in-out active:shadow-xl active:scale-95"
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
              <button
                onClick={() => {
                  handleQty(false);
                  setActiveInput("qty");
                }}
                className="bg-blue-700 text-white p-3 rounded-sm shadow-lg transform transition-all duration-200 ease-in-out active:shadow-xl active:scale-95"
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
            </div>
          </div>
        </div>
        <div className="price-field">
          <div className="unit-price">
            <h1>UNIT PRICE</h1>
            <input
              type="text"
              value={input.unitPrice}
              className={`${error} ${shake}`}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setActiveInput("unitPrice")}
              autoComplete="off"
              style={activeInput === "unitPrice" ? inputFieldFocus : {}}
              readOnly
              placeholder="Enter Unit Price"
            />
          </div>
          <div className="total-price">
            <h1>TOTAL PRICE</h1>
            <input
              type="text"
              value={input.totalPrice}
              className={`${error} ${shake}`}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setActiveInput("totalPrice")}
              autoComplete="off"
              style={activeInput === "totalPrice" ? inputFieldFocus : {}}
              readOnly
              placeholder="Enter Total Price"
            />
          </div>
        </div>
      </div>
      <div className="notes">
        <h1>DESCRIPTION</h1>
        <input
          type="text"
          value={input.notes}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setActiveInput("notes")}
          autoComplete="off"
          style={activeInput === "notes" ? inputFieldFocus : {}}
          readOnly
          placeholder="Enter Notes Here"
        />
      </div>
      <div className="keyboard">
        <div className="btn">
          <div className="submit-btn">
            <Button
              item="SUBMIT"
              style={{
                backgroundColor: "green",
                color: "white",
              }}
              handleClick={handleClick}
              background={openItembgBtn[0]}
            />
          </div>
          <div className="reset-cancel-btn">
            <Button
              item="RESET"
              style={{ backgroundColor: "orange", color: "white" }}
              handleClick={handleClick}
              background={openItembgBtn[1]}
            />
            <Button
              item="CANCEL"
              style={{
                backgroundColor: "red",
                color: "white",
              }}
              handleClick={handleClick}
              background={openItembgBtn[2]}
            />
          </div>
        </div>
        <div className="keypad">
          {["unitPrice", "totalPrice", "qty"].includes(activeInput) ? (
            <Numpad input={input[activeInput]} setInput={handleInputChange} />
          ) : (
            <Keypad input={input[activeInput]} setInput={handleInputChange} />
          )}
        </div>
      </div>
    </div>
  );
}
