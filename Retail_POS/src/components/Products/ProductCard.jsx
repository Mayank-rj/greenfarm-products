// import "react-lazy-load-image-component/src/effects/blur.css";
import "./ProductCard.css";
import { useEffect, useState } from "react";
// import { LazyLoadImage } from "react-lazy-load-image-component";

export default function ProductCard({
  item,
  handleClick,
  img,
  price,
  disabled,
}) {
  const [disable, setDisable] = useState({});

  useEffect(() => {
    if (disabled) {
      setDisable({
        pointerEvents: "none",
        filter: 'grayscale(1)',
      });
    } else {
      setDisable({
        pointerEvents: "auto",
        filter: 'grayscale(0)',
      });
    }
  }, [disabled]);

  return (
    <>
      <div
        className="card"
        onClick={() => handleClick(item)}
        style={disable}
      >
        <img src={img} alt={item} style={{ width: "100%" }} />
        {/* <LazyLoadImage src={img} alt={item} style={{ width: "100%" }} /> */}
        <h5>{item}</h5>
        <p className="price">${price}</p>
      </div>
    </>
  );
}
