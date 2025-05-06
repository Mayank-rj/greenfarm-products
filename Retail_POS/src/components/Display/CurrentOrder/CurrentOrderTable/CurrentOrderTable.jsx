import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedIds,
  updateOrder,
} from "../../../../feature/displayOrderSlice";
import "./CurrentOrderTable.css";
import { useEffect, useState } from "react";
import { sendMessage, socket } from "../../../../app/driverConnection";

const CurrentOrderTable = () => {
  const dispatch = useDispatch();
  const display = useSelector((state) => state.displayOrder.orders);
  const totalPrice = display.reduce((sum, item) => {
    const itemTotal = (item.size === 'variations' || item.size === 'novariations')
      ? (item.price * item.quantity)
      : (item.weight * item.price * item.quantity);

    return sum + parseFloat(itemTotal.toFixed(2));
  }, 0);
  const checkedIds = useSelector((state) => state.displayOrder.selectedId);
  // Handle updates to weight
  const handleWeightChange = (id, newWeight) => {
    dispatch(updateOrder({ id, weight: parseFloat(newWeight) || 0 }));
  };

  const handleCheckboxChange = (uniqueId, isChecked) => {
    let updatedIds = Array.isArray(checkedIds) ? [...checkedIds] : [];
    if (isChecked) {
      updatedIds.push(uniqueId);
    } else {
      // Remove the id from the list if unchecked
      updatedIds = checkedIds.filter((storedId) => storedId !== uniqueId);
    }
    dispatch(setSelectedIds(updatedIds));
  };
  const handleRowClick = (id, event) => {
    // Check if the clicked target is the row itself, not the checkbox
    const checkbox = event.target
      .closest("tr")
      .querySelector('input[type="checkbox"]');
    if (checkbox) {
      const newCheckedState = !checkbox.checked; // Toggle checkbox state
      checkbox.checked = newCheckedState; // Update checkbox UI
      handleCheckboxChange(id, newCheckedState); // Call the handler
    }
  };
  const [prevLength, setPrevLength] = useState(display.length);

  // Deselect items when a new one is added
  useEffect(() => {
    if (display.length > prevLength) {
      dispatch(setSelectedIds([]));
    }
    setPrevLength(display.length); // Update after check
  }, [display.length]);

  useEffect(() => {
    sendMessage({
      command: "display", data: {
        items: display,
        sub_total: (totalPrice).toFixed(2)
      },
    })
    // if (socket.connected) {
    //   socket.emit("message", {
    //     command: "display",
    //     data: {
    //       items:display,
    //       sub_total:(totalPrice).toFixed(2)
    //     },
    //   });
    // }
  }, [display]);

  return (
    <div className={`current-order-table-container scrollable`}>
      <table>
        <thead>
          <tr className="heading">
            <td width="45px">QTY</td>
            <td>Description</td>
            <td width="70px">Weight/pcs</td>
            <td width="80px">$Rate/kg</td>
            <td width="80px">$Price</td>
            {/* <td width="50px">Actions</td> */}
          </tr>
        </thead>
        <tbody>
          {display.map((item, i) => (
            <tr key={i}>
              <td>
                <label>
                  <input
                    type="checkbox"
                    id={item.uniqueId}
                    style={{ marginRight: "1px" }}
                    onChange={(e) =>
                      handleCheckboxChange(item.uniqueId, e.target.checked)
                    }
                    checked={checkedIds.includes(item.uniqueId)}
                  />
                  <span style={{ fontWeight: "bold", marginLeft: "5px" }}>
                    {item.quantity || 1}
                  </span>
                </label>
              </td>
              <td
                style={{ textAlign: "start" }}
                onClick={(e) => handleRowClick(item.uniqueId, e)}
              >
                <label
                  htmlFor={i}
                  style={{ display: "block", textTransform: "uppercase" }}
                >
                  {item.name.length > 25
                    ? item.name.slice(0, 25) + "..."
                    : item.name}
                </label>
              </td>
              {/* <td>
                <label
                  type="number"
                  value={item.weight }
                 onChange={(e) => handleWeightChange(i, e.target.value)}
                  style={{ width: "50px" }}
                />{" "}
                kg
              </td> */}
              <td onClick={(e) => handleRowClick(item.uniqueId, e)}>
                <label htmlFor={i} style={{ display: "block" }}>
                  {item.weight || 0} kg
                </label>
              </td>

              <td onClick={(e) => handleRowClick(item.uniqueId, e)}>
                <label htmlFor={i} style={{ display: "block" }}>
                  ${Number(item.price).toFixed(2)}
                </label>
              </td>
              <td onClick={(e) => handleRowClick(item.uniqueId, e)}>
                <label
                  htmlFor={i}
                  style={{ display: "block" }}
                  className="value"
                >
                  $
                  {item.size === "variations" || item.size === "novariations"
                    ? (item.price * item.quantity).toFixed(2)
                    : (item.weight * item.price * item.quantity).toFixed(2)}
                </label>
              </td>
              {/* <td>
                <button
                  onClick={() => handleRemoveOrder(i)}
                  style={{ color: "red" }}
                >
                  Remove
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CurrentOrderTable;
