import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../../components/Button/Button";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { spiConfiguration } from "../../SPI/spiconfig";
import { unpair } from "./PairingUI";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import SettingsPin from "./SettingsPin";
import SITE_CONFIG from "../../../controller";

function Terminal() {
  const navigate = useNavigate();
  const[terminalDetails,setterminalDetails]=useState("")
  const isAuthenticated = useSelector((state)=> state.settingsAuth.isAuthenticated)
  const [dropdownVisible, setDropdownVisible] = useState(false); // To track the currently open dropdown
  // const terminalData =
  //   JSON.parse(localStorage.getItem("terminalDetails")?.meesage) || {};
  // const terminalDetails = terminalData?.message;
  const pairingDetails= JSON.parse(localStorage.getItem("pairingDetails")) || {};
  const actionsRef = useRef(null);
  const eftposAddress = localStorage.getItem("eftposAddress");
  const [message, setMessage] = useState("");

  // spi = spiConfiguration();

  // console.log(terminalDetails);

  const handleCreateNewButton = () => {
    navigate("pairing");
  };

  const handleBackButton = () => {
    navigate(`/${SITE_CONFIG.basePath}/setting`);
  };
  

  const handlepairTerminal = async (data) => {
    navigate(`pairing`, {
      state: { eftposData: data },
    });
  };

  // Function to handle unpairing the terminal
  // const handleUnpairTerminal = (index) => {
  //   const updatedEftposData = [...eftposData];
  //   updatedEftposData[index].pairing_status = "Unpaired";
  //   setEftposData(updatedEftposData);
  //   setDropdownVisible(null); // Close the dropdown after action
  // };

  const handleUnpairTerminal = async (_id) => {
    unpair();
  };


  const handleViewTerminalDetails = async () => {
    // console.log(data);
    navigate(`terminaldetail/term?${pairingDetails?.serial_number}`);
  };


  const handleRemoveTerminal = (serial_number) => {
    unpair();
    // const terminalsData =
    //   JSON.parse(window.localStorage.getItem("terminalDetails")) || [];
    // const updatedData = terminalsData.filter(
    //   (terminal) => terminal.data.serial_number !== serial_number
    // );
    // window.localStorage.setItem("terminalsData", JSON.stringify(updatedData));
    toast.success("Terminal removed successfully!");
    localStorage.removeItem("terminalDetails")
    localStorage.removeItem("terminalsData")
    localStorage.removeItem("eftposAddress")
    localStorage.removeItem("terminalStatus")
    localStorage.removeItem("secrets")
    localStorage.removeItem("tenantCode")

    // localStorage.setItem("tenantCode", "payment_pr");
    // setShowActions(null);
  };

  useEffect(() => {
    const updateStatus = () => {
      const message = window.localStorage.getItem("terminalStatus");
      setMessage(message);
      if(localStorage.getItem("terminalDetails")){
      setterminalDetails(JSON.parse(localStorage.getItem("terminalDetails"))?.message)
      // console.log("hiiii")
      }
    };
    // console.log(message);

    const intervalId = setInterval(updateStatus, 1000);
    updateStatus();

    return () => clearInterval(intervalId);
  }, [message]);

  // console.log(message.length);
  

  const handleAboutThisTerminal = (terminal) => {
    alert(
      `POS ID: ${terminal.pos_id}\nEFTPOS Address: ${terminal.eftpos_address}\nSerial Number: ${terminal.serial_number}`
    );
    setDropdownVisible(null);
  };

  const handleClickOutside = (event) => {
    if (actionsRef.current && !actionsRef.current.contains(event.target)) {
      setDropdownVisible(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <SettingsPin />
    );
  }
  return (
    <div className="flex flex-col items-center relative h-screen p-6 bg-gray-600">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button
              item="Back To POS Settings"
              handleClick={handleBackButton}
            />
          </div>
          <div className="flex-grow text-center">
            <h1 className="text-3xl text-white font-semibold">TERMINAL</h1>
          </div>
        {!message&& (<Button
            item="Pair new terminal"
            icon={faPencilAlt}
            handleClick={handleCreateNewButton}
          />)}
        </div>
        

        {/* Table */}
        <div className="bg-white rounded-lg shadow-lg">
          <table className="w-full table-auto relative">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-sm font-bold text-black">
                  POS ID
                </th>
                <th className="px-4 py-2 text-left text-sm font-bold text-black">
                  Pairing status
                </th>
                <th className="px-4 py-2 text-left text-sm font-bold text-black">
                  EFTPOS address
                </th>
                <th className="px-4 py-2 text-left text-sm font-bold text-black">
                  Serial number
                </th>
                <th className="px-4 py-2 text-left text-sm font-bold text-black">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {terminalDetails && (
                <tr>
                  <td className="px-4 py-2 text-sm font-semibold text-gray-700">
                    {terminalDetails.pos_id}
                  </td>
                  <td className="px-4 py-2 text-sm text-yellow-500">
                    <span
                      className={` px-2 py-1 rounded-full ${
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
                        ? "Pairing..."
                        : "Unpaired"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm font-semibold text-gray-700">
                    {eftposAddress || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-sm font-semibold text-gray-700">
                    {terminalDetails.data?.serial_number || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-sm font-semibold text-gray-700">
                    <button
                      className="text-indigo-600 hover:text-indigo-800"
                      onClick={() => setDropdownVisible(!dropdownVisible)}
                    >
                      Actions
                    </button>
                    {dropdownVisible && (
                      <div
                         ref={actionsRef}
                        className="absolute right-0 mt-1 w-48 bg-gray-100 rounded-lg shadow-lg z-10 border-solid border-1 border-indigo-600"
                      >
                        <div className="py-2 ">
                          {message === "Unpaired" && (
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                              onClick={() =>
                                handlepairTerminal(pairingDetails)
                              }
                            >
                              pair terminal
                            </button>
                          )}
                          {message === "PairedConnected" && (
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                              onClick={() =>
                                handleUnpairTerminal(
                                  terminalDetails.data?.serial_number
                                )
                              }
                            >
                              Unpair terminal
                            </button>
                          )}
                          {message === "PairedConnecting" && (
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                              onClick={() =>
                                handleUnpairTerminal(
                                  terminalDetails.data?.serial_number
                                )
                              }
                            >
                              Unpair terminal
                            </button>
                          )}

                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                            onClick={() =>
                              handleRemoveTerminal(
                                terminalDetails.data?.serial_number
                              )
                            }
                          >
                            Remove terminal
                          </button>

                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                            onClick={() =>
                              handleViewTerminalDetails( terminalDetails.data?.serial_number)
                            }
                          >
                            About this terminal
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Terminal;
