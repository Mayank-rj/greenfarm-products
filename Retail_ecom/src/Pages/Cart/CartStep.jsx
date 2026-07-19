import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faClipboardCheck,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import Login from "../../Components/Login/Login";
import { useNavigate } from "react-router-dom";
import { FaLocationPin } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { addWeeks, startOfToday } from "date-fns";
import { toast } from "react-toastify";

import "./CartStep.css";
import CartItem from "./CartItem";
import {
  selectNewCartItemCount,
  selectNewCartItemTotalAmount,
} from "../../slices/cart/newcartReducer";
import CouponModal from "./CouponModal";
import {
  newaddItemToCart,
  newremoveItemFromCart,
} from "../../slices/cart/cartActions";
import { fetchCoupan } from "../../api/fetchCoupan";
import SITE_CONFIG from "../../../controller";

const StepIndicator = ({ icon, text, isActive }) => (
  <div
    className={`flex items-center space-x-2 ${
      isActive ? "text-red-500" : "text-gray-500"
    }`}
  >
    <FontAwesomeIcon icon={icon} />
    <div className="text-xs md:text-sm">{text}</div>
  </div>
);

const CartStep = ({
  cartItems,
  onPlaceOrder,
  onTogglePopup,
  isPopupVisible,
  isLoggedIn,
  setIsLoggedIn,
  deliveryCharges,
  setDeliveryCharges,
  discount,
  setDiscount,
  discountType,
  setDiscountType,
  isCouponApplied,
  setIsCouponApplied,
  couponCode,
  setCouponCode,
  setDeliverytype,
  handleProceedToPayment,
  setnotes,
  notes,
  setpickupdate,
  setdelivarytype,
  isLoading = { isLoading },
}) => {
  const { cart, error, loading } = useSelector((state) => state.newCart);
  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const dispatch = useDispatch();
  const cartItemCount = useSelector(selectNewCartItemCount);
  const cartItemTotalAmount = useSelector(selectNewCartItemTotalAmount);
  const [openLogin, setOpenLogin] = useState(false);
  const [coupons, setcoupan] = useState([]);
  const storeSliceData = useSelector((state) => state.storeData);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const navigate = useNavigate();
  const handleEditCartItem = (item) => {
    // localStorage.setItem("productData", JSON.stringify(item.item));
    if (item.variationId) {
      navigate(
        `${SITE_CONFIG.linkPath}/product/${item.product._id}/${item.variationId}`
      );
    } else {
      navigate(`${SITE_CONFIG.linkPath}/product/${item.product._id}`);
    }
  };
  const today = startOfToday();
  let user = localStorage.getItem("User");

  const handleIncrease = (id, data) => {
    // dispatch(incrementItemQuantity(id));
    let existingData = [...cart.product_details];
    // console.log();
    dispatch(
      newaddItemToCart(
        storeSliceData.store?._id,
        user,
        {
          ...data,
          product: data.product._id,
          quantity: data.quantity + 1,
          price: (data.price / data.quantity) * (data.quantity + 1),
        },
        existingData
      )
    );
  };

  const handleDecrease = (id, data) => {
    let existingData = [...cart.product_details];
    if (data.quantity === 1) {
      dispatch(
        newremoveItemFromCart(
          storeSliceData.store?._id,
          user,
          data.product._id,
          data.variationId,
          existingData
        )
      );
    } else {
      dispatch(
        newaddItemToCart(
          storeSliceData.store?._id,
          user,
          {
            ...data,
            product: data.product._id,
            quantity: data.quantity - 1,
            price: (data.price / data.quantity) * (data.quantity - 1),
          },
          existingData
        )
      );
    }
    // dispatch(decrementItemQuantity(id));
  };

  // Calculate the date one week from today
  const oneWeekFromToday = addWeeks(today, 1);
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsDateSelected(true);
  };

  const handleDeliveryOptionChange = (e) => {
    setDeliveryOption(e.target.value);
    setDeliverytype(e.target.value);
    setSelectedDate(null);
    setIsDateSelected(false);
  };

  const handlePlaceOrder = () => {
    if (deliveryOption === "pickup" && !isDateSelected) {
      toast.error("Please select a pickup date");
      return;
    }
    if (deliveryOption === "pickup" && isDateSelected) {
      handleProceedToPayment();
    } else {
      onPlaceOrder();
    }
  };

  useEffect(() => {
    if (deliveryOption === "delivery") {
      setDeliveryCharges(20);
    } else {
      setDeliveryCharges(0);
    }
  }, [deliveryOption]);

  const handleDeleteCartItem = (item) => {
    let existingData = [...cart.product_details];
    dispatch(
      newremoveItemFromCart(
        storeSliceData.store?._id,
        user,
        item.product._id,
        item.variationId,
        existingData
      )
    );
    // dispatch(removeItemFromCart(id));
  };
  const handleShowLogin = () => {
    setOpenLogin(true);
  };

  const getcoupan = async () => {
    try {
      const response = await fetchCoupan();

      const activeCoupons = response.filter(
        (coupon) => coupon.status === "active"
      );
      setcoupan(activeCoupons);
    } catch (error) {
      console.error("Error fetching store data:", error);
    }
  };

  useEffect(() => {
    getcoupan();
  }, []);

  const handleInputChange = (e) => {
    setIsCouponApplied(false);
    setCouponCode(e.target.value);
    setDiscount(0);
  };

  const handleApplyCoupon = (couponcode) => {
    if (cartItemTotalAmount < 100) {
      toast.error("Sorry minimum cart value must be 100 or equal");

      return;
    }

    // console.log(coupons);

    const matchedCoupon = coupons.find(
      (coupon) => coupon.coupon_code === couponcode
    );

    if (matchedCoupon) {
      setIsCouponApplied(true);
      setDiscountType(matchedCoupon.discount_type);
      //  setDiscount((matchedCoupon.discount_value));
      setDiscount(
        matchedCoupon.discount_type === "flat"
          ? parseFloat(matchedCoupon.discount_value).toFixed(2)
          : parseFloat(
              (cartItemTotalAmount * matchedCoupon.discount_value) / 100
            ).toFixed(2)
      );
      toast.success("Coupon code applied !");
    } else {
      toast.error("Invalid coupon code");
      setIsCouponApplied(false);
      setDiscount(0);
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setCouponCode("");
    toast.success("Removed coupon code");
    setIsCouponApplied(false);
  };
  useEffect(() => {
    if (cartItemTotalAmount < 100 && isCouponApplied) {
      handleRemoveCoupon();
    }
  }, [cartItemTotalAmount, isCouponApplied]);

  return (
    <>
      {openLogin && (
        <Login
          openLogin={openLogin}
          setOpenLogin={setOpenLogin}
          setIslogin={setIsLoggedIn}
        />
      )}
      <div className="container mx-auto p-2 md:p-8 max-w-6xl">
        {/* Cart Steps */}
        <div className="flex flex-col sm:flex-row justify-between">
          <h2 className="md:text-2xl font-bold ml-6">Cart</h2>
          <div className="flex items-center justify-center ml-6 mt-1 space-x-2">
            <StepIndicator icon={faShoppingCart} text="Your Cart" isActive />

            <div className="w-16 h-px bg-gray-400"></div>

            <StepIndicator icon={faClipboardCheck} text="Confirm Order" />

            <div className="w-16 h-px bg-gray-400"></div>

            <StepIndicator icon={faCreditCard} text="Payment" />
          </div>
        </div>

        {/* Cart Items */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-10 mt-4">
          {/* Left Section - Cart Items */}

          <div className="lg:col-span-7">
            <div className="flex justify-between mx-4">
              <h3 className="text-xs font-semibold md:text-sm">
                Basket{" "}
                <span className="text-gray-500 text-xs md:text-sm">
                  ({cartItemCount} item{cartItemCount > 1 ? "s" : ""})
                </span>
              </h3>
              <h3 className="text-xs font-semibold md:text-sm">
                ${parseFloat(cartItemTotalAmount).toFixed(2)}
              </h3>
            </div>

            {cartItems?.product_details?.map((item, index) => (
              <CartItem
                key={item._id}
                item={item}
                handleDeleteCartItem={handleDeleteCartItem}
                handleEditCartItem={handleEditCartItem}
                handleDecrease={handleDecrease}
                handleIncrease={handleIncrease}
              />
            ))}
          </div>

          <div className="lg:col-span-5">
            <div className="p-4 space-y-6 md:p-6 md:space-y-8">
              {!isLoggedIn && (
                <div className="mt-2">
                  <h3 className="text-md font-semibold">Authentication</h3>
                  <p className="mt-2">
                    <a
                      className="underline"
                      style={{ color: "#be0500" }}
                      onClick={handleShowLogin}
                    >
                      Log in
                    </a>{" "}
                    to see the best offers and cashback deals
                  </p>
                </div>
              )}

              {/* Apply Coupon */}
              <div>
                <div className="flex justify-between">
                  <h3 className="text-md font-semibold">Apply Coupon</h3>
                  <div
                    className="inline-block mt-2 text-sm cursor-pointer"
                    style={{ color: "#be0500" }}
                    onClick={() => {
                      // e.preventDefault();
                      if (isLoggedIn) onTogglePopup();
                      else {
                        handleShowLogin();
                      }
                    }}
                  >
                    View deals
                  </div>
                </div>
                <div className="flex mt-2">
                  <input
                    value={cartItemTotalAmount > 100 ? couponCode : ""}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Enter coupon code"
                    className="flex-grow rounded-l-lg focus:outline-none"
                  />
                  {!isCouponApplied && (
                    <button
                      onClick={() => {
                        if (isLoggedIn) {
                          handleApplyCoupon(couponCode);
                        } else {
                          handleShowLogin();
                        }
                      }}
                      className="p-2 text-gray-600 border-none rounded-r-lg"
                    >
                      APPLY
                    </button>
                  )}

                  {isCouponApplied && (
                    <button
                      onClick={handleRemoveCoupon}
                      className="p-2 text-gray-600 border-none rounded-r-lg"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <hr />
                <CouponModal
                  isVisible={isPopupVisible}
                  onToggle={onTogglePopup}
                  coupons={coupons}
                  couponCode={couponCode}
                  setCouponCode={setCouponCode}
                  handleApplyCoupon={handleApplyCoupon}
                />
              </div>

              <div>
                <h3 className="text-md font-semibold">Payment Details</h3>
                <div className="mt-4">
                  <div className="flex justify-between mb-3">
                    <span>Item Total</span>
                    <span>$ {parseFloat(cartItemTotalAmount).toFixed(2)}</span>
                  </div>
                  <hr />

                  <div className="flex justify-between mt-2 mb-3">
                    <span>Delivery Charges</span>
                    <span>$ {deliveryCharges.toFixed(2)}</span>
                  </div>
                  <hr />
                  {isCouponApplied && (
                    <div className="flex justify-between mt-2 mb-3">
                      <span>Discount</span>
                      <span>$ {discount}</span>
                    </div>
                  )}
                  <hr />
                  <div className="flex justify-between mt-2 font-semibold">
                    <span>Total Amount</span>
                    <span>
                      ${" "}
                      {(
                        parseFloat(cartItemTotalAmount) +
                        parseFloat(deliveryCharges) -
                        discount
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Special Notes */}
              <div>
                <h3 className="text-md">Special Notes</h3>
                <textarea
                  className="w-full p-1 mt-2 border rounded-md focus:outline-none"
                  value={notes}
                  placeholder="Please mention your delivery date / pickup date here"
                  onChange={(e) => setnotes(e.target.value)}
                />
              </div>

              {/* Delivery Options */}
              <div>
                <h3 className="text-md font-semibold">Delivery Options</h3>
                <div className="mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="delivery"
                      value="delivery"
                      checked={deliveryOption === "delivery"}
                      onChange={(e) => {
                        handleDeliveryOptionChange(e);
                        setDeliverytype(e.target.value);
                      }}
                    />
                    <span className="text-md">At Home 🏠</span>
                  </label>
                  <label className="flex items-center mt-2 space-x-2">
                    <input
                      type="radio"
                      name="pickup"
                      value="pickup"
                      checked={deliveryOption === "pickup"}
                      onChange={(e) => {
                        handleDeliveryOptionChange(e); // Update local state
                        setDeliverytype(e.target.value); // Update parent state
                      }}
                    />
                    <span className="text-md">Self Pickup 🏬</span>
                  </label>
                </div>
              </div>

              {/* Receive At */}
              {deliveryOption === "pickup" && (
                <div className="text-md font-semibold flex items-center gap-2">
                  <FaCalendarAlt />
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                      handleDateChange(date);
                      setpickupdate(date);
                    }}
                    minDate={today}
                    maxDate={oneWeekFromToday}
                    dateFormat="yyyy/MM/dd"
                    placeholderText={`Select Pick up Date`}
                    className="w-56 "
                  />
                </div>
              )}

              {/* Store (conditionally rendered) */}
              {deliveryOption === "pickup" && (
                <div>
                  <h3 className="text-md font-semibold">Store</h3>
                  <div className="mt-2">
                    <p className="text-sm font-bold flex items-center">
                      <span className="mr-2">
                        <FaLocationPin />
                      </span>
                      {storeSliceData.store?.name}
                    </p>
                    <p className="text-xs">{storeSliceData.store?.address}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="w-1/2 px-4 py-2 text-white"
                style={{ background: "#be0500" }}
                disabled={isLoading ? true : false}
                onClick={isLoggedIn ? handlePlaceOrder : handleShowLogin}
              >
                {isLoading ? "Loading" : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      /> */}
    </>
  );
};

export default CartStep;
