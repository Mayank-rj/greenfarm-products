import Button from "../Button/Button";
import {
  faBarcode,
  faBookOpen,
  faCashRegister,
  faCircleXmark,
  faDeleteLeft,
  faGear,
  faGlobe,
  faRectangleList,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { footerbgBtn } from "../../assets/btn-bg";
import "./Footer.css";
import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "../Modal/Modal";
import { clearOrder } from "../../feature/displayOrderSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toggleOrders, toggleWebOrder } from "../../feature/showorderslice";
import { webOrderCount } from "../../api/webOrderCount";
import { ConfirmationModal } from "../Modal/ConfirmationModal/ConfirmationModal";
import { toast } from "react-toastify";
import { sendMessage, socket } from "../../app/driverConnection";
import { setWebOrderBadgeCount } from "../../feature/webOrderBadgeSlice";
import { width } from "@fortawesome/free-brands-svg-icons/faSearchengin";
import DraggableNumpad from "../KeyBoard/DraggableNumpad/DraggableNumpad";
import { authenticate } from "../../feature/settingsAuth";
// const socket = io(SITE_CONFIG.socketIp)
const Footer = () => {
  const { webOrder, orders } = useSelector((state) => state.footer);
  const display = useSelector((state) => state.displayOrder.orders);
  const checkedOrderIds = useSelector((state) => state.displayOrder.selectedId);
  const posData = useSelector((state) => state.posData);
  // Array of button labels and their corresponding actions
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const displayOrder = useSelector((state) => state.displayOrder.orders);
  const [previousWebOrderCount, setPreviousWebOrderCount] = useState(
    parseInt(localStorage.getItem("previousWebOrderCount")) || 0
  );
  const [currentWebOrderCount, setCurrentWebOrderCount] = useState(0);
  const [webOrdersButtonClicked, setWebOrdersButtonClicked] = useState(false);
  const [badgeCount, setBadgeCount] = useState(0);

  const handleWebOrdersButtonClick = () => {
    if (!webOrder) {
      dispatch(setWebOrderBadgeCount(badgeCount));
      setBadgeCount(0);
      localStorage.setItem("previousWebOrderCount", currentWebOrderCount);
      setPreviousWebOrderCount(currentWebOrderCount);
    }
    dispatch(toggleWebOrder());
  };

  const buttons = [
    {
      text: "CLEAR",
      icon: faDeleteLeft,

      disabled: webOrder || orders,
      action: () => {
        if (displayOrder.length > 0) {
          // console.log(displayOrder.length);
          setOpenModal(true);
          setModalContent(
            <ConfirmationModal
              message="Do you really want to clear your current order?"
              onConfirm={() => {
                dispatch(clearOrder());
                handleClose();
              }}
              onClose={handleClose}
            />
          );
        }
      },
      style: {
        backgroundColor: "#2A6198",
        color: "white",
      },
    },
    {
      text: "ORDERS",
      icon: faRectangleList,
      disabled: display.length === 0 ? false : true,
      action: () => dispatch(toggleOrders()),
    },
    {
      text: "WEB ORDERS",
      icon: faGlobe,
      notification: true,
      disabled: display.length === 0 ? false : true,
      action: handleWebOrdersButtonClick,
    },
    {
      text: "DRAWER",
      icon: faCashRegister,

      disabled: false,
      action: () => {
        setOpenModal(true);
        setModalContent(<DrawerPin handleClose={handleClose} />);

        // if (socket.connected) {
        //   socket.emit("message", {
        //     command: "open-drawer",
        //   });
        // } else {
        //   toast.error("Drawer Not Connected");
        // }
      },
      style: {
        backgroundColor: "#2A6198",
        color: "white",
      },
    },
    {
      text: "BARCODE",
      icon: faBarcode,

      disabled: display.length === 0 ? false : true,
      action: () => Navigate(`barcodeproducts`),
      style: {
        backgroundColor: "#2A6198",
        color: "white",
      },
    },
    {
      text: "REPORTS",
      icon: faBookOpen,

      disabled: display.length === 0 ? false : true,
      action: () => Navigate(`reports`),
      style: {
        backgroundColor: "#2A6198",
        color: "white",
      },
    },
    {
      text: "SETTINGS",
      icon: faGear,

      disabled: display.length === 0 ? false : true,
      action: () => Navigate(`setting`),
      style: {
        backgroundColor: "#2A6198",
        color: "white",
      },
    },
  ];
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const handleClose = () => {
    setOpenModal(false);
    setModalContent(null);
  };

  useEffect(() => {
    const fetchOrderHistory = async () => {
      // console.log("hello");

      const date = new Date();
      const start_date = new Date(date.setHours(0, 0, 0, 0)).toISOString();
      const end_date = new Date(date.setHours(23, 59, 59, 999)).toISOString();

      try {
        const response = await webOrderCount(
          start_date,
          end_date,
          posData?.store?._id
        );

        setCurrentWebOrderCount(response);
      } catch (err) {
        console.error(err.message);
      }
    };
    // console.log("hello");
    // if(!posData?.store?._id){
    //   // toast.error("Store Data is missing. Please Connect the driver")
    //   return
    // }

    fetchOrderHistory();
    const intervalId = setInterval(fetchOrderHistory, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, [posData]);

  useEffect(() => {
    if (currentWebOrderCount > previousWebOrderCount) {
      setBadgeCount(currentWebOrderCount - previousWebOrderCount);

      // //Web Order Alert..
      // setOpenModal(true);
      // setModalContent(
      //   <div className="flex items-center flex-col">
      //     <FontAwesomeIcon icon={faBell} className="text-yellow-500 fa-shake text-4xl" />
      //     <h1 className="text-2xl font-bold my-8">
      //       New Web Order Received....
      //     </h1>
      //     <Button
      //       item={"OK"}
      //       style={{ width: "200px" }}
      //       handleClick={() => setOpenModal(false)}
      //     />
      //   </div>
      // );
    }
  }, [currentWebOrderCount, previousWebOrderCount]);

  return (
    <div className="footer">
      <div className="options">
        {buttons.map((button, index) => (
          <div className="option" key={button.text}>
            <Button
              key={button.text}
              item={button.text}
              handleClick={button.action}
              style={button.style}
              background={footerbgBtn[index]}
              icon={button.icon}
              disabled={button.disabled}
            />
            {button.notification && badgeCount !== 0 && !webOrder && (
              <div className="notification-icon">
                <span className="badge">{badgeCount}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      {openModal && (
        <Modal
          isOpen={openModal}
          onClose={handleClose}
          width={{ width: "30%" }}
        >
          {modalContent}
        </Modal>
      )}
    </div>
  );
};

export default Footer;

const DrawerPin = ({handleClose}) => {
  const dispatch = useDispatch();
  const [pin, setPin] = useState(["", "", "", ""]);
  const [inputFocused, setInputFocused] = useState(false);
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const posData = useSelector((state) => state.posData);
  const navigate = useNavigate();

  // console.log(posData.pin);

  const correctPin = posData.pin;
  const inputRefs = useRef([]);

  const handlePinChange = (index, value) => {
    if (value.match(/[0-9]/) || value === "") {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      setSearch(newPin);
      console.log(search);

      // Focus management
      if (value && index < pin.length - 1) {
        inputRefs.current[index + 1].focus();
      } else if (!value && index > 0) {
        inputRefs.current[index - 1].focus();
      }

      // Check if all digits are filled
      if (newPin.every((digit) => digit !== "")) {
        handlePinSubmit(newPin); // Automatically submit when all digits are entered
      }
    }
  };

  useEffect(() => {
    const numericOnly = search.replace(/\D/g, "");
    if (numericOnly.length <= 4) {
      const digits = numericOnly.split("").slice(0, 4);
      const paddedDigits = [...digits, "", "", "", ""].slice(0, 4); // Ensure 4-length array
      console.log(paddedDigits)
      setPin(paddedDigits);

      // Focus the next empty field
      const nextIndex = paddedDigits.findIndex((d) => d === "");
      if (nextIndex >= 0 && inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }

      // Auto submit when all 4 digits entered
      if (digits.length === 4 && digits.every((d) => /\d/.test(d))) {
        handlePinSubmit(digits);
      }
    }
  }, [search]);

  const handlePinSubmit = (enteredPinArray) => {
    const enteredPin = enteredPinArray.join(""); // Combine array into a string
    if (enteredPin === correctPin) {
      dispatch(authenticate());
      setErrorMessage("");
      sendMessage({ command: "open-drawer" });
      handleClose()
      toast.success("Drawer Opened successfully")
      // navigate('/settings'); // Adjust the path as necessary
    } else {
      setErrorMessage("Enter correct PIN");
      setPin(["", "", "", ""]); // Reset PIN on incorrect attempt
      setSearch("");
      inputRefs.current[0].focus(); // Focus the first input again
    }
  };

  // const handleKeyDown = (index, e) => {
  //   if (e.key === "Backspace" && pin[index] === "") {
  //     if (index > 0) {
  //       inputRefs.current[index - 1].focus();
  //     }
  //   }
  // };

  const getInputClass = (index) => {
    const baseClass =
      "block w-12 h-12 py-3 text-lg font-extrabold text-center rounded-lg border";
    const borderClass = errorMessage
      ? "border-2 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] "
      : "border-gray-300";
    return `${baseClass} ${borderClass}`;
  };

  useEffect(() => {
    // Focus the input and select its content when the component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
      inputRefs.current[0].select();
    }
  }, []);

  return (
    <>
      <div className="flex items-center justify-center bg-gray-900">
        <form
          className="bg-gray-800 p-8 rounded-lg shadow-lg"
          onSubmit={(e) => {
            e.preventDefault();
            handlePinSubmit(pin);
          }}
        >
          <h2 className="text-xl font-bold mb-4 text-white">Enter PIN</h2>
          <div className="flex mb-2 space-x-2 rtl:space-x-reverse">
            {pin.map((digit, index) => (
              <input
                key={index}
                type="password"
                maxLength="1"
                ref={(el) => (inputRefs.current[index] = el)} // Assigning refs
                value={digit}
                // onChange={(e) => handlePinChange(index, e.target.value)}
                // onKeyDown={(e) => handleKeyDown(index, e)}
                onFocus={() => setInputFocused(true)}
                className={getInputClass(index)}
                style={{
                  outline: "none",
                }}
                readOnly
                required
              />
            ))}
          </div>
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        </form>
        {inputFocused && (
          <DraggableNumpad
            setInputFocused={setInputFocused}
            searchTerm={search}
            setSearchTerm={setSearch}
          />
        )}
      </div>
    </>
  );
};
