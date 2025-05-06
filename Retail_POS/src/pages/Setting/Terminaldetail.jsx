import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
// import { useNavigate } from "react-router-dom";
// import { unpair } from "../../../SPI/pairing";
// import { unpair } from "./PairingUI";
import { toast } from "react-toastify";
import { unpair } from "./PairingUI";
import SITE_CONFIG from "../../../controller";

import { IoMdArrowRoundBack } from "react-icons/io";
import Button from "../../components/Button/Button";
import { eftposBgBtn } from "../../assets/btn-bg";
// import { useSelector } from "react-redux";


const Terminaldetail = () => {
    const { serial_number } = useParams();
   const navigate = useNavigate();
  const [message, setMessage] = useState("");
  // const [terminalBettryStatus, setTerminalBettryStatus] = useState("");
  const eftposAddress = localStorage.getItem("eftposAddress");
  useEffect(() => {
    const updateStatus = () => {
      const msg = window.localStorage.getItem("terminalStatus");
    //   const battery_level = window.localStorage.getItem("terminalBettryStatus");
      // console.log(battery_level)
      setMessage(msg);
    //   setTerminalBettryStatus(battery_level);
    };

    const intervalId = setInterval(updateStatus, 1000);
    updateStatus();

    return () => clearInterval(intervalId);
  }, []);

  const terminaldetails =
    (JSON.parse(window.localStorage.getItem("terminalDetails")).message) || [];
    const pairingDetails= (JSON.parse(window.localStorage.getItem("pairingDetails"))) || [];

    const terminalBettryStatus=JSON.parse(window.localStorage.getItem("terminalData")).Data.battery_level

    const payment_provider=JSON.parse(window.localStorage.getItem("pairingDetails")).payment_provider

    console.log(pairingDetails);

    // const terminaldetails = existingData.serial_number === serial_number;

    
 



  // console.log(terminaldetails);

  const handlepairTerminal = async () => {
    // console.log(terminaldetails);
    navigate(`/${SITE_CONFIG.basePath}/setting/terminal/pairing`,{state :{eftposData:pairingDetails}});
  };

  const handleUnpairTerminal = () => {
    unpair();
    // let TerminalStatus = localStorage.getItem("terminalStatus");
    // TerminalStatus = "Unpaired";
    // localStorage.setItem("terminalStatus", TerminalStatus);
    // navigate(-1);
  };

console.warn(terminaldetails);


  if (!terminaldetails) {
    return <div>No terminal details available.</div>;
  }

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };



//   if (!isAuthenticated) {
//     return <LockScreen />;
//   }
  return (
    <div className=" bg-gray-600 text-black relative h-[100vh] p-6 ">
      <div className="relative bg-white mx-auto rounded-2xl shadow-md w-full max-w-4xl p-6 top-[50%] translate-y-[-50%] ">
        <div className="flex justify-between ">
          <h1 className="text-xl font-semibold mb-4">About this terminal</h1>
          <div>
             {/* <button
              onClick={handleBackClick}
              className="flex justify-center items-center bg-gray-300  px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              <IoMdArrowRoundBack /> Back
            </button>  */}
            <Button
                    item="Back"
                    style={{
                      backgroundColor: "gray",
                      color: "white"
                    }}
                    handleClick={()=> handleBackClick()}
                    background={eftposBgBtn[3]}
                  />
          </div>
        </div>

        <p className=" mb-2">
          View information about this terminal and the pairing configuration
        </p>

        {/* Terminal Information Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Terminal information</h2>
          <p className="text-sm mb-2">
            Information about this terminal
          </p>

          <div className="flex justify-between items-center mb-2">
            <div>
              <p
                className={`  px-2 py-1 rounded-full font-medium text-sm ${
                  message === "PairedConnected"
                    ? "bg-green-300 text-black"
                    : message === "PairedConnecting"
                    ? "bg-yellow-200 text-black"
                    : "bg-red-300 text-white"
                }`}
              >
                {message === "PairedConnected"
                  ? "Connected"
                  : message === "PairedConnecting"
                  ? "Paired but trying to connect"
                  : "Unpaired"}
              </p>
              <p className=" text-sm">Not Ready</p>
            </div>
            <div>
              <button
                className={`text-blue-600 font-bold text-sm hover:underline ${
                  message === "PairedConnecting" ? "cursor-default" : ""
                }  `}
                onClick={
                  message !== "PairedConnected"
                    ? handlepairTerminal
                    : handleUnpairTerminal
                }
                disabled={message === "PairedConnecting"}
              >
                {message === "PairedConnected"
                  ? "Unpair terminal"
                  : message === "PairedConnecting"
                  ? "Connecting"
                  : "pair terminal  "}
              </button>
            </div>
          </div>

          {/* Terminal Details */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="">Merchant ID</p>
              <p>{terminaldetails.data.merchant_id}</p>
            </div>
            <div>
              <p className="">Terminal ID</p>
              <p>{terminaldetails.data.terminal_id}</p>
            </div>
            <div>
              <p className="">Serial number</p>
              <p>{pairingDetails.data.serial_number}</p>
            </div>
            <div>
              <p className="">Battery</p>
              <p>{terminalBettryStatus}%</p>
            </div>
          </div>
        </div>

        {/* Pairing Configuration Section */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Pairing configuration</h2>
          <p className="text-sm  mb-2">
            To update the Pairing configuration you need to unpair this terminal
            using the Unpair button above
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="">Payment provider</p>
              <p>{payment_provider}</p>
            </div>
            <div>
              <p className="">POS ID</p>
              <p>{pairingDetails.pos_id}</p>
            </div>
            {/* {terminaldetails[0].payment_provider === "other" && (
              <div>
                <p className="text-gray-500">Other provider</p>
                <p>{terminaldetails[0].other_provider}</p>
              </div>
            )} */}
            <div>
              <p className="">EFTPOS address</p>
              <p>{eftposAddress}</p>
            </div>
            <div>
              <p className="">Configuration option</p>
              <p>Yes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminaldetail;
