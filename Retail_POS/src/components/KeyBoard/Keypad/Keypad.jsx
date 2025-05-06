import { useState } from "react";
import "./Keypad.css";

export default function Keypad({ input, setInput }) {
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  const handleKeyPress = (char) => {
    setInput(input + char);
  };

  const handleBackspace = () => {
    setInput(input.slice(0, -1));
  };

  const handleShift = () => {
    setIsShiftPressed(!isShiftPressed);
  };

  const handleSpace = () => {
    setInput(input + " ");
  };

  const renderKeys = (keys) => {
    return keys.split("").map((char, index) => (
      <button key={index} onClick={() => handleKeyPress(char)}>
        {char}
      </button>
    ));
  };

  const renderLetters = () => {
    const row1 = isShiftPressed ? "QWERTYUIOP" : "qwertyuiop";
    const row2 = isShiftPressed ? "ASDFGHJKL" : "asdfghjkl";
    const row3 = isShiftPressed ? "ZXCVBNM" : "zxcvbnm";

    return (
      <>
        <div className="row">
          {renderKeys(row1)}
          <button onClick={handleBackspace}>Backspace</button>
        </div>
        <div className="row">{renderKeys(row2)}</div>
        <div className="row">
          {renderKeys(row3)}
          <button onClick={handleShift}>Shift</button>
        </div>
      </>
    );
  };

  const renderNumbers = () => {
    const numbers = isShiftPressed ? "!@#$%&*()_." : "123456789.";
    return renderKeys(numbers);
  };

  return (
    <div className="main-container">
      <div className="keypad-container">
        <div className="keys">
          <div className="row">{renderNumbers()}</div>
          {renderLetters()}
          <div className="row">
            <button onClick={handleSpace}>Space</button>
          </div>
        </div>
      </div>
    </div>
  );
}
