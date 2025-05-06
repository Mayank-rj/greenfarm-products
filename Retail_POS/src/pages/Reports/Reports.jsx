// import * as XLSX from 'xlsx'
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import "../Reports/Report.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import { Outlet, useNavigate } from "react-router";
import { ReportHeader } from "./ReportHeader/ReportHeader";
import { sendMessage } from "../../app/driverConnection";

export default function Report() {
  const excelData = useSelector((state) => state.excelData.data);
  const excelName = localStorage.getItem("activeButton")
  const dispalyButtons = [
    "Export",
    "Daily Summary",
    "Hold",
    "Items Sale",
    "Category",
    "Daily Exp",
    "Hourly",
    "Z-Print",
  ];
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startHourlyTime, setStartHourlyTime] = useState(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  });
  const [endHourlyTime, setEndHourlyTime] = useState(new Date());
  const [width, setWidth] = useState({ width: "30%" });
  const [activeButton, setActiveButton] = useState(
    localStorage.getItem("activeButton") || "Daily Summary"
  );
  const zprintData = useSelector((state) => state.zprintData);
  // console.log(zprintData);
  
  const dispatch = useDispatch();

  const dataToSend = {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    startHourlyTime,
    endHourlyTime,
  };
  // console.log(startHourlyTime,
  //   endHourlyTime,);

  const navigate = useNavigate();

  //redirect to same page when page is loaded
  useEffect(() => {
    const route = location.pathname.split("/").pop();
    const active = route.replace("-", " ").toUpperCase();
    setActiveButton(active);
    localStorage.setItem("activeButton", active);
    if (route !== "export" && route !== "Z-Print") {
      navigate(`/retailpos/reports/${route}`);
    }
  }, [location, navigate]);

  const handleClose = () => {
    setOpenModal(false);
    setModalContent(null);
  };
  // console.log(excelData);
  // console.log(excelName);

  const exportToExcel = () => {
    // console.log(dataToSend);
    const ws = XLSX.utils.json_to_sheet([]);
  
    // Add the startDate and endDate as headers
    if (excelName === "HOURLY") {
      XLSX.utils.sheet_add_aoa(ws, [
        ["Start Hourly Time:", new Date(startHourlyTime).toLocaleString()],
        ["End Hourly Time:", new Date(endHourlyTime).toLocaleString()],
        [], // Blank row for separation
      ]);
    } else {
      XLSX.utils.sheet_add_aoa(ws, [
        ["Start Date:", startDate.toLocaleDateString()],
        ["End Date:", endDate.toLocaleDateString()],
        [], // Blank row for separation
      ]);
    }
    // Add the data to the worksheet
    XLSX.utils.sheet_add_json(ws, excelData, { origin: -1 });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${excelName}.xlsx`);
    handleClose();
  };

  const exportToPDF = () => {
    const unit = 'pt';
    const size = 'A4';
    const orientation = 'landscape';
    const doc = new jsPDF(orientation, unit, size);
    
    // Adding the date and time in the PDF
    if (excelName === "HOURLY") {
      doc.text(`Start Hourly Time: ${new Date(startHourlyTime).toLocaleString()}`, 20, 30);
      doc.text(`End Hourly Time: ${new Date(endHourlyTime).toLocaleString()}`, 20, 50);
    } else {
      doc.text(`Start Date: ${startDate.toLocaleDateString()}`, 20, 30);
      doc.text(`End Date: ${endDate.toLocaleDateString()}`, 20, 50);
    }
  
    // Add blank line for separation
    doc.text('', 20, 70);
  
    // Adding table content (from the HTML table with id `#my-table`)
    doc.autoTable({ html: '#my-table', startY: 80 });
  
    // Save the PDF
    doc.save(`${excelName}.pdf`);
    handleClose();
  }
  

  // Buttons Funcionality =========>

  const handleClick = async (e) => {
    const buttonName = e.target.innerText;
    if (buttonName === "EXPORT") {
      // setIsModalOpen(true);
      setOpenModal(!openModal);
      setWidth({ width: "30%" });
      setModalContent(
        <div className="export_popup">
          <h1>Download Excel or Pdf file</h1>
          <div>
            <Button item={"EXCEL"} handleClick={exportToExcel} />
            <Button item={"PDF"} handleClick={exportToPDF} />
          </div>
        </div>
      );
    } else if (buttonName === "Z-PRINT") {
      handlezPrint();
    } else {
      setActiveButton(buttonName);
      const route = buttonName.toLowerCase().replace(/\s+/g, "-");
      navigate(`${route}`);
    }
  };

  const handlezPrint = async () => {
    sendMessage({
      command: "zprint",
      data: zprintData,
    })
  };

  return (
    <>
      <div className="report-container">
        <div className="main-field">
          <div className="table-field">
            <ReportHeader
              activeButton={activeButton}
              setFromDate={setStartDate}
              setToDate={setEndDate}
              setStartHourlyTime={setStartHourlyTime}
              setEndHourlyTime={setEndHourlyTime}
              fromDate={startDate}
              toDate={endDate}
            />
            <Outlet context={dataToSend} />
          </div>
          <div className="btn-box">
            {dispalyButtons.map((btn, index) => (
              <Button
                key={index}
                item={btn.toUpperCase()}
                handleClick={handleClick}
                background={
                  activeButton === btn ? { backgroundColor: "gray" } : {}
                }
              />
            ))}
          </div>
        </div>
        {openModal && (
          <Modal isOpen={openModal} onClose={handleClose} width={width}>
            {modalContent}
          </Modal>
        )}
      </div>
    </>
  );
}
