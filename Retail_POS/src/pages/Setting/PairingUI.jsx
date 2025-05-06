import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Button from "../../components/Button/Button";
import "../../components/Button/Button.css";
import { restCatogeryBgBtn } from "../../assets/btn-bg";
import { Spi as SpiClient } from "@mx51/spi-client-js";
// import { spiConfiguration } from "../../SPI/spiconfig";
import { spiEventFunctions } from "../../SPI/event";
import { toast } from "react-toastify";
import SITE_CONFIG from "../../../controller";

export let spi;

var spiSecrets = JSON.parse(window.localStorage.getItem("secrets"));

export const spiSettings = {
  posVendorId: "Green FARM PRODUCTS", // your POS company name/id
  posVersion: `${SITE_CONFIG.POS_VERSION}`, // your POS version
  deviceApiKey: "M9Mg8DNcm031PEnwB8iMuLB1lP6bZP3r", // ask the integration support team for your API key
  countryCode: "AU", // if unsure check with integration support team
  secureWebSockets: window.location.protocol === "https:" ? true : false, // checks for HTTPs
  printMerchantCopyOnEftpos: true, // prints merchant receipt from terminal instead of POS
  promptForCustomerCopyOnEftpos: true, // prints customer receipt from terminal instead of POS
  signatureFlowOnEftpos: false, // signature flow and receipts on terminal instead of POS
  merchantReceiptHeader: "Green FARM PRODUCTS", // custom text to be added to merchant receipt header
  merchantReceiptFooter: "THANK YOU", // custom text to be added to merchant receipt footer
  customerReceiptHeader: "Green FARM PRODUCTS", // custom text to be added to customer receipt header
  customerReceiptFooter: "THANK YOU", // custom text to be added to customer receipt footer
};

// Get the available tenants before pairing
SpiClient.GetAvailableTenants(
  spiSettings.countryCode,
  spiSettings.posVendorId,
  spiSettings.deviceApiKey
).then(({ Data: tenants }) => {
  // console.log();
  // store the list of tenants
  localStorage.setItem("tenants", JSON.stringify(tenants));
  // store the desired tenant code
  window.localStorage.getItem("tenantCode") ||
    localStorage.setItem("tenantCode", "payment_pr");
});

export function unpair() {
  if (!spi) return;

  const d2 = spi.AckFlowEndedAndBackToIdle();
  // console.log(d2)
  spi.Unpair();
  // console.log("d3")

  location.reload();

  localStorage.removeItem("eventMessage");
  // console.log("d4")
  toast.success("UnPaired Successfully!");
}

export let handlePair = async (paringDetails) => {
  console.log(paringDetails);
  const pairingInput = {
    autoAddressResolution: true,
    posId: paringDetails.pos_id,
    tenantCode: paringDetails.tenantCode,
    serialNumber: paringDetails.serial_number,
    eftposAddress: paringDetails.ip_address || "192.168.1.13",
    testMode: paringDetails.testMode,
  };
  spi = new SpiClient(
    pairingInput.posId,
    pairingInput.serialNumber,
    pairingInput.eftposAddress,
    spiSecrets
  );
  // console.log(paringDetails.serial_number);

  spi.SetTenantCode(paringDetails.tenantCode); // Update with actual tenant code
  spi.SetDeviceApiKey(spiSettings.deviceApiKey);
  spi.SetPosInfo(spiSettings.posVendorId, spiSettings.posVersion);

  spi.SetTestMode(paringDetails.testMode);

  spi.SetAutoAddressResolution(true);

  try {
    await spi.Start();
    await spi.Pair();
    // console.log(spi);
  } catch (error) {
    console.error(error);
  }
  // console.log("EVENT FUNCTION START");
  spiEventFunctions();
};

