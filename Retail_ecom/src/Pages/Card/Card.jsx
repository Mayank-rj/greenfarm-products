import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Card.css";
import { useDispatch, useSelector } from "react-redux";
import { FaShoppingBasket } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import SITE_CONFIG from "../../../controller";
import {
  newaddItemToCart,
  newremoveItemFromCart,
} from "../../slices/cart/cartActions";
import { toast } from "react-toastify";

const Card = ({ item }) => {
  const { imageUrl, linkPath } = SITE_CONFIG;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isHome = location.pathname === `${linkPath}/home`;

  const { cart, error, loading } = useSelector((state) => state.newCart);
  const storeSliceData = useSelector((state) => state.storeData);
  let user = localStorage.getItem("User");
  const [weight, setWeight] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState(0);
  const [itemExists, setItemExists] = useState(false);
  const [exisitingCartItem, setExisitingCartItem] = useState({});
  const [selectedVariationId, setSelectedVariationId] = useState(
    exisitingCartItem.variationId || ""
  );
  const [selectedVariation, setSelectedVariation] = useState({});

  const handleAddClick = () => {
    // if (!user) {
    //   toast.error("Please login to add item in cart");
    // } else {
    const existingData = Array.isArray(cart?.product_details)
      ? cart?.product_details
      : [];
    if (item.size === "novariations") {
      dispatch(
        newaddItemToCart(
          storeSliceData.store?._id,
          user,
          {
            product: item._id,
            weight: 0,
            quantity: quantity,
            price: amount,
            variationId: "",
          },
          existingData
        )
      );
    } else if (item.size === "slider") {
      dispatch(
        newaddItemToCart(
          storeSliceData.store?._id,
          user,
          {
            product: item._id,
            weight: weight,
            quantity: quantity,
            price: amount,
            variationId: "",
          },
          existingData
        )
      );
    } else if (item.size === "variations") {
      dispatch(
        newaddItemToCart(
          storeSliceData.store?._id,
          user,
          {
            product: item._id,
            weight: 0,
            quantity: quantity,
            price: amount,
            variationId: selectedVariationId,
          },
          existingData
        )
      );
    }
    // }
  };
  const handleUpdateCartItem = async () => {
    handleAddClick();
    setWeight(1);
    setQuantity(1);
    navigate(`${SITE_CONFIG.linkPath}/cart`);
  };

  const handleAddHomeClick = () => {
    if (selectedVariationId) {
      navigate(
        `${SITE_CONFIG.linkPath}/product/${item._id}/${selectedVariationId}`
      );
      // location.replace = `${SITE_CONFIG.linkPath}/product/${productId}/ ${selected_Variation_Id}`;
      // window.history.pushState(
      //   null,
      //   "",
      //   `${SITE_CONFIG.linkPath}/product/${productId}/${selected_Variation_Id}`
      // );
    } else {
      navigate(`${SITE_CONFIG.linkPath}/product/${item._id}`);
    }
  };
  const handleOnClick = () => {
    // console.log("clicked");
    if (selectedVariationId) {
      navigate(
        `${SITE_CONFIG.linkPath}/product/${item._id}/${selectedVariationId}`
      );
      // location.replace = `${SITE_CONFIG.linkPath}/product/${productId}/ ${selected_Variation_Id}`;
      // window.history.pushState(
      //   null,
      //   "",
      //   `${SITE_CONFIG.linkPath}/product/${productId}/${selected_Variation_Id}`
      // );
    } else {
      navigate(`${SITE_CONFIG.linkPath}/product/${item._id}`);
    }
  };
  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrease = () => {
    setQuantity((prevQuantity) => {
      let newValue = prevQuantity;
      if (prevQuantity >= 1) {
        newValue -= 1;
        return newValue;
      } else {
        return newValue;
      }
    });
  };

  const handleSliderChange = (event) => {
    setWeight(event.target.value);
  };

  const checkCartItemQuantity = () => {
    if (itemExists) {
      if (exisitingCartItem.quantity >= 1) {
        setQuantity(exisitingCartItem.quantity);
      }
      if (exisitingCartItem.weight >= 1) {
        setWeight(exisitingCartItem.weight);
      }
    } else {
      setWeight(1);
      setQuantity(1);
    }
  };

  useEffect(() => {
    if (cart?.length !== 0) {
      checkCartItemQuantity();
    } else {
      setWeight(1);
      setQuantity(1);
    }
  }, [cart, exisitingCartItem]);
  useEffect(() => {
    if (quantity === 0) {
      if (itemExists) {
        dispatch(
          newremoveItemFromCart(
            storeSliceData.store?._id,
            user,
            item._id,
            selectedVariationId,
            [...cart?.product_details]
          )
        );
      }
      setQuantity(1);
    }
  }, [quantity]);
  useEffect(() => {
    setSelectedVariation(
      item?.variations?.find((iitem) => iitem._id === selectedVariationId)
    );
  }, [selectedVariationId]);
  useEffect(() => {
    const result = cart?.product_details?.find(
      (iitem) =>
        iitem.product === item._id && iitem.variationId === selectedVariationId
    );

    if (result) {
      setExisitingCartItem(result);
      setItemExists(true);
    } else {
      setExisitingCartItem({});
      setItemExists(false);
    }
  }, [cart, selectedVariationId, item]);
  useEffect(() => {
    if (item.size === "slider") {
      setAmount(weight * item.sell_price * quantity);
    } else if (item.size === "novariations") {
      setAmount(item.sell_price * quantity);
    } else if (item.size === "variations") {
      if (selectedVariationId !== "") {
        setAmount(selectedVariation.sell_price * quantity);
      } else {
        setAmount(item.sell_price * quantity);
      }
    }
  }, [weight, item.sell_price, selectedVariation, quantity]);
  return (
    <div className="card-container payload relative">
      <div className="mb-4">
        {" "}
        {/* Added relative positioning */}
        <img
          src={`${imageUrl}${item.cover}`}
          alt={item.name}
          className="card-image"
          onClick={handleOnClick}
        />
        {item.discount !== 0 && item.discount !== null && (
          <div
            style={{ color: "rgb(128,128,128)" }}
            className="absolute top-[20px] left-[20px] flex items-center justify-center p-[5px]"
          >
            <p className="h-[22px] flex items-center justify-center gap-[2px] w-[35px] rounded-md shadow-2xl text-xs shadow-white text-white border border-[rgb(128,128,128)] bg-orange-500">
              {item.discount}
              <span>%</span>
            </p>
          </div>
        )}
      </div>

      <div className="textcenterclass text-center group cardbottom ">
        {!item.in_stock && (
          <div
            style={{ color: "rgb(128,128,128)" }}
            className="relative w-full flex justify-center  "
            onClick={handleOnClick}
          >
            <p className="h-[26px] flex items-center justify-center w-[80px] lg:w-[180px] rounded-md shadow-2xl text-xs shadow-white border border-[rgb(128,128,128)] bg-white">
              Out of stock
            </p>
          </div>
        )}
        <p className="card-title">{item.name}</p>
        {item.size === "novariations" && !isHome && item.in_stock && (
          <>
            <p className="card-price font-bold">
              ${item.sell_price.toFixed(2)}
            </p>

            <button
              className="add-button flex justify-center items-center"
              onClick={itemExists ? handleUpdateCartItem : handleAddClick}
            >
              <span className="flex justify-center items-center gap-1 text-xs p-1 shadow-lg">
                <FaShoppingBasket /> {itemExists ? "UPDATE" : "ADD"}
              </span>
            </button>
            {itemExists && (
              <div className="quantity-controls">
                <button
                  className="quantity-controls-button"
                  onClick={handleDecrease}
                >
                  <FaMinus />
                </button>
                <span className="quantity-controls-count">{quantity}</span>
                <button
                  className="quantity-controls-button"
                  onClick={handleIncrease}
                >
                  <FaPlus />
                </button>
              </div>
            )}
          </>
        )}
        {/* slider   */}
        {item.size === "slider" && !isHome && item.in_stock && (
          <div className="slider-wrapper">
            <div className=" flex justify-between ">
              {weight >= 1 ? <span className="">0</span> : <span></span>}
              <div
                className="slider-value"
                style={{
                  left: `calc(${((weight - -3) * 100) / 18}% - 12px)`,
                }}
              >
                {weight} {item.unit}
              </div>
              {weight <= 13 ? <span className="">15</span> : <span></span>}
            </div>
            <input
              type="range"
              min="0.1"
              max="15"
              step="0.1"
              value={weight}
              onChange={handleSliderChange}
              className="slider-range"
              style={{
                "--slider-progress": `${((weight - 0) * 100) / 15}%`,
              }}
            />

            <p className="text-[1.2rem] text-[#BE0500] font-bold pt-2">
              ${(item.sell_price * weight).toFixed(2)}
            </p>
            <button
              className="add-button flex justify-center items-center shadow-lg "
              onClick={itemExists ? handleUpdateCartItem : handleAddClick}
            >
              {itemExists ? (
                <span className="flex justify-center items-center gap-1 text-xs p-1">
                  <FaShoppingBasket /> UPDATE
                </span>
              ) : (
                <span className="flex justify-center items-center gap-1 text-xs p-1">
                  <FaShoppingBasket /> ADD
                </span>
              )}
            </button>
          </div>
        )}
        {/* selector   */}
        {item.size === "variations" && !isHome && item.in_stock && (
          <div className="options-wrapper">
            <select
              id="underline_select"
              className="border border-gray-300 text-sm w-full h-8"
              value={selectedVariationId}
              onChange={(e) => setSelectedVariationId(e.target.value)}
            >
              <option value={""}>Select Variation</option>
              {item.variations.map((iitem, index) => (
                <option key={iitem._id} value={iitem._id}>
                  {iitem.name} - ${iitem.sell_price.toFixed(2)}
                </option>
              ))}
            </select>
            <button
              className="add-button flex justify-center items-center shadow-lg"
              onClick={itemExists ? handleUpdateCartItem : handleAddClick}
            >
              <span className="flex justify-center items-center gap-1 text-xs p-1 shadow-lg">
                <FaShoppingBasket /> {itemExists ? "UPDATE" : "ADD"}
              </span>
            </button>
            {itemExists && (
              <div className="quantity-controls pt-2">
                <button
                  className="quantity-controls-button"
                  onClick={handleDecrease}
                >
                  <FaMinus />
                </button>
                <span className="quantity-controls-count">{quantity}</span>
                <button
                  className="quantity-controls-button"
                  onClick={handleIncrease}
                >
                  <FaPlus />
                </button>
              </div>
            )}
            <p className="text-[1.2rem] text-[#BE0500] font-bold pt-2">
              ${" "}
              {selectedVariationId
                ? item.variations
                    .map((iiitem) => iiitem) // Map over the variations
                    .filter((iiitem) => iiitem._id === selectedVariationId) // Filter the result based on the selected _id
                    .map((iiitem) => iiitem.sell_price)[0]
                    ?.toFixed(2)
                : item.sell_price.toFixed(2)}
            </p>
          </div>
        )}
        {isHome && item.in_stock && (
          <>
            <p className="card-price">
              ${item.sell_price.toFixed(2)} / {item.unit}
            </p>
            {!itemExists ? (
              <button
                className="add-button flex justify-center items-center"
                onClick={handleAddHomeClick}
              >
                <span className="flex justify-center items-center gap-1 text-xs p-1 shadow-lg">
                  <FaShoppingBasket /> BUY NOW
                </span>
              </button>
            ) : (
              <button
                className="add-button flex justify-center items-center"
                onClick={handleAddHomeClick}
              >
                <span className="flex justify-center items-center gap-1 text-xs p-1 shadow-lg">
                  <FaShoppingBasket /> UPDATE
                </span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Card;
