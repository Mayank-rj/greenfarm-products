import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import SITE_CONFIG from "../../../controller";

const CartItem = ({
  item,
  handleDeleteCartItem,
  handleEditCartItem,
  handleDecrease,
  handleIncrease,
}) => {
  const { imageUrl } = SITE_CONFIG;
  const [variation, setvariation] = useState({});
  useEffect(() => {
    setvariation(
      item.product.variations.find((iitem) => iitem._id === item.variationId)
    );
  }, [item]);
  return (
    <div className="p-4 rounded-lg md:p-6">
      <div className="flex flex-col mt-4 md:mt-6 md:flex-row justify-between">
        <div className="flex">
          <img
            src={`${imageUrl}${item.product.cover}`}
            alt={item.product.name}
            className="w-20 h-20 rounded object-cover"
          />
          <div className="p-4">
            <h4 className="text-xs md:text-sm font-semibold">
              {item.product.name}{" "}
              {variation?.name ? ` - ${variation.name}` : ""}
            </h4>
            {item.product.size === "slider" && (
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                $ {parseFloat(item.price)?.toFixed(2)}/{" "}
                {parseFloat(item.weight).toFixed(2)} {item.product.unit}{" "}
                {item.quantity !== 1 && `x${item.quantity}`}
              </p>
            )}
            {item.product.size === "novariations" && (
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                $ {parseFloat(item.price).toFixed(2)} / {item.quantity}{" "}
                {item.product.unit}
              </p>
            )}
            {item.product.size === "variations" && (
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                $ {parseFloat(item.price, "hiiii").toFixed(2)} / {item.quantity}{" "}
                {item.product.unit}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div className="quantity-controls handlebtn">
            <button
              className="quantity-controls-button"
              onClick={() => handleDecrease(item._id, item)}
            >
              <FaMinus />
            </button>
            <span className="quantity-controls-count">{item.quantity}</span>
            <button
              className="quantity-controls-button"
              onClick={() => handleIncrease(item._id, item)}
            >
              <FaPlus />
            </button>
          </div>
          <div className="flex space-x-4 md:ml-auto self-end">
            <button
              onClick={() => handleEditCartItem(item)}
              className="text-green-500 hover:text-green-700"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              onClick={() => handleDeleteCartItem(item)}
              className=""
              style={{ color: "#be0500" }}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default CartItem;
