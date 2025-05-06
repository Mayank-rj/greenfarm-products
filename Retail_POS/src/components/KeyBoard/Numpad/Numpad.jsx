import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackspace } from "@fortawesome/free-solid-svg-icons";
import "./Numpad.css";

export default function Numpad({ input, setInput }) {
  const handleKeyPress = (char) => {

    
    const inputStr = input.toString();
    if (char === "." && inputStr.includes(".")) {
      // Prevent entering multiple decimal points
      return;
    }
    setInput(input + char);
  };

  const handleBackspace = () => {
    const inputStr = input.toString();
    setInput(inputStr.slice(0, -1));
  };

  const renderNumbers = () => {
    const numbers = "123456789.0";
    return numbers.split("").map((char, index) => (
      <button key={index} onClick={() => handleKeyPress(char)}>
        {char}
      </button>
    ));
  };
  return (
    <div className="main-num-cont">
      <div className="numpad-container">
        <div className="numpad">
          {renderNumbers()}
          <button onClick={handleBackspace}>
            <FontAwesomeIcon icon={faBackspace} />
          </button>
        </div>
      </div>
    </div>
  );
}
