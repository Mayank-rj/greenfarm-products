import Button from "../../Button/Button";
import { displayBgBtn } from "../../../assets/btn-bg";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faSearchengin } from "@fortawesome/free-brands-svg-icons/faSearchengin";
import { faHourglassHalf } from "@fortawesome/free-regular-svg-icons";
import "./EditBar.css";
import { useDispatch, useSelector } from "react-redux";
import {
  clearOrder,
  removeOrder,
  showOrder,
  updateOrder,
} from "../../../feature/displayOrderSlice";
import ViewButtonModal from "./ViewButtonModal/ViewButtonModal";
import { useState } from "react";
import Modal from "../../Modal/Modal";
import { clearViewOrder } from "../../../feature/viewOrderSlice";
import { addOrder } from "../../../api/addOder";
import { toast } from "react-toastify";
import {
  orderNumber,
  toggledltOrder,
  toggleOrders,
  uniqueId,
} from "../../../feature/showorderslice";
import { deleteHoldOrder } from "../../../api/deleteHoldOrder";
import { ConfirmationModal } from "../../Modal/ConfirmationModal/ConfirmationModal";
const EditBar = () => {
  const dispatch = useDispatch();
  const viewButtonOrder = useSelector((state) => state.displayViewOrder.order);
  const checkedOrderIds = useSelector((state) => state.displayOrder.selectedId);
  const displayOrder = useSelector((state) => state.displayOrder.orders);
  const { webOrder, orders } = useSelector((state) => state.footer);
  const holdOrderNumber = useSelector((state) => state.footer.orderNumber);
  const unique_id = useSelector((state) => state.footer.uniqueId);
  const weight = useSelector((state) => state.weight);
  const posData = useSelector((state) => state.posData);
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [width, setWidth] = useState({ width: "30%" });

  const deleteHoldedOrder = async () => {
    try {
      const response = await deleteHoldOrder(viewButtonOrder._id);

      if (response.success) toast.success("Order Deleted successfully!");
      dispatch(toggledltOrder());
    } catch (error) {
      toast.error("Failed to delete the order. Please try again.");
      console.error("error: " + error);
    }
  };

  const handleDelete = async () => {
    // checkedOrderIds.forEach((uniqueId) => {
    //   dispatch(removeOrder(uniqueId));
    // });

    if (orders && viewButtonOrder.status === "HOLD") {
      setOpenModal(true);
      setWidth({ width: "40%" });
      setModalContent(
        <ConfirmationModal
          message="Do you really want to Delete your Hold order?"
          onConfirm={() => {
            deleteHoldedOrder();
            handleClose();
          }}
          onClose={handleClose}
        />
      );
    } else if (checkedOrderIds.length !== 0) {
      setOpenModal(true);
      setWidth({ width: "40%" });
      setModalContent(
        <ConfirmationModal
          message="Do you really want to Delete this item?"
          onConfirm={() => {
            checkedOrderIds.forEach((uniqueId) => {
              dispatch(removeOrder(uniqueId));
            });
            handleClose();
          }}
          onClose={handleClose}
        />
      );
    }
    else{
      toast.error("Select Atleast One Product.");
    }
  };

  const handleClose = () => {
    setOpenModal(false);
    setModalContent(null);
    dispatch(clearViewOrder());
  };

  const handleView = () => {
    if (Object.keys(viewButtonOrder).length !== 0) {
      setOpenModal(!openModal);
      setWidth({ width: "60%" });
      setModalContent(
        <ViewButtonModal
          viewButtonOrder={viewButtonOrder}
          onClose={handleClose}
        />
      );
    }
    else{
      toast.error("Select Atleast One Order To View.");
    }
  };

  const holdOrder = async () => {
    try {
      const storedOrderNumber = holdOrderNumber
        ? holdOrderNumber
        : localStorage.getItem("orderNumber");
      const ordernumber = holdOrderNumber?.length
        ? displayOrder.length > 0
          ? holdOrderNumber
          : null
        : displayOrder.length > 0
        ? storedOrderNumber
        : null;
      const uniqueId = unique_id ? unique_id : localStorage.getItem("uniqueId");
      const totalRoundOff = displayOrder.reduce((sum, item) => {
        const itemTotal =
          item.size === "variations" || item.size === "novariations"
            ? item.price * item.quantity
            : item.weight * item.price * item.quantity;

        return sum + parseFloat(itemTotal.toFixed(2));
      }, 0);

      const orderPayload = {
        store_id: posData?.store?._id, // Replace with valid store ID
        date_time: new Date(),
        payment_mode: "cash", // Replace with actual payment mode
        order_number: ordernumber,
        product_details: JSON.stringify(displayOrder), // Ensure `displayOrder` exists
        address: "123, Street Name, City, Country",
        sub_total: totalRoundOff, // Replace with valid subTotal value
        surcharge: 0,
        delivery_charge: 0,
        coupon_code: "NO_COUPON", // Replace with valid coupon code if available
        discount: 0,
        order_type: "pos",
        change_amount: 0,
        tender_amount: 0, // Ensure `grandTotal` is defined
        split_cash_amount: 0,
        split_card_amount: 0,
        reference_id: `REF-${Date.now()}`,
        status: "HOLD",
        grand_total: totalRoundOff, // Ensure `grandTotal` is defined
        unique_id: uniqueId,
        tip_amount: "0",
      };
      const response = await addOrder(orderPayload);

      if (response.success === true) {
        toast.success("Order Hold successfully!");
        if (!holdOrderNumber) {
          localStorage.removeItem("orderNumber");
          localStorage.removeItem("uniqueId");
        }
        dispatch(clearOrder());
      } else {
        toast.error("Failed to hold the order. Please try again.");
      }
    } catch (error) {
      console.error("Error holding order:", error);
      toast.error("Something went wrong. Please check the console.");
    }
  };

  const unHoldOrder = async () => {
    try {
      await deleteHoldOrder(viewButtonOrder._id);
    } catch (error) {
      toast.error("Unable Unhold Order. Please try again.");
      console.error("error", error);
    } finally {
      const displayOrder = JSON.parse(viewButtonOrder.product_details);
      displayOrder.map((order) => {
        dispatch(showOrder(order));
      });
      dispatch(orderNumber(viewButtonOrder.order_number));
      dispatch(uniqueId(viewButtonOrder.unique_id));
      // dispatch(orderNumber(viewButtonOrder.order_number));
      // localStorage.setItem("orderNumber", viewButtonOrder.order_number)
      // localStorage.setItem("uniqueId",viewButtonOrder.unique_id)
      dispatch(toggleOrders());
    }
  };

  const handleHoldClick = async (buttonName) => {
    if (buttonName === "HOLD") {
      if (!displayOrder || displayOrder.length === 0) {
        toast.error("No products found in the current order.");
        return;
      }
      setOpenModal(true);
      setWidth({ width: "40%" });
      setModalContent(
        <ConfirmationModal
          message="Do you really want to Hold your current order?"
          onConfirm={() => {
            holdOrder();
            handleClose();
          }}
          onClose={handleClose}
        />
      );
    } else {
      setOpenModal(true);
      setWidth({ width: "40%" });
      setModalContent(
        <ConfirmationModal
          message="Do you really want to Unhold your Hold order?"
          onConfirm={() => {
            unHoldOrder();
            handleClose();
          }}
          onClose={handleClose}
        />
      );
    }
  };

  // console.log(checkedOrderIds);

  const handleEdit = () => {
    if (checkedOrderIds.length <= 0) {
      toast.error("Select atleast one item!");
    } else if (checkedOrderIds.length > 1) {
      toast.error("Select only one item!");
    } else {
      dispatch(
        updateOrder({
          id: checkedOrderIds[0],
          weight: weight,
        })
      );
    }
  };

  return (
    <div className="display-editing-container">
      <Button
        item="DELETE"
        style={{ backgroundColor: "red", color: "white" }}
        handleClick={handleDelete}
        icon={faTrash}
        background={displayBgBtn[0]}
        disabled={viewButtonOrder.status !== "HOLD" && (webOrder || orders)}
      />
      <Button
        item="EDIT"
        handleClick={handleEdit}
        icon={faPenToSquare}
        disabled={webOrder || orders}
      />
      <Button
        item="VIEW"
        handleClick={handleView}
        icon={faSearchengin}
        disabled={displayOrder.length !== 0}
      />
      <Button
        // item={holdButtonText}
        item={viewButtonOrder.status === "HOLD" ? "UNHOLD" : "HOLD"}
        style={{ backgroundColor: "blue", color: "white" }}
        icon={faHourglassHalf}
        background={displayBgBtn[1]}
        handleClick={(e) => handleHoldClick(e.target.id)}
        disabled={viewButtonOrder.status !== "HOLD" && (webOrder || orders)}
      />
      {openModal && (
        <Modal isOpen={openModal} width={width} onClose={handleClose}>
          {modalContent}
        </Modal>
      )}
    </div>
  );
};

export default EditBar;
