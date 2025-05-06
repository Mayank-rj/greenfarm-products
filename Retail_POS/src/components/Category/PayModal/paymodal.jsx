import "./PayModal.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../Modal/Modal";
import Numpad from "../../KeyBoard/Numpad/Numpad";
import { payBgBtn } from "../../../assets/btn-bg";
import Button from "../../Button/Button";
import CashReceived from "./CashReceived/CashReceived";
import PayDiscount from "./Discount/Discount";
import { toast } from "react-toastify";
import { addOrder } from "../../../api/addOder";
import { clearOrder } from "../../../feature/displayOrderSlice";
import SplitPayment from "./SplitPayment/splitpayment";
import Eftpos from "./Eftpos/Eftpos";
import { sendMessage, socket } from "../../../app/driverConnection";
import { terminalStatus } from "../../../SPI/event";
const PayModal = ({ onClose }) => {
  const display = useSelector((state) => state.displayOrder.orders);
  const posData = useSelector((state) => state.posData);
  const totalRoundOff = display.reduce((sum, item) => {
    const itemTotal =
      item.size === "variations" || item.size === "novariations"
        ? item.price * item.quantity
        : item.weight * item.price * item.quantity;

    return sum + parseFloat(itemTotal.toFixed(2));
  }, 0);

  // console.log(totalRoundOff);

  const dispatch = useDispatch();
  const [input, setInput] = useState({
    pay: "",
  });
  const [inputFocus, setInputFocus] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [width, setWidth] = useState({ width: "80%" });
  const [disAmount, setDisAmount] = useState(totalRoundOff);
  const [discount, setDiscount] = useState(0);
  const [changeAmount, setchangeamount] = useState(0);
  // const [terminalStatus,setterminalStatus] = useState("")
  const [dataToShow, setDataToShow] = useState({
    items: [],
    sub_total: 0,
    grand_total: 0,
    surcharge: posData.surcharge,
    discount: 0,
  });
  const [printData, setPrintData] = useState({});
  const displayOrder = useSelector((state) => state.displayOrder.orders);
  const holdOrderNumber = useSelector((state) => state.footer.orderNumber);
  const unique_id = useSelector((state) => state.footer.uniqueId);
  const Amount = (Math.round(totalRoundOff * 20) / 20).toFixed(2);
  const discountAmount = (Math.round(disAmount * 20) / 20).toFixed(2);
 
  
  // console.log("discountAmount", discountAmount);
  // console.log("disAmount", disAmount);



  useEffect(() => {
    const intervalId = setInterval(() => {
      // setterminalStatus(terminalmsg);
      terminalStatus
    }, 500);

    return () => clearInterval(intervalId);
  }, [terminalStatus]);

  // console.log(terminalStatus);
  

  const storedOrderNumber = holdOrderNumber
    ? holdOrderNumber
    : localStorage.getItem("orderNumber");
  const uniqueId = unique_id ? unique_id : localStorage.getItem("uniqueId");

  const orderPayload = {
    store_id: posData?.store?._id,
    date_time: new Date(),
    payment_mode: "",
    order_number: storedOrderNumber,
    product_details: JSON.stringify(displayOrder),
    address: "123, Street Name, City, Country",
    sub_total: inputFocus
      ? discount
        ? totalRoundOff.toFixed(2)
        : Amount
      : totalRoundOff.toFixed(2),
    surcharge: inputFocus ? 0 : posData?.surcharge || 0,
    delivery_charge: 0,
    coupon_code: "NO_COUPON",
    discount: discount,
    order_type: "pos",
    change_amount: inputFocus ? Number(changeAmount).toFixed(2) : 0,
    tender_amount: input.pay || 0,
    split_cash_amount: 0,
    split_card_amount: 0,
    reference_id: 0,
    status: "",
    grand_total: inputFocus
      ? discount
        ? discountAmount
        : Amount
      : disAmount.toFixed(2),
    unique_id: uniqueId,
    tip_amount: "0",
  };

  const sendOrderDetails = async (payment_mode, status, cardamt, cashamt) => {
    try {
      orderPayload.payment_mode = payment_mode;
      orderPayload.status = status;

      if (payment_mode === "split payment") {
        orderPayload.split_cash_amount = cashamt;
        orderPayload.split_card_amount = cardamt;
        orderPayload.grand_total = Number(cashamt) + Number(cardamt);
        orderPayload.reference_id = `REF-${Date.now()}`;
      }
      if (payment_mode === "eftpos") {
        orderPayload.grand_total = cardamt;
        orderPayload.reference_id = `REF-${Date.now()}`;
      }
      if (status === "HOLD") {
        orderPayload.grand_total = orderPayload.sub_total;
      }
      const response = await addOrder(orderPayload);

      if (response.success === true) {
        if (status !== "HOLD") {
          toast.success("Order placed successfully!");
          return response.success
        }
        if (!holdOrderNumber) {
          localStorage.removeItem("orderNumber");
          localStorage.removeItem("uniqueId");
        }
      } else {
        // toast.error("Failed to place the order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error?.response?.data?.message || error?.message);
    }
  };
  useEffect(() => {
    setPrintData({
      store_id: posData?.store?._id,
      driver_id: "67612d59abf885907dc4cdeb",
      user_id: "651c6a287fdc8e3a4b4a1234",
      date_time: new Date(),
      payment_mode: "",
      order_number: storedOrderNumber,
      product_details: JSON.stringify(displayOrder),
      notes: "Order placed successfully",
      address: "123, Street Name, City, Country",
      sub_total: inputFocus
        ? discount
          ? parseFloat(totalRoundOff)
          : parseFloat(Amount)
        : parseFloat(totalRoundOff),
      surcharge: inputFocus ? 0 : posData?.surcharge || 0,
      delivery_charge: 0,
      coupon_code: "NO_COUPON",
      discount: parseFloat(discount),
      order_type: "pos",
      change_amount: inputFocus ? parseFloat(changeAmount) : 0,
      tender_amount: parseFloat(input.pay)|| 0,
      split_cash_amount: 0,
      split_card_amount: 0,
      reference_id: 0,
      status: "",
      grand_total: inputFocus
        ? discount
          ? parseFloat(discountAmount)
          : parseFloat(Amount)
        : parseFloat(disAmount),
      unique_id: uniqueId,
      tip_amount: "0",
    });
  }, [
    display,
    discount,
    totalRoundOff,
    Amount,
    discountAmount,
    disAmount,
    inputFocus,
    changeAmount,
    input,
    uniqueId,
    posData,
    displayOrder,
    storedOrderNumber,
  ]);

  const handlePrint = (printData) => {
    if (printData) {
      sendMessage({
        command: "print",
        data: printData,
      });
    }
  };

  useEffect(() => {
    localStorage.setItem("discountAmount", discount);
  }, [discount]);

  const handleClose = () => {
    setOpenModal(false);
    setModalContent(null);
    localStorage.setItem("card", "");
  };

  useEffect(() => {
    if (input.pay.length > 0) {
      setInputFocus(true);
    } else if (input.pay === "") {
      setInputFocus(false);
    }
  }, [input]);

  useEffect(() => {
    const tenderAmount = parseFloat(input.pay || 0);
    if (tenderAmount) {
      const calculatedChange = Number(
        tenderAmount - (discount ? discountAmount : Amount)
      ).toFixed(2);
      setchangeamount(calculatedChange);
    }
  }, [input.pay, Amount]);

  useEffect(() => {
    sendMessage({
      command: "display",
      data: dataToShow,
    });
  }, [dataToShow]);

  useEffect(() => {
    setDataToShow({
      items: display,
      sub_total: inputFocus
        ? discount
          ? parseFloat(totalRoundOff).toFixed(2)
          : parseFloat(Amount).toFixed(2)
        : parseFloat(totalRoundOff).toFixed(2),
      grand_total: inputFocus
        ? discount
          ? parseFloat(discountAmount).toFixed(2)
          : parseFloat(Amount).toFixed(2)
        : parseFloat(disAmount).toFixed(2),
      surcharge: 0,
      discount: parseFloat(discount).toFixed(2),
    });
  }, [
    display,
    discount,
    totalRoundOff,
    Amount,
    discountAmount,
    disAmount,
    inputFocus,
  ]);

  const handleInputChange = (value) => {
    const tenderAmount = parseFloat(value || 0);
    const calculatedChange = (tenderAmount - Amount).toFixed(2);
    const isValid = /^(\d+(\.\d{0,2})?)?$/.test(value);
    if (isValid) {
      setInput({
        ...input,
        pay: value,
      });
    }
    setchangeamount(calculatedChange);
  };
  //

  const handleClick = async (e) => {
    const buttonValueMap = {
      "$ 5": 5,
      "$ 10": 10,
      "$ 20": 20,
      "$ 50": 50,
      "$ 100": 100,
      "Exact Amount": discountAmount,
    };
    const buttonName = e.target.innerText;
    const payValue = buttonValueMap[buttonName];
    let cardamount = (disAmount + ((posData.surcharge/100) * disAmount)).toFixed(2);
    const inp = Number(input.pay);
    // setchangeamount((input.pay - Amount).toFixed(2));
 
    if (payValue !== undefined) {
      setInputFocus(true);
      setInput({ ...input, pay: payValue });
    } else if (buttonName === "ACCEPT CASH") {
      if (inp === "" || inp === 0 || inp < discountAmount || Amount === 0) {
        setOpenModal(!openModal);
        setWidth({ width: "50%" });
        setModalContent(
          <div className="pay-error">
            <h1>Tender amount should not be less than total Amount.</h1>
            <Button item={"OK"} handleClick={handleClose} />
          </div>
        );
      } else {
        // if(inp>=Amount){
        // setchangeamount((inp - Amount).toFixed(2));
        // }
        setOpenModal(!openModal);
        setWidth({ width: "50%" });
        // console.log(changeAmount);

        setModalContent(
          <CashReceived
            sendOrderDetails={sendOrderDetails}
            changeAmount={changeAmount}
            onClose={onClose}
            handlePrint={handlePrint}
            setPrintData={setPrintData}
            printData={printData}
          />
        );
      }
    } else if (buttonName == "EFTPOS") {
      if (cardamount >= 1 && terminalStatus === "PairedConnected" && cardamount <= 10000) {
        // console.log(cardamount);
      setOpenModal(!openModal);
      setWidth({ width: "40%" });
      setModalContent(
        <Eftpos
          cardamount={cardamount}
          cashamount={0}
          onClose={onClose}
          sendOrderDetails={sendOrderDetails}
          payment_mode={"eftpos"}
          setDataToShow={setDataToShow}
          handlePrint={handlePrint}
          printData={printData}
        />
      );
    }
    else if (cardamount < 1) {
      toast.error("Amount should be greater than $ 1")
    }
    else if(cardamount >= 10000){
      console.log(cardamount);
      
      toast.error("Amount should be less than $ 10000")
    }
    else if (terminalStatus !=="PairedConnected") {
      toast.error("Please Connect the terminal first")
    }
  
  }


  

    else if (buttonName == "SPLIT PAYMENT") {
      setOpenModal(!openModal);
      setWidth({ width: "40%" });
      setModalContent(
        <SplitPayment
          amount={disAmount.toFixed(2)}
          onClose={onClose}
          sendOrderDetails={sendOrderDetails}
          payment_mode={"split payment"}
          setDataToShow={setDataToShow}
          handlePrint={handlePrint}
          printData={printData}
        />
      );
    } else if (buttonName === "DISCOUNT") {
      setOpenModal(!openModal);
      setWidth({ width: "30%" });
      setModalContent(
        <PayDiscount
          handleClose={handleClose}
          setDisAmount={setDisAmount}
          discount={discount}
          setDiscount={setDiscount}
        />
      );
    } else if (buttonName === "HOLD") {
      await sendOrderDetails("cash", "HOLD");
      toast.info("Order status set to HOLD");
      dispatch(clearOrder());
      onClose();
    } else if (buttonName === "CANCEL") {
      onClose();
    }
  };

  useEffect(() => {
    if (discount > 0 && input.pay) {
      setInput((prev) => ({
        ...prev,
        pay: disAmount.toFixed(2),
      }));
    }
  }, [discount]);

  return (
    <div className="pay-container">
      <div className="title-box">
        <h1>PAY</h1>
      </div>
      <div className="pay-head">
        <div className="total-amt">
          <p>TOTAL AMOUNT</p>
          <p className="total-text">
            ${inputFocus ? discountAmount : disAmount.toFixed(2)}
          </p>
          {discount !== "" ? (
            <p className="discount-apply">
              Discount apply on Total Amount: ${discount}
            </p>
          ) : (
            ""
          )}
        </div>
        <div className="discount-btn-box">
          <Button
            item="DISCOUNT"
            style={{ backgroundColor: "orange" }}
            handleClick={handleClick}
            background={payBgBtn[0]}
          />
          <Button
            item="HOLD"
            style={{ backgroundColor: "yellow" }}
            handleClick={handleClick}
            background={payBgBtn[1]}
            disabled={inputFocus}
          />
        </div>
      </div>
      <div className="box-container">
        <div className="btn-box grid grid-cols-2 gap-3">
          <button onClick={handleClick}>$ 5</button>
          <button onClick={handleClick}>$ 10</button>
          <button onClick={handleClick}>$ 20</button>
          <button onClick={handleClick}>$ 50</button>
          <button onClick={handleClick}>$ 100</button>
          <button className="btn-exact" onClick={handleClick}>
            Exact Amount
          </button>
        </div>
        <div className="pay-footer-btn grid grid-cols-2 gap-2">
          <input
            placeholder="Tendered Amount"
            value={input.pay}
            onChange={(e) => handleInputChange(e.target.value)}
            className="col-span-2 mb-4"
            readOnly
          />
          <div className="col-span-2">
            <Button
              item="ACCEPT CASH"
              style={{ backgroundColor: "green", color: "white" }}
              handleClick={handleClick}
              background={payBgBtn[2]}
              className="col-span-2"
            />
          </div>
          <Button
            item="SPLIT PAYMENT"
            style={{ backgroundColor: "orange" }}
            handleClick={handleClick}
            background={payBgBtn[0]}
            disabled={inputFocus}
          />
          <Button
            item="EFTPOS"
            style={{ backgroundColor: "yellow" }}
            handleClick={handleClick}
            background={payBgBtn[1]}
            disabled={inputFocus}
          />

          <div className="col-span-2">
            <Button
              item="CANCEL"
              style={{ backgroundColor: "red", color: "white" }}
              handleClick={handleClick}
              background={payBgBtn[3]}
            />
          </div>
        </div>
        <div className="pay-input-btn">
          <Numpad input={input.pay} setInput={handleInputChange} />
        </div>
      </div>

      {openModal && (
        <Modal isOpen={openModal} onClose={handleClose} width={width}>
          {modalContent}
        </Modal>
      )}
    </div>
  );
};

export default PayModal;
