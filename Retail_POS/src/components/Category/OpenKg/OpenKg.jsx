import { useEffect, useState } from "react";
import "./OpenKg.css";
import { useDispatch } from "react-redux";
import Numpad from "../../KeyBoard/Numpad/Numpad";
import Keypad from "../../KeyBoard/Keypad/Keypad";
import Button from "../../Button/Button";
import { inputFieldFocus, openItembgBtn } from "../../../assets/btn-bg";
import { showOrder } from "../../../feature/displayOrderSlice";
import { v4 as uuidv4 } from "uuid";

export default function OpenKg({ onClose }) {
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    price: "",
    kg: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [shake, setShake] = useState("");
  const [activeInput, setActiveInput] = useState("kg");  //change to kg

  const handleInputChange = (value) => {
    setError("");
    const regex1 = /^\d+(\.\d{0,2})?$/;
    const regex2 = /^\d+(\.\d{0,3})?$/;
    if(activeInput==="price"){
      if(value === "" || regex1.test(value)){
        setInput({ ...input, [activeInput]: value });
      }
    }else if(activeInput==="kg"){
      if(value === "" || regex2.test(value)){
        setInput({ ...input, [activeInput]: value });
      }
    }else if(activeInput==="notes"){
      setInput({ ...input, [activeInput]: value });
    }
    
  };

  const handleClick = (e) => {
    const buttonName = e.target.innerText;
    if (buttonName === "SUBMIT") {
      if (
        input.price !== "" &&
        input.kg !== "" &&
        Number(input.price) > 0 &&
        Number(input.kg) > 0 &&
        !isNaN(input.price) &&
        !isNaN(input.kg)
      ) {
        const notes = input.notes === "" ? "OPEN KG" : input.notes;
        dispatch(
          showOrder({
            name: notes,
            weight: Number(input.kg),
            price: Number(input.price),
            size: "slider",
            quantity: 1,
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
      // console.log(buttonName);
      setInput({
        price: "",
        kg: "",
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
    <>
      <div className="openkg-container">
        <div className="header">
          <h1>OPEN KG</h1>
        </div>
        <div className="userInput">
          <div className="inputs">
            <div className="price">
              <label htmlFor="price">PRICE/KG</label>
              <input
                type="text"
                className={`${error} ${shake}`}
                placeholder="Enter Price"
                name="price"
                value={input.price}
                // onChange={(e) => setInput(e.target.value)}
                onFocus={() => setActiveInput("price")}
                autoComplete="off"
                readOnly
                style={activeInput === "price" ? inputFieldFocus : {}}
              />
            </div>
            <div className="kilogram">
              <label htmlFor="weight">WEIGHT</label>
              <input
                type="text"
                className={`${error} ${shake}`}
                placeholder="Enter Weight"
                name="kg"
                value={input.kg}
                // onChange={(e) => setInput(e.target.value)}
                onFocus={() => setActiveInput("kg")}
                autoComplete="off"
                readOnly
                style={activeInput === "kg" ? inputFieldFocus : {}}
              />
            </div>
          </div>
          <div className="ttl">
            <span>TOTAL PRICE</span>
            <div className="total">
              {Number(input.kg * input.price).toFixed(2)}
            </div>
          </div>
        </div>
        <div className="notes">
          {/* <h1>DESCRIPTION</h1> */}
          <label htmlFor="notes">DESCRIPTION</label>
          <input
            type="text"
            placeholder="Enter Notes Here"
            name="notes"
            value={input.notes}
            // onChange={(e) => setInput(e.target.value)}
            onFocus={() => setActiveInput("notes")}
            autoComplete="off"
            readOnly
            style={activeInput === "notes" ? inputFieldFocus : {}}
          />
        </div>
        <div className="footer-button">
          <div className="buttons">
            <div className="submit-btn">
              <Button
                item="SUBMIT"
                style={{ backgroundColor: "green", color: "white" }}
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
                style={{ backgroundColor: "red", color: "white" }}
                handleClick={handleClick}
                background={openItembgBtn[2]}
              />
            </div>
          </div>
          <div className="keyboard">
            {activeInput === "price" || activeInput === "kg" ? (
              <Numpad input={input[activeInput]} setInput={handleInputChange} />
            ) : (
              <Keypad input={input[activeInput]} setInput={handleInputChange} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
