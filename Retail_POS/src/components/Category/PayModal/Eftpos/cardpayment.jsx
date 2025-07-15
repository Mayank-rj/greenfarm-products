import "./CardPayment.css";
import Button from "../../../Button/Button";
import { eftposBgBtn } from "../../../../assets/btn-bg";
import { useDispatch, useSelector } from "react-redux";
import { clearOrder } from "../../../../feature/displayOrderSlice";
import {
  cuurentTxFlow,
  date_time,
  DisplayMessage,
  recoverTransaction,
  sharedState,
} from "../../../../SPI/event";
import { useEffect, useState } from "react";
import { setTransactionState } from "../../../../feature/transactionSlice";
import {
  cancelTransaction,
  purchase,
  reference_id,
} from "../../../../SPI/transaction";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { PiWarningCircle } from "react-icons/pi";
import { addtransaction } from "../../../../api/addTransaction";
import { toast } from "react-toastify";
import { spi } from "../../../../pages/Setting/PairingUI";
import { sendMessage } from "../../../../app/driverConnection";
import { SuccessState } from "@mx51/spi-client-js";
function Cardpayment({
  handleClose,
  onClose,
  cardamount,
  payment_mode,
  cashamount,
  sendOrderDetails,
}) {
  const [msg, setMsg] = useState("Processing...");
  const [transactionmsg, setTransactionmsg] = useState("");
  const [awaitingSignatureCheck, setAwaitingSignatureCheck] = useState(false);
  const [hostResponseText, setHostresponsetext] = useState("");
  const [manualRecovery, setManualRecovery] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [terminalStatus, setTerminalSatus] = useState("");
  const posData = useSelector((state) => state.posData);
  const transactionMessage = localStorage.getItem("transactionMessage");

  // const display = useSelector((state) => state.displayOrder.orders);

  const dispatch = useDispatch();

  useEffect(() => {
    const intervalId = setInterval(() => {
      // console.log("interval");
      setMsg(DisplayMessage);
      setAwaitingSignatureCheck(localStorage.getItem("AwaitingSignatureCheck"));
      setTransactionmsg(transactionMessage);
      // console.log(transactionMessage);

      setTerminalSatus(localStorage.getItem("terminalStatus"));
      if (localStorage.getItem("hostResponseText") === "undefined") {
        setHostresponsetext(localStorage.getItem("errorDetail"));
      } else {
        setHostresponsetext(localStorage.getItem("hostResponseText"));
      }

      if (
        transactionMessage === "Transaction Failed" ||
        transactionMessage === "Transaction Successful"
      ) {
        setAwaitingSignatureCheck(false);
        localStorage.removeItem("AwaitingSignatureCheck");
      }
    }, 100);
    return () => clearInterval(intervalId);
  }, [msg, transactionMessage]);

  const handleClick = async (e) => {
    const buttonname = e.target.innerText;
    if (buttonname === "OK") {
      try {
        if (payment_mode === "eftpos") {
          await sendOrderDetails(payment_mode, "paid", cardamount, 0);
        } else if (payment_mode === "split payment") {
          await sendOrderDetails(payment_mode, "paid", cardamount, cashamount);
        }

        const transaction_receipt =
          localStorage.getItem("merchant_receipt") || " ";
        const lastTxPosId = localStorage.getItem("lastTxPosId");
        // console.log("cardamount", cardamount)
        const total = Number(cardamount).toFixed(2);
        console.log("fdhjtfyt6rdrjtfytridytfyyridrft", date_time);
        const orderTransactionToSend = {
          amount: parseFloat(total),
          date: new Date(),
          pos_id: lastTxPosId,
          ref_id: reference_id,
          store_id: posData.store._id,
          transaction_receipt: transaction_receipt,
          status: true,
        };
        try {
          const responseaddtransaction = await addtransaction(
            orderTransactionToSend
          );

          onClose();
          dispatch(clearOrder());
          dispatch(setTransactionState(false));

          localStorage.removeItem("orderNumber");
          localStorage.removeItem("uniqueId");
          localStorage.removeItem("lastTxPosId");
          localStorage.removeItem("order_id");
          localStorage.removeItem("transactionMessage");
          localStorage.removeItem("merchant_receipt");
          localStorage.removeItem("customer_receipt");
          localStorage.removeItem("eventMessage");
          localStorage.removeItem("errorDetail");
          localStorage.removeItem("hostResponseText");
          localStorage.removeItem("discountAmount");
          localStorage.removeItem("customer_receipt");
        } catch (error) {
          toast.error(error?.response?.data?.message || error?.message);
        }
      } catch (error) {
        toast.error(error);
      }
      // localStorage.setItem("card", "");
    } else if (buttonname === "CANCEL") {
      setCancel(true);
      // handleClose();
      setTransactionmsg(transactionMessage);
      localStorage.removeItem("hostResponseText ");
      localStorage.removeItem("errorDetail");
      cancelTransaction();
    } else if (buttonname === "Print") {
      const transaction_receipt = localStorage.getItem("customer_receipt");

      if (transaction_receipt) {
        sendMessage({
          command: "merchant_receipt",
          data: transaction_receipt,
        });
      }
    }
  };

  const handleRetryTransaction = async () => {
    const transaction_receipt = localStorage.getItem("merchant_receipt") || " ";
    const lastTxPosId = localStorage.getItem("lastTxPosId");

    const total = Number(cardamount).toFixed(2);
    console.log(transactionMessage);
    const orderTransactionToSend = {
      amount: parseFloat(total),
      date: new Date(),
      pos_id: lastTxPosId,
      ref_id: reference_id,
      store_id: posData.store._id,
      transaction_receipt: transaction_receipt,
      status: false,
    };
    try {
      const responseaddtransaction = await addtransaction(
        orderTransactionToSend
      );
      localStorage.removeItem("lastTxPosId");
      localStorage.setItem("transactionMessage", "Purchase In Progress");
      sharedState.transactionMessage = "Purchase In Progress";
      purchase(parseFloat(cardamount * 100), 0, 0, 0, 0);
    } catch (error) {
      toast.error(error?.message || error?.response?.data?.message);
    }
  };

  useEffect(() => {
    const SignatureReceipt = localStorage.getItem("SignatureReceipt");
    if (awaitingSignatureCheck) {
      sendMessage({
        command: "merchant_receipt",
        data: SignatureReceipt,
      });
    }
  }, [awaitingSignatureCheck]);

  const handleSignatureCheck = (status) => {
    if (status) {
      spi.AcceptSignature(true);
    } else {
      spi.AcceptSignature(false);
    }
    localStorage.removeItem("AwaitingSignatureCheck");
    localStorage.removeItem("SignatureReceipt");
    setAwaitingSignatureCheck(false);
  };

  useEffect(() => {
    if (
      cuurentTxFlow === "Unknown" &&
      terminalStatus === "PairedConnecting" &&
      cancel
    ) {
      const timerId = setTimeout(() => {
        setManualRecovery(true);
      }, 3000);

      // Clear the timeout if component unmounts
      return () => clearTimeout(timerId);
    }
  }, [terminalStatus, cancel]);

  const handleManualRecovery = (status) => {
    console.log(status);

    if (status) {
      spi.AckFlowEndedAndBackToIdle();
      localStorage.setItem("transactionMessage", "Transaction Successful");
      setTransactionmsg(transactionMessage);
      console.log("hiiii", transactionMessage);

      localStorage.setItem("hostResponseText", "APPROVED");
      console.log(localStorage.getItem("transactionMessage"));

      if (reference_id) {
        recoverTransaction(reference_id, "purchase");
      }
    } else {
      spi.AckFlowEndedAndBackToIdle();
      //  transactionMessage="Transaction Failed";
      localStorage.setItem("transactionMessage", "Transaction Failed");
      setTransactionmsg("transactionMessage");
      localStorage.setItem("errorDetail", "Transaction user cancelled");
      console.log("hii2");
      if (reference_id) {
        recoverTransaction(reference_id, "purchase");
      }
    }
    setManualRecovery(false);
  };

  const bounceStyle = {
    animation: "bounce 1s ease infinite",
  };

  // console.log(transactionmsg);

  return (
    <div className="bg-gray-900 bg-opacity-50 flex items-center rounded-md justify-center">
      <div className=" p-8 w-3/5 text-center text-white ">
        {transactionmsg === "Transaction Successful" ? (
          <>
            <div className="flex justify-center items-center gap-2 py-6 w-full">
              <div className="w-1/3">
                <div className="flex justify-center mb-4">
                  <FaCheckCircle className="text-green-500 text-5xl mb-2 animate-bounce" />
                </div>
                <h1
                  style={{
                    color: "#22C55E",
                    fontSize: "36px",
                    margin: "10px 0",
                    fontWeight: "bold",
                    background: "none",
                  }}
                >
                  SUCCESS
                </h1>
                <h2 className="text-md font-semibold mb-2 text-white">
                  {hostResponseText}
                </h2>

                <div className="grid grid-cols-2 gap-2 mt-6">
                  <Button
                    item="OK"
                    style={{
                      backgroundColor: "green",
                    }}
                    handleClick={handleClick}
                    background={eftposBgBtn[1]}
                  />

                  <Button
                    item="Print"
                    style={{
                      backgroundColor: "blue",
                    }}
                    handleClick={handleClick}
                    background={eftposBgBtn[2]}
                  />
                </div>
              </div>

              {/* Receipts Section */}
              <div className="w-2/3 flex justify-center items-start gap-4">
                {/* Merchant Receipt */}
                <div className="w-1/2">
                  <p className="text-white font-semibold">Merchant Receipt</p>
                  <div className="border h-40v bg-white text-black text-xs overflow-y-auto mt-1 p-2">
                    <pre className="text-xs">
                      {window.localStorage.getItem("merchant_receipt")}
                    </pre>
                  </div>
                </div>

                {/* Customer Receipt */}
                <div className="w-1/2">
                  <p className="text-white font-semibold">Customer Receipt</p>
                  <div className="border h-40v bg-white text-black text-xs overflow-y-auto mt-1 p-2">
                    <pre className="text-xs">
                      {window.localStorage.getItem("customer_receipt")}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : transactionmsg === "Purchase In Progress" ? (
          <div className="cardpay-container">
            <h2>{msg}</h2>

            <div className="btn-container">
              <Button
                item="CANCEL"
                style={{
                  backgroundColor: "green",
                }}
                handleClick={handleClick}
                background={eftposBgBtn[1]}
              />
            </div>
          </div>
        ) : transactionmsg === "Transaction Failed" ? (
          <>
            <div
              className={`flex justify-center ${
                localStorage.getItem("merchant_receipt") ? "items-center" : ""
              } gap-2 py-6 w-full`}
            >
              {/* Left Section - Failed Transaction Message */}
              <div className="w-1/3">
                <div className="flex justify-center mb-4">
                  <FaTimesCircle
                    className="text-red-500 text-5xl mb-4"
                    style={bounceStyle}
                  />
                </div>
                <h1 className="text-red-500 text-4xl font-bold mb-2">FAILED</h1>
                <h2 className="text-lg font-semibold mb-2 text-white">
                  {hostResponseText}
                </h2>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button
                    item="Retry"
                    className="bg-yellow-500 text-black px-6 py-4 rounded-lg hover:bg-yellow-600 mx-2"
                    style={{ backgroundColor: "#ECC94B" }}
                    handleClick={handleRetryTransaction}
                    background={eftposBgBtn[4]}
                  />
                  <Button
                    item="Cancel"
                    className="bg-gray-300 text-black px-6 py-4 rounded-lg hover:bg-gray-400 mx-2"
                    style={{ backgroundColor: "#E2E8F0" }}
                    handleClick={() => {
                      localStorage.removeItem("transactionMessage");
                      dispatch(setTransactionState(false));
                      onClose();
                    }}
                    background={eftposBgBtn[3]}
                  />
                </div>
              </div>

              {/* Right Section - Receipts */}
              <div className="w-2/3 flex justify-center gap-4">
                {/* Merchant Receipt */}
                <div className="h-[464px] w-[275px]">
                  <p className="font-semibold text-white">Merchant Receipt</p>
                  <div className="border h-40v text-xs bg-white text-black overflow-y-auto mt-1 p-2 rounded-md">
                    <pre className="text-xs">
                      {localStorage.getItem("merchant_receipt") ||
                        "No merchant receipt available"}
                    </pre>
                  </div>
                </div>

                {/* Customer Receipt */}
                <div className="h-[464px] w-[275px]">
                  <p className="font-semibold text-white">Customer Receipt</p>
                  <div className="border h-40v text-xs bg-white text-black overflow-y-auto mt-1 p-2 rounded-md">
                    <pre className="text-xs">
                      {localStorage.getItem("customer_receipt") ||
                        "No customer receipt available"}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {awaitingSignatureCheck && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-[#8DA5AA] p-5 border-2 border-black rounded-lg shadow-lg max-w-lg w-full flex">
              {/* Left Section - Confirmation Message */}
              <div className="bg-[#4F5E69] p-8 rounded-md w-1/2 text-center text-white">
                <div className="flex justify-center items-center mb-4">
                  <div className="bg-yellow-100 text-yellow-500 rounded-full p-3">
                    <PiWarningCircle className="text-2xl" />
                  </div>
                </div>
                <h3 className="text-lg text-white font-medium mb-2">
                  Confirm customer signature
                </h3>
                <p className="text-sm text-white mb-6">
                  Does the customer's signature match the signature on the card?
                </p>
                <div className="flex justify-center space-x-4">
                  <Button
                    item="Yes"
                    style={{ backgroundColor: "green" }}
                    handleClick={() => handleSignatureCheck(true)}
                    background={eftposBgBtn[1]}
                  />
                  <Button
                    item="No"
                    style={{ backgroundColor: "red" }}
                    handleClick={() => handleSignatureCheck(false)}
                    background={eftposBgBtn[0]}
                  />
                </div>
              </div>

              {/* Right Section - Signature Receipt */}
              <div className="bg-white text-black p-4 rounded-md w-1/2 text-xs overflow-auto">
                <strong>Signature Receipt:</strong>
                <pre className="whitespace-pre-wrap text-[10px]">
                  {localStorage.getItem("SignatureReceipt") ||
                    "No receipt available"}
                </pre>
              </div>
            </div>
          </div>
        )}

        {manualRecovery && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-[#8DA5AA] p-5 border-2 border-black rounded-lg shadow-lg max-w-sm w-full text-center">
              <div className="bg-[#4F5E69] p-8 rounded-md max-w-sm w-full text-center text-white">
                <div className="flex justify-center items-center mb-4">
                  <div className="bg-yellow-100 text-yellow-500 rounded-full p-3">
                    <PiWarningCircle className="text-2xl" />
                  </div>
                </div>
                <h3 className="text-lg text-white font-medium mb-2">
                  Unknown transaction status
                </h3>
                <p className="text-sm text-white mb-6">
                  Was the transaction successful on the Eftpos terminal?
                </p>
                <div className="flex justify-center space-x-4">
                  <Button
                    item="Yes"
                    style={{
                      backgroundColor: "green",
                    }}
                    handleClick={() => handleManualRecovery(true)}
                    background={eftposBgBtn[1]}
                  />
                  <Button
                    item="No"
                    style={{
                      backgroundColor: "red",
                    }}
                    handleClick={() => handleManualRecovery(false)}
                    background={eftposBgBtn[0]}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cardpayment;
