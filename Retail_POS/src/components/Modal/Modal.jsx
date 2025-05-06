import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Modal.css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { DisplayMessage } from "../../SPI/event";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Modal({ isOpen, onClose, children, width }) {
  const [msg, setMsg] = useState("")
  const transactionStarted = useSelector(state => state.transaction.transactionStarted);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setMsg(DisplayMessage)
    }, 1000)
    return () => clearInterval(intervalId)
  }, [])
  return (
    <>
      {/* ------------------ The Modal -------------------  */}
      {isOpen && (
        <div className="modal">
          {/* ----------------------- Modal content ------------------  */}
          <div
            className="modal-content"
            style={width}
            onClick={(e) => e.stopPropagation()}
          >
            {!transactionStarted && (
              <span className="close" onClick={onClose}>
                <FontAwesomeIcon icon={faXmark} />
              </span>
            )}
            {children}
          </div>
        </div>
      )}
    </>
  );
}
