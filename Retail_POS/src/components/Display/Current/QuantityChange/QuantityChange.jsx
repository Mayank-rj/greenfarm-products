import { useDispatch, useSelector } from "react-redux";
import "./QuantityChange.css";
import { toast } from "react-toastify";
import { manageOrderQuantity } from "../../../../feature/displayOrderSlice";

const QuantityChange = () => {
  const dispatch = useDispatch();
  const display = useSelector((state) => state.displayOrder.orders);
  const checkedOrderIds = useSelector((state) => state.displayOrder.selectedId);
  // const qty = display.find((item) => item.uniqueId === checkedOrderIds)
  // console.log(qty)

  const handleQuantityChange = (increase) => {
    if (checkedOrderIds.length === 1) {
      const selectedOrder = display.find(
        (item) => item.uniqueId === checkedOrderIds[0]
      );
      // console.log(selectedOrder)
      if (selectedOrder) {
        if (!increase && selectedOrder.quantity === 1) {
          return;
        }
        dispatch(
          manageOrderQuantity({ uniqueId: checkedOrderIds[0], increase })
        );
      }
    } else {
      toast.error(
        "Please select only one product to increase or decrease quantity."
      );
    }
  };

  const selectedOrder = display.find(
    (item) => item.uniqueId === checkedOrderIds[0]
  );
  return (
    <div className="display-quantity-container">
      <h1>{selectedOrder ? selectedOrder.quantity : 0}</h1>
      <div className="btn">
        <button
          onClick={() => handleQuantityChange(true)}
          className="bg-white text-gray-800 p-3 rounded-sm shadow-lg transform transition-all duration-200 ease-in-out active:shadow-xl active:scale-95"
        >
          +
        </button>
        <button
          onClick={() => handleQuantityChange(false)}
          className="bg-white text-gray-800 p-3 rounded-sm shadow-lg transform transition-all duration-200 ease-in-out active:shadow-xl active:scale-95"
        >
          -
        </button>
      </div>
    </div>
  );
};

export default QuantityChange;
