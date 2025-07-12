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
import { useEffect, useMemo, useState } from "react";
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
        sendMessage({
          command: "open-drawer",
        });
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
