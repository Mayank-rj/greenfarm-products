import { displayBgBtn } from "../../../assets/btn-bg";
import Button from "../../Button/Button";
import './ConfirmationModal.css'
export const ConfirmationModal = ({ message, onConfirm, onClose }) => (
  <div className="clear-order">
    <h1>{message}</h1>
    <Button
      handleClick={onConfirm}
      item={"YES"}
      style={{ backgroundColor: "red", color: "white" }}
      background={displayBgBtn[0]}
    />
    <Button item={"NO"} handleClick={onClose} />
  </div>
);
