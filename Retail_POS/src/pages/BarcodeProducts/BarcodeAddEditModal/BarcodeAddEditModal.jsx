import React, { useEffect, useRef, useState } from "react";
import DraggableNumpad from "../../../components/KeyBoard/DraggableNumpad/DraggableNumpad";
import Button from "../../../components/Button/Button";
import { fetchCategory } from "../../../api/fetchCategory";
import DraggableKeypad from "../../../components/KeyBoard/DraggableKeypad/DraggableKeypad";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const BarcodeAddEditModal = ({ data = {}, onConfirm }) => {
  const [name, setName] = useState(data?.name || "");
  const [category, setCategory] = useState(data.category || "");
  const [sell_price, setSell_price] = useState(data.sell_price || "");
  const [remark, setRemark] = useState(data.descriptions || "");
  const [original_price, setOriginal_price] = useState(
    data.original_price || ""
  );
  const [stock_quantity, setStock_quantity] = useState(
    data.stock_quantity || ""
  );
  const [status, setStatus] = useState(data.status || "active");
  const [barcode, setBarcode] = useState(data.barcode || "");
  const [categories, setCategories] = useState([]);
  const [inputFocused, setInputFocused] = useState("");
  const [errors, setErrors] = useState({});
  const inputRef = useRef("");
  const typingTimerRef = useRef(null);
  const debounceInterval = 300;
  const posData = useSelector((state) => state.posData);
  const resetForm = () => {
    setName("");
    setCategory("");
    setSell_price("");
    setOriginal_price("");
    setStock_quantity("");
    setStatus("active");
    setBarcode("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required.";
    if (!category) newErrors.category = "Category is required.";
    // if (!sell_price) newErrors.sell_price = "Selling price is required.";
    if (!original_price) newErrors.original_price = "Price is required.";
    // if (!stock_quantity)
    //   newErrors.stock_quantity = "Stock quantity is required.";
    if (!barcode) newErrors.barcode = "Barcode is required.";
    if (!remark) newErrors.remark = "Remark is required.";
    // if (parseFloat(sell_price) > parseFloat(original_price)) newErrors.sell_price = "Selling price cannot be greater than original price."
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleOnClick = (e) => {
    e.preventDefault();
    setInputFocused("");
    if (!posData?.store?._id) {
      toast.error("Store Data is missing. Please Connect the driver");
      return;
    }
    if (validateForm()) {
      const dataToSend = {
        name,
        category,
        original_price,
        sell_price: original_price,
        descriptions: remark,
        stock_quantity,
        status,
        barcode,
        quantity: 1,
        size: "novariations",
        store: posData?.store?._id || "675bc921a9d7c0f8d86dfe96",
      };
      if (data._id) {
        dataToSend._id = data._id;
      }
      onConfirm(dataToSend);
      // resetForm(); // Reset form after confirmation
    }
  };

  useEffect(() => {
    const fetchCategoriesHandler = async () => {
      const res = await fetchCategory();
      setCategories(res);
    };
    fetchCategoriesHandler();
  }, []);
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Clear the previous timeout
      clearTimeout(typingTimerRef.current);
      setBarcode("");
      inputRef.current += event.key;
      // console.log(inputRef.current);
      if (/^\d+$/.test(inputRef.current)) {
        setBarcode(inputRef.current);
      }
      // Debounce logic
      typingTimerRef.current = setTimeout(() => {
        inputRef.current = "";
      }, debounceInterval);
    };
    const inputElement = inputRef.current;
    // // Add the event listener when the component mounts
    window.addEventListener("keydown", handleKeyDown);

    // // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(typingTimerRef.current);
    };
  }, []);
  return (
    <div className="p-2 bg-[#efeff1] rounded shadow-md w-full mx-auto">
      <h2 className="text-blue-950 text-2xl font-bold mb-2">
        {Object.keys(data).length === 0
          ? "Add Barcode Product"
          : "Update Barcode Product"}
      </h2>

      <form className="grid grid-cols-2 gap-2">
        <div className="mb-2">
          <label className="block text-blue-950" htmlFor="category">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setErrors((prev) => ({ ...prev, category: "" })); // ✅ Clear validation error
            }}
            className="mt-1 p-2 border border-[#5e7784] rounded w-full"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <p className="text-red-500 text-sm">{errors.category}</p>
        </div>

        <div className="mb-2">
          <label className="block text-blue-950" htmlFor="name">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onFocus={() => setInputFocused("name")}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: "" }));
            }}
            className="mt-1 p-2 border border-[#5e7784] rounded w-full"
            placeholder="Enter name"
          />
          <p className="text-red-500 text-sm">{errors.name}</p>
        </div>
        <div className="mb-2">
          <label className="block text-blue-950" htmlFor="barcode">
            Barcode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="barcode"
            value={barcode}
            onFocus={() => setInputFocused("barcode")}
            onChange={(e) => {
              setBarcode(e.target.value);
              setErrors((prev) => ({ ...prev, barcode: "" }));
            }}
            className="mt-1 p-2 border border-[#5e7784] rounded w-full"
            placeholder="Enter barcode"
            ref={inputRef}
          />
          <p className="text-red-500 text-sm">{errors.barcode}</p>
        </div>
        <div className="mb-2">
          <label className="block text-blue-950" htmlFor="original_price">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            // type="number"
            min={0}
            id="original_price"
            value={original_price}
            onFocus={() => setInputFocused("original_price")}
            onChange={(e) => {
              setOriginal_price(e.target.value);
              setErrors((prev) => ({ ...prev, original_price: "" }));
            }}
            className="mt-1 p-2 border border-[#5e7784] rounded w-full"
            placeholder="Enter original price"
          />
          <p className="text-red-500 text-sm">{errors.original_price}</p>
        </div>
        <div className="mb-2 col-span-2">
          <label className="block text-blue-950" htmlFor="name">
            Remark <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="remark"
            value={remark}
            onFocus={() => setInputFocused("remark")}
            onChange={(e) => {
              setRemark(e.target.value);
              setErrors((prev) => ({ ...prev, remark: "" }));
            }}
            className="mt-1 p-2 border border-[#5e7784] rounded w-full"
            placeholder="Enter remark"
          />
          <p className="text-red-500 text-sm">{errors.remark}</p>
        </div>

        {/* <div className="mb-2">
          <label className="block text-blue-950" htmlFor="sell_price">
            Selling Price
          </label>
          <input
            // type="number"
            min={0}
            id="sell_price"
            value={sell_price}
            onFocus={() => setInputFocused("sell_price")}
            onChange={(e) => setSell_price(e.target.value)}
            className="mt-1 p-2 border border-[#5e7784] rounded w-full"
            placeholder="Enter selling price"
            readOnly
          />
          {errors.sell_price && (
            <p className="text-red-500 text-sm">{errors.sell_price}</p>
          )}
        </div> */}

        {/* <div className="mb-2">
          <label className="block text-blue-950" htmlFor="stock_quantity">
            Stock Quantity
          </label>
          <input
            // type="number"
            min={0}
            id="stock_quantity"
            value={stock_quantity}
            onFocus={() => setInputFocused("stock_quantity")}
            onChange={(e) => { setStock_quantity(e.target.value) }}
            className="mt-1 p-2 border border-[#5e7784] rounded w-full"
            placeholder="Enter stock quantity"
            readOnly
          />
          {errors.stock_quantity && (
            <p className="text-red-500 text-sm">{errors.stock_quantity}</p>
          )}
        </div> */}

        <div className="mb-2">
          <label className="block text-blue-950" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 p-2 border border-[#5e7784] rounded w-full"
          >
            <option value="active">Active</option>
            <option value="deactive">Deactive</option>
          </select>
        </div>

        <div className="col-span-2 flex justify-end">
          {Object.keys(data).length === 0 ? (
            <Button item="Add" handleClick={handleOnClick} />
          ) : (
            <Button item="Update" handleClick={handleOnClick} />
          )}
        </div>
      </form>

      {inputFocused === "name" && (
        // <Keypad input={name} setInput={setName} />
        <DraggableKeypad
          setInputFocused={setInputFocused}
          searchTerm={name}
          setSearchTerm={(data) => {
            setName(data);
            setErrors((prev) => ({ ...prev, name: "" })); // ✅ Clear validation error
          }}
        />
      )}
      {inputFocused === "remark" && (
        // <Keypad input={name} setInput={setName} />
        <DraggableKeypad
          setInputFocused={setInputFocused}
          searchTerm={remark}
          setSearchTerm={(data) => {
            setRemark(data);
            setErrors((prev) => ({ ...prev, remark: "" })); // ✅ Clear validation error
          }}
        />
      )}
      {inputFocused === "barcode" && (
        <DraggableNumpad
          setInputFocused={setInputFocused}
          searchTerm={barcode}
          setSearchTerm={(data) => {
            if (data === "" || /^\d+$/.test(data)) {
              setBarcode(data);
              setErrors((prev) => ({ ...prev, barcode: "" })); // ✅ Clear validation error
            }
          }}
        />
      )}
      {inputFocused === "sell_price" && (
        <DraggableNumpad
          setInputFocused={setInputFocused}
          searchTerm={sell_price}
          setSearchTerm={(data) => {
            if (data === "") {
              setSell_price(""); // Allow clearing input
            } else if (/^\d+(\.\d{0,2})?$/.test(data)) {
              // ✅ Restricts input to max 2 decimal places
              setSell_price(data);
            }
            setErrors((prev) => ({ ...prev, sell_price: "" })); // ✅ Clear validation error
          }}
        />
      )}
      {inputFocused === "original_price" && (
        <DraggableNumpad
          setInputFocused={setInputFocused}
          searchTerm={original_price}
          setSearchTerm={(data) => {
            if (data === "") {
              setOriginal_price(""); // Allow clearing input
            } else if (/^\d+(\.\d{0,2})?$/.test(data)) {
              // Regex ensures only up to 2 decimal places
              setOriginal_price(data);
            }
            setErrors((prev) => ({ ...prev, original_price: "" })); // ✅ Clear validation error
          }}
        />
      )}
      {inputFocused === "stock_quantity" && (
        <DraggableNumpad
          setInputFocused={setInputFocused}
          searchTerm={stock_quantity}
          setSearchTerm={(data) => {
            if (/^\d+$/.test(data)) {
              setStock_quantity(data);
              setErrors((prev) => ({ ...prev, stock_quantity: "" })); // ✅ Clear validation error
            }
          }}
        />
      )}
    </div>
  );
};

export default BarcodeAddEditModal;
