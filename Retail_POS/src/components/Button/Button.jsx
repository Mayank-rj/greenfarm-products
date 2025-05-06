import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Button.css";
import { useEffect, useState } from "react";

function Button({ item, handleClick, style, background, icon, disabled }) {
  const [fadeBtn, setFadeBtn] = useState({});
  useEffect(() => {
    if (disabled) {
      setFadeBtn({
        filter: "grayscale(1)",
      });
    } else {
      setFadeBtn({});
    }
  }, [disabled]);

  return (
    <button
      className="button-1"
      role="button"
      onClick={handleClick}
      disabled={disabled}
      style={fadeBtn}
    >
      <span className="button-1-shadow"></span>
      <span className="button-1-edge" style={background}></span>
      <span className="button-1-front text" id={item} style={style}>
        {item} {icon && <FontAwesomeIcon id={item} icon={icon} size="lg" />}
      </span>
    </button>
  );
}

export default Button;
