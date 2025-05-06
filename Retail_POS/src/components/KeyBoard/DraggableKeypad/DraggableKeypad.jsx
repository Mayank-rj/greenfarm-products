import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";

import "./DraggableKeypad.css"
import Keypad from "../Keypad/Keypad";

const DraggableKeypad = ({ setInputFocused, searchTerm, setSearchTerm }) => {
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const draggableRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (draggableRef.current) {
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      const elementWidth = draggableRef.current.offsetWidth;
      const elementHeight = draggableRef.current.offsetHeight;
      setPosition({
        x: containerWidth - elementWidth - 10,
        y: containerHeight - elementHeight - 50,
      });
    }
  }, []);

  const handleMouseDown = (e) => {
    if (draggableRef.current) {
      setDragging(true);
      offsetRef.current = {
        x: e.clientX - draggableRef.current.getBoundingClientRect().left,
        y: e.clientY - draggableRef.current.getBoundingClientRect().top,
      };
    }
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offsetRef.current.x,
        y: e.clientY - offsetRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1 && draggableRef.current) {
      const touch = e.touches[0];
      setDragging(true);
      offsetRef.current = {
        x: touch.clientX - draggableRef.current.getBoundingClientRect().left,
        y: touch.clientY - draggableRef.current.getBoundingClientRect().top,
      };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && dragging) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - offsetRef.current.x,
        y: touch.clientY - offsetRef.current.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  return (
    <div
      ref={draggableRef}
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: dragging ? "grabbing" : "grab",
        backgroundColor: "#333",
        // width: "40%",
        height: "40%",
        zIndex: 10,
        borderRadius: "5px",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="headline">
        Drag around from here
        {/* <button onClick={() => setInputFocused(false)}>close</button> */}
        <span className="close" onClick={() => setInputFocused(false)}>
          <FontAwesomeIcon icon={faXmark} />
        </span>
      </div>
      <Keypad input={searchTerm} setInput={setSearchTerm} />
    </div>
  );
};

export default DraggableKeypad;
