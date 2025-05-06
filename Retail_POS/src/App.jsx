import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SITE_CONFIG from "../controller";
import { Home } from "./pages/Home/Home";
import Reports from "./pages/Reports/Reports";
import { DailySummary } from "./pages/Reports/ChildComponents/DailySummary";
import { HoldReport } from "./pages/Reports/ChildComponents/HoldReport";
import { ItemsSaleReport } from "./pages/Reports/ChildComponents/ItemsSaleReport";
import { CategorySaleReport } from "./pages/Reports/ChildComponents/CategorySaleReport";
import { DailyExpenses } from "./pages/Reports/ChildComponents/DailyExpenses";
import { HourlyReport } from "./pages/Reports/ChildComponents/HourlyReport";
import BarcodeProducts from "./pages/BarcodeProducts/BarcodeProducts";
import { sendMessage, socket } from "./app/driverConnection";
import { clearPosData, setPosData } from "./feature/posDataSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Setting from "./pages/Setting/setting";
import About from "./pages/Setting/About";
import Terminal from "./pages/Setting/Terminal";
import Transaction from "./pages/Setting/TransactionHistory/Transaction";
import PairingUI, { handlePair, spi, unpair } from "./pages/Setting/PairingUI";
import Terminaldetail from "./pages/Setting/Terminaldetail";

function App() {
  const[unPaired,setUnpaired]=useState(true)
  const url = {
    home: `${SITE_CONFIG.basePath}`,
    report: `${SITE_CONFIG.basePath}/reports`,
    "daily-summary": `daily-summary`,
    hold: `hold`,
    "items-sale": `items-sale`,
    category: `category`,
    "daily-exp": `daily-exp`,
    hourly: `hourly`,
    barcode: `${SITE_CONFIG.basePath}/barcodeproducts`,
    setting: `${SITE_CONFIG.basePath}/setting`,
    about: "about",
    transaction: "transaction",
    terminal_setting: "terminal",
    pairing: "pairing",
    terminaldetail: "terminaldetail/:id",
    // about: `${SITE_CONFIG.basePath}/about`,
    // terminal_setting: `${SITE_CONFIG.basePath}/teerminalsetting`
  };
  const dispatch = useDispatch();

  useEffect(() => {
    // Function to handle incoming messages
    const handlePosData = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "posdata") {
        if (data && data.success) {
          dispatch(setPosData(data.data));
        } else {
          dispatch(clearPosData());
          console.error("Error:", data.message);
          toast.error(data.message); // Display error message
        }
      }
    };

    // Function to handle disconnects
    const handleDisconnect = () => {
      dispatch(clearPosData());
    };

    // // Request position data
    // if(socket.readyState === WebSocket.OPEN){
    //   sendMessage({ command: "getposdata" })
    // }

    // Add event listeners for incoming messages and disconnects
    socket.addEventListener("message", handlePosData);
    socket.addEventListener("close", handleDisconnect);

    // Cleanup function to remove event listeners
    return () => {
      socket.removeEventListener("message", handlePosData);
      socket.removeEventListener("close", handleDisconnect);
    };
  }, [socket]);

  
  useEffect(() => {    
    let storedTerminalStatus = localStorage.getItem("terminalStatus") || "";
    let storedTerminalsData =
      JSON.parse(localStorage.getItem("pairingDetails")) || "";
    let ipAddress = localStorage.getItem("eftposAddress") || "";

    if (storedTerminalStatus === "PairedConnected") {
      localStorage.setItem("terminalStatus", "PairedConnecting");

      if (storedTerminalsData) {
        const props = {
          pos_id: storedTerminalsData.pos_id,
          serial_number: storedTerminalsData.serial_number,
          testMode: storedTerminalsData.testMode,
          tenantCode: storedTerminalsData.payment_provider,
          ip_address: ipAddress,
        };

        localStorage.setItem("tenantCode", storedTerminalsData.payment_provider);
        // if (storedTerminalStatus === "PairedConnecting") {
          handlePair(props);
        // }
      }
    }

    
  }, []);

  setInterval(()=>{
    if(!(localStorage.getItem("tenantCode")) && unPaired){
      // console.log("HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
      
      // spi.Unpair()
      unpair()
      setUnpaired(false)
      localStorage.removeItem("terminalStatus")
    }
    else{
      setUnpaired(true)
    }
  },1000)

  

  return (
    <>
      <Router>
        <Routes>
          <Route path={url.home} element={<Home />} />
          <Route path={url.report} element={<Reports />}>
            <Route index element={<Navigate to={url["daily-summary"]} />} />
            <Route path={url["daily-summary"]} element={<DailySummary />} />
            <Route path={url.hold} element={<HoldReport />} />
            <Route path={url["items-sale"]} element={<ItemsSaleReport />} />
            <Route path={url.category} element={<CategorySaleReport />} />
            <Route path={url["daily-exp"]} element={<DailyExpenses />} />
            <Route path={url.hourly} element={<HourlyReport />} />
          </Route>
          <Route path={url.barcode} element={<BarcodeProducts />} />

          <Route path={url.setting}>
            <Route index element={<Setting />} />
            <Route path={url.about} element={<About />} />
            <Route path={url.transaction} element={<Transaction />} />

            <Route path={url.terminal_setting}>
              <Route index element={<Terminal />} />
              <Route path={url.pairing} element={<PairingUI />} />
              <Route path={url.terminaldetail} element={<Terminaldetail />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
