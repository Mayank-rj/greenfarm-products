import { useEffect, useState } from "react";
import { fetchCategory } from "../../api/fetchCategory";
import Button from "../Button/Button";
import { categoryBgBtn, restCatogeryBgBtn } from "../../assets/btn-bg";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import "./Category.css";
import { useDispatch, useSelector } from "react-redux";
import { setCategoryId } from "../../feature/manageCategorySlice";
import { SaleByKg } from "./SaleByKg/SaleByKg";
import Modal from "../Modal/Modal";
import OpenItem from "./OpenItem/OpenItem";
import OpenKg from "./OpenKg/OpenKg";
import WeightDisplay from "./WeightDisplay/WeightDisplay";
import { addOrder } from "../../api/addOder";
import { toast } from "react-toastify";
import PayModal from "./Paymodal/PayModal";
import { setTransactionState } from "../../feature/transactionSlice";
import { spi } from "../../pages/Setting/PairingUI";
import { sharedState } from "../../SPI/event";

const Category = () => {
  const dispatch = useDispatch();
  const displayOrder = useSelector((state) => state.displayOrder.orders);
  const { webOrder, orders } = useSelector((state) => state.footer);
  const weight = useSelector((state) => state.weight)

  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [width, setWidth] = useState({ width: "80%" });

  const getCategory = async () => {
    const category = await fetchCategory();
    const filteredCategories = category.filter(
      (item) => item.status === "active"
    );
    setCategories(filteredCategories);
  };

  useEffect(() => {
    getCategory();
  }, []);

  const handleClose = () => {
    setOpenModal(false);
    setModalContent(null);
  };
  const handleButtonClick = (e) => {
    const buttonName = e.target.innerText;
    if (buttonName === "OPEN ITEM") {
      setOpenModal(!openModal);
      setWidth({ width: "80%" });
      setModalContent(<OpenItem onClose={handleClose} />);
    } else if (buttonName === "SALE BY KG") {
      if (weight !== 0) {
        setOpenModal(!openModal);
        setWidth({ width: "40%" });
        setModalContent(<SaleByKg onClose={handleClose} />);
      }
    } else if (buttonName === "OPEN KG") {
      setOpenModal(!openModal);
      setWidth({ width: "80%" });
      setModalContent(<OpenKg onClose={handleClose} />);
    } else {
      const cid = categories.find((cat) => cat.name === buttonName);
      if (cid) {
        dispatch(setCategoryId(cid._id));
      }
    }
  };

  const handlePayButton = async () => {

    if (!displayOrder || displayOrder.length === 0) {
      toast.error("No products found in the current order.");
      return;
    } else {
      localStorage.removeItem("lastTxPosId");
      localStorage.removeItem("transactionMessage");
      localStorage.removeItem("merchant_receipt");
      localStorage.removeItem("customer_receipt");
      localStorage.removeItem("eventMessage");  
      localStorage.removeItem("errorDetail");
      localStorage.removeItem("hostResponseText");
      localStorage.removeItem("discountAmount");
      sharedState.transactionMessage = null;
      setOpenModal(!openModal);
      setWidth({ width: "80%" });
      setModalContent(<PayModal onClose={handleClose} />);
    }
    // try {
    // const storedOrderNumber = localStorage.getItem("orderNumber");
    // const uniqueId = localStorage.getItem("uniqueId");
    // const subTotal = displayOrder.reduce((sum, item) => sum + item.price, 0);
    // const grandTotal = subTotal + 10;

    // const orderPayload = {
    //   store_id: "675bc921a9d7c0f8d86dfe96", // Replace with valid store ID
    //   driver_id: "651c6a287fdc8e3a4b4a5678", // Replace with valid driver ObjectId
    //   user_id: "651c6a287fdc8e3a4b4a1234", // Add valid user ObjectId
    //   date_time: new Date(),
    //   payment_mode: "Cash", // Replace with actual payment mode
    //   order_number: storedOrderNumber,
    //   product_details: JSON.stringify(displayOrder), // Ensure `displayOrder` exists
    //   notes: "Order placed successfully",
    //   address: "123, Street Name, City, Country",
    //   sub_total: subTotal, // Replace with valid subTotal value
    //   surcharge: 0,
    //   delivery_charge: 10,
    //   coupon_code: "NO_COUPON", // Replace with valid coupon code if available
    //   discount: 0,
    //   order_type: "Pickup",
    //   change_amount: 0,
    //   tender_amount: grandTotal, // Ensure `grandTotal` is defined
    //   split_cash_amount: 0,
    //   split_card_amount: 0,
    //   reference_id: `REF-${Date.now()}`,
    //   status: "PAID",
    //   grand_total: grandTotal, // Ensure `grandTotal` is defined
    //   unique_id: uniqueId,
    //   tip_amount: "0",
    // };

    // const response = await addOrder(orderPayload);


    // if (response.success === true) {
    //   toast.success("Order placed successfully!");
    //   localStorage.removeItem("orderNumber");
    //   localStorage.removeItem("uniqueId");
    // } else {
    //   // toast.error("Failed to place the order. Please try again.");
    // }
    // } 

    // catch (error) {
    //   console.error("Error placing order:", error);
    //   toast.error("Something went wrong. Please check the console.");
    // }
  };

  return (
    <div className="category-container">
      <div className="input-field">
        {/* <input
          type="text"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        /> */}

        <WeightDisplay />
      </div>
      <div className="cat-btn">
        <Button
          item="OPEN ITEM"
          handleClick={handleButtonClick}
          style={{ backgroundColor: "blue", color: "white" }}
          background={restCatogeryBgBtn[1]}
          disabled={webOrder || orders}
        />
        <Button
          item="SALE BY KG"
          handleClick={handleButtonClick}
          style={{ backgroundColor: "blue", color: "white" }}
          background={restCatogeryBgBtn[2]}
          disabled={webOrder || orders}
        />
        <div className="categories">
          {categories.map((item, index) => (
            <Button
              key={item._id}
              item={item.name}
              handleClick={handleButtonClick}
              background={categoryBgBtn[index % categoryBgBtn.length]} // This repeats the colors
              disabled={webOrder || orders}
              style={
                (index % 11 === 0)
                  ? { backgroundColor: "hsl(26deg 30% 50%)", color: "white" }
                  : (index % 11 === 1)
                  ? { backgroundColor: "hsl(304, 56%, 50%)", color: "white" }
                  : (index % 11 === 2)
                  ? { backgroundColor: "hsl(25, 34%, 33%)", color: "white" }
                  : (index % 11 === 3)
                  ? { backgroundColor: "hsl(120, 73%, 75%)", color: "black" }
                  : (index % 11 === 4)
                  ? { backgroundColor: "hsl(210, 57%, 38%)", color: "white" }
                  : (index % 11 === 5)
                  ? { backgroundColor: "hsl(0, 0%, 50%)", color: "white" }
                  : (index % 11 === 6)
                  ? { backgroundColor: "hsl(60, 100%, 50%)", color: "black" }
                  : (index % 11 === 7)
                  ? { backgroundColor: "hsl(350, 100%, 88%)", color: "black" }
                  : (index % 11 === 8)
                  ? { backgroundColor: "hsl(0, 100%, 50%)", color: "white" }
                  : (index % 11 === 9)
                  ? { backgroundColor: "hsl(45, 87%, 64%)", color: "black" }
                  : (index % 11 === 10)
                  ? { backgroundColor: "hsl(0, 0%, 0%)", color: "white" }
                  : {}
              }
            />
          ))}

        </div>
        <Button
          item="OPEN KG"
          handleClick={handleButtonClick}
          style={{ backgroundColor: "black", color: "white" }}
          background={restCatogeryBgBtn[3]}
          disabled={webOrder || orders}
        />
      </div>
      <div className="pay-btn">
        <Button
          item="PAY"
          handleClick={handlePayButton}
          icon={faHandHoldingDollar}
          background={restCatogeryBgBtn[0]}
          disabled={webOrder || orders}
        />
      </div>
      {openModal && (
        <Modal isOpen={openModal} onClose={handleClose} width={width}>
          {modalContent}
        </Modal>
      )}
    </div>
  );
};

export default Category;