function PairingUI() {
  const location = useLocation();
  const { eftposData } = location.state || {};
  const [paymentInfo, setPaymentInfo] = useState({
    payment_provider: window.localStorage.getItem("tenantCode") || "payment_pr",
    pos_id: "",
    serial_number: "",
    other_provider: "",
    isAutoAddressMode: true,
    ip_address: localStorage.getItem("eftposAddress") || "",
    testMode: false, //true in testing environment
  });
  const [errors, setErrors] = useState({
    payment_provider: "",
    pos_id: "",
    serial_number: "",
    other_provider: "",
    ip_address: "",
  });

  const navigate = useNavigate();

  const [pairingStatus, setPairingStatus] = useState("unpaired");
  const [pairingMessage, setPairingMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBackButton = () => {
    navigate(`/${SITE_CONFIG.basePath}/setting/terminal`);
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    // Determine the value based on the type of input
    const inputValue = type === "checkbox" ? checked : value;

    // console.log("Checking", inputValue);

    if (name === "payment_provider" || name === "other_provider") {
      let storedTenantCode = localStorage.getItem("tenantCode");
      // paymentInfo.payment_provider=inputValue
      storedTenantCode = inputValue;
      // console.log(storedTenantCode);
      localStorage.setItem("tenantCode", storedTenantCode);
    }

    setPaymentInfo((prev) => {
      const newPaymentInfo = {
        ...prev,
        [name]: inputValue,
      };
      // testing environtment test mode will be true and false for gko
      //vice versa for production environment
      if (name === "payment_provider" && value !== "other") {
        newPaymentInfo.other_provider = "";
      }

      if (
        (name === "payment_provider" && value === "gko") ||
        (name === "other_provider" && value.toLowerCase() === "gko")
      ) {
        newPaymentInfo.testMode = false;
      } else if (name === "testMode") {
        // newPaymentInfo.testMode = checked;
        newPaymentInfo.testMode = false;
      } else if (name === "payment_provider" || name === "other_provider") {
        // newPaymentInfo.testMode = true;
        newPaymentInfo.testMode = false;
      }

      if (newPaymentInfo.isAutoAddressMode) {
        newPaymentInfo.ip_address = "";
      }

      // console.log(paymentInfo);

      return newPaymentInfo;
    });

    setErrors({ ...errors, [name]: "" });
  };

  // spi = spiConfiguration();

  const handlePairClick = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    localStorage.setItem("pairingDetails", JSON.stringify(paymentInfo));

    let paringDetails = {
      pos_id: paymentInfo.pos_id,
      serial_number: paymentInfo.serial_number,
      testMode: paymentInfo.testMode,
      tenantCode:
        paymentInfo.payment_provider === "other"
          ? paymentInfo.other_provider
          : paymentInfo.payment_provider,
      ip_address: paymentInfo.ip_address,
    };
    console.log(paymentInfo);

    handlePair(paringDetails);
    setPairingStatus("pairing");
  };

  useEffect(() => {
    const updateStatus = () => {
      const msg = window.localStorage.getItem("eventMessage");
      setPairingMessage(msg);
    };

    const intervalId = setInterval(updateStatus, 1000);
    updateStatus();

    return () => clearInterval(intervalId);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    const {
      payment_provider,
      pos_id,
      serial_number,
      ip_address,
      isAutoAddressMode,
      eftpos_address,
      other_provider, // Add this
    } = paymentInfo;

    if (!payment_provider) {
      newErrors.payment_provider = "Payment provider is required";
    }

    if (payment_provider === "payment_pr") {
      newErrors.payment_provider = "Please choose coorect payment provider";
    }

    if (payment_provider === "other" && !/^[A-Za-z]{3}$/.test(other_provider)) {
      newErrors.other_provider =
        "Provider code must be exactly 3 alphabetic characters.";
    }

    if (!pos_id) {
      newErrors.pos_id = "POS ID is required";
    } else if (pos_id.length > 16) {
      newErrors.pos_id = "POS ID cannot be longer than 16 characters";
    } else if (/[^a-zA-Z0-9-]/.test(pos_id)) {
      newErrors.pos_id =
        "POS ID can only contain alphanumeric characters and hyphens (-)";
    }

    if (!serial_number) {
      newErrors.serial_number = "Serial Number is required";
    } else if (/[^0-9-]/.test(serial_number)) {
      newErrors.serial_number =
        "Serial Number can only contain numbers and hyphens (-)";
    }

    const ipPattern =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (!paymentInfo.isAutoAddressMode && !ip_address) {
      newErrors.ip_address = "IP address field cannot be blank";
    }

    console.log(paymentInfo.isAutoAddressMode);

    if (ip_address && !ipPattern.test(ip_address)) {
      newErrors.ip_address = "Invalid IP address format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancelClick = () => {
    setPairingStatus("unpaired");
    spi.PairingCancel();
    // location.reload();
    localStorage.removeItem("eventMessage");
  };

  const handleOkClick = () => {
    localStorage.removeItem("eventMessage");
    navigate(-1);
  };

  useEffect(() => {
    if (eftposData) {
      const pairingDetails = JSON.parse(localStorage.getItem("pairingDetails"));
      // console.log(pairingDetails)
      setPaymentInfo((prevInfo) => ({
        ...prevInfo,
        payment_provider:
          pairingDetails.payment_provider || prevInfo.payment_provider,
        other_provider:
          pairingDetails.other_provider || prevInfo.other_provider,
        pos_id: eftposData.pos_id || "",
        serial_number: eftposData.serial_number || "",
        ip_address: eftposData.ip_address || "",
        isAutoAddressMode: !eftposData.ip_address
          ? prevInfo.isAutoAddressMode
          : false,
        testMode:
          pairingDetails.payment_provider === "gko" ||
          pairingDetails.other_provider === "gko"
            ? false
            : prevInfo.testMode,
      }));
      // console.log(eftposData)
      localStorage.setItem("tenantCode", eftposData.other_provider);
    }
  }, [eftposData]);

  useEffect(() => {
    if (paymentInfo.isAutoAddressMode) {
      setErrors({ ...errors, ip_address: "" });
    } else {
      setErrors({ ...errors, ip_address: "IP address field cannot be blank" });
    }
  }, [paymentInfo.isAutoAddressMode]);

  return (
    <div className="flex items-center justify-center relative h-screen bg-gray-600">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
        {pairingStatus === "unpaired" && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">PAIRING CONFIGURATION</h2>
              <Button item="Back To Terminal" handleClick={handleBackButton} />
            </div>
            <form onSubmit={handlePairClick}>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Payment provider
                </label>
                <select
                  name="payment_provider"
                  value={paymentInfo.payment_provider}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option
                    value="payment_pr"
                    disabled={!!paymentInfo.payment_provider}
                  >
                    Payment Provider
                  </option>
                  <option value="cba">CommBank Smart</option>
                  <option value="fisvau">Fiserv Australia</option>
                  <option value="gko">Gecko Demo Bank</option>
                  <option value="next">Next Payments</option>
                  <option value="till">Till Payments</option>
                  <option value="wbc">Westpac Presto</option>
                  <option value="other">Other</option>
                </select>
                {errors.payment_provider && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.payment_provider}
                  </p>
                )}
              </div>

              {paymentInfo.payment_provider === "other" && (
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Other Payment Provider
                  </label>
                  <input
                    name="other_provider"
                    type="text"
                    value={paymentInfo.other_provider || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                  {errors.other_provider && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.other_provider}
                    </p>
                  )}
                </div>
              )}

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  POS ID
                </label>
                <input
                  name="pos_id"
                  type="text"
                  value={paymentInfo.pos_id}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {errors.pos_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.pos_id}</p>
                )}
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Eftpos Serial Number
                </label>
                <input
                  name="serial_number"
                  type="text"
                  placeholder="Enter Serial Number"
                  // pattern="[0-9]{3}-[0-9]{3}-[0-9]{3}"
                  value={paymentInfo.serial_number}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {errors.serial_number && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.serial_number}
                  </p>
                )}
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  IP Address
                </label>
                <input
                  name="ip_address"
                  type="text"
                  value={paymentInfo.ip_address}
                  onChange={handleChange}
                  disabled={paymentInfo.isAutoAddressMode}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                {errors.ip_address && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.ip_address}
                  </p>
                )}
              </div>

              <div className="mb-2 flex items-center">
                <input
                  name="isAutoAddressMode"
                  type="checkbox"
                  checked={paymentInfo.isAutoAddressMode}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded mr-2"
                />
                <span className="text-sm text-gray-700">Auto Address Mode</span>
              </div>
              {/*<div className="mb-2 flex items-center">
                <input
                  name="testMode"
                  type="checkbox"
                  checked={paymentInfo.testMode}
                  disabled={
                    paymentInfo.payment_provider === "gko" ||
                    paymentInfo.other_provider?.toLowerCase() === "gko"
                  }
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded mr-2"
                />
                <span className="text-sm text-gray-700">Test Mode</span>
              </div>*/}

              <button
                className="button-1 w-full mt-4"
                type="submit"
                disabled={isSubmitting}
                style={{ margin: "5px 0" }}
              >
                <span className="button-1-shadow"></span>
                <span
                  className="button-1-edge"
                  style={restCatogeryBgBtn[2]}
                ></span>
                <span className="button-1-front text bg-indigo-600 text-white">
                  {isSubmitting ? "Pairing..." : "Pair"}
                </span>
              </button>
            </form>
          </div>
        )}

        {/* ----------------------------Pairing Modal--------------------------- */}
        {pairingStatus === "pairing" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              PAIRING STATUS {pairingMessage === "Pairing Successful!" && "✅"}
              {pairingMessage === "Pairing Failed" && "❌"}
            </h2>
            <p className="text-gray-700 mb-4">{pairingMessage}</p>
            <button
              type="button"
              onClick={
                pairingMessage === "Pairing Successful!"
                  ? handleOkClick
                  : handleCancelClick
              }
              className="button-1 w-full mt-4"
              style={{ margin: "5px 0" }}
            >
              <span className="button-1-shadow"></span>
              <span
                className="button-1-edge"
                style={
                  pairingMessage === "Pairing Successful!"
                    ? restCatogeryBgBtn[5]
                    : restCatogeryBgBtn[6]
                }
              ></span>
              <span
                className="button-1-front text text-white"
                style={{
                  backgroundColor:
                    pairingMessage === "Pairing Successful!"
                      ? "#2196F3"
                      : "#FF0000",
                }}
              >
                {pairingMessage === "Pairing Successful!" ? "Ok" : "Cancel"}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PairingUI;
