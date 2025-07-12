import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faClipboardCheck,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { addOrder } from "../../api/addOrder";
import {
  selectNewCartItemCount,
  selectNewCartItemTotalAmount,
} from "../../slices/cart/newcartReducer";
import { emptyCart } from "../../slices/cart/cartActions";
import SITE_CONFIG from "../../../controller";
import { sendEmail } from "../../api/sendemail";
import { fetchUserById } from "../../api/fetchUserById";
import logo from "../../assets/logo.png";
import { userEmail } from "../../assets/userEmail";
import {loadStripe} from '@stripe/stripe-js';
import { addStripePayment } from "../../api/stripe";


const StepIndicator = ({ icon, text, isActive }) => (
  <div
    className={`flex items-center space-x-2 ${isActive ? "text-red-500" : "text-gray-500"
      }`}
  >
    <FontAwesomeIcon icon={icon} />
    <div className="text-xs md:text-sm">{text}</div>
  </div>
);

const PaymentDetails = ({ details }) => (
  <div>
    {details.map(({ label, amount }, index) => (
      <React.Fragment key={label}>
        <div className="flex justify-between text-sm md:text-md">
          <span>{label}</span>
          <span>{amount}</span>
        </div>
        {index < details.length - 1 && <hr className="my-2" />}
      </React.Fragment>
    ))}
  </div>
);

const PaymentStep = ({
  onBackToConfirm,
  onBackToCart,
  deliveryCharges,
  couponCode,
  discountType,
  cartItems,
  orderDetail,
  updatedAddresses,
  setOrderDetail,
  discount,
  deliverytype,
  isCouponApplied,
  notes,
  pickupdate,
}) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [userprofile, setUserprofile] = useState("");
  const cartItemTotalAmount = useSelector(selectNewCartItemTotalAmount);
  const cartItemCount = useSelector(selectNewCartItemCount);
  const storeSliceData = useSelector((state) => state.storeData);
  const user = localStorage.getItem("User") || "";
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  localStorage.setItem("discountType", discountType);

  // let orderNumber = uuidv4();
  // console.log(orderNumber);
  // orderNumber = orderNumber.slice(0, 10);
  let orderNumber = Math.floor(100000 + Math.random() * 900000);
  //console.log(orderNumber);

  // useEffect(() => {
  //   const fetchPaymentOptions = async () => {
  //     try {
  //       const response = await axios.get(`${SITE_CONFIG.apiIP}/api/payment`, {
  //         headers: {
  //           Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
  //         },
  //       });
  //       if (Array.isArray(response.data)) {
  //         setPaymentMethods(response.data);
  //       } else {
  //         console.error("Expected an array of payment methods");
  //         setPaymentMethods([]); // Set default value if response is not an array
  //       }
  //     } catch (error) {
  //       console.error(
  //         "Error fetching payment options:",
  //         error.response || error.message || error
  //       );
  //     }
  //   };

  //   fetchPaymentOptions();
  // }, []);

  function generateSimpleUID() {
    return "xxxxxx".replace(/[x]/g, () => {
      return ((Math.random() * 16) | 0).toString(16);
    });
  }
  const uid = generateSimpleUID();

  const [paymentType, setPaymentType] = useState(false);



  const handlepayment = () => {
    if (!paymentType) {
      toast.error("please select a Payment mode");
      return;
    }
    {
      paymentType && placeOrder();
    }
  };

  const handlePaymentChange = (e) => {
    setPaymentType(e.target.value);
  };


  const getSingleUserdetail = async () => {
    try {
      const response = await fetchUserById(user);
      // console.log(response);

      setUserprofile(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getSingleUserdetail()
  }, [])

  // console.log(userprofile);


  useEffect(() => {
    const transformCartItems = (cartItems) => {
      const { product_details } = cartItems;
      // console.log(product_details);

      if (!Array.isArray(product_details)) {
        console.error("Expected product_details to be an array.");
        return [];
      }
      // console.log(product_details);

      const transformedItems = product_details.map((item) => {
        return { ...item };
      });
      // console.log(transformedItems);
      return transformedItems;
    };

    console.log(storeSliceData.store)

    const calculateOrderDetail = () => {
      const transformedCartItems = transformCartItems(cartItems);
      const subtotal = parseFloat(cartItemTotalAmount);
      const discountAmount = isCouponApplied ? discount : 0;
      const totalAmount = subtotal + deliveryCharges - discountAmount;

      setOrderDetail({
        ...orderDetail,
        product_details: JSON.stringify(transformedCartItems),
        store_id: storeSliceData.store?._id,
        address: updatedAddresses,
        payment_mode: "STRIPE",
        order_number: orderNumber,
        sub_total: subtotal,
        surcharge: 0, // Changed from "na" to 0
        delivery_charge: deliveryCharges,
        coupon_code: couponCode || "NA", // Ensure it's an empty string if not provided
        discount,
        order_type: "online",
        change_amount: 0,
        tender_amount: 0,
        split_cash_amount: 0, // Ensure it's an empty string if not used
        split_card_amount: 0,
        reference_id: "NA", // Ensure it's an empty string or set appropriately
        status: "paid",
        grand_total: totalAmount,
        notes: notes || "",
        user_id: user,
        unique_id: uid,
        tip_amount: 0,
        pickup_date: pickupdate,
        store_name: storeSliceData.store?.name,
        deliverytype: deliverytype, // Ensure it's an empty string or set appropriately
        payment_status:"pending"
      });
    };

    calculateOrderDetail();
  }, [
    cartItems,
    cartItemCount,
    cartItemTotalAmount,
    deliveryCharges,
    couponCode,
    discount,
    isCouponApplied,
    storeSliceData.store?._id,
    user,
  ]);


  



  // const placeOrder = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await addOrder(orderDetail);
  //     if (response.success) {
  //       setPaymentMethods(response.data);
  //       toast.success("Order Placed Successfully");
  //       dispatch(emptyCart(storeSliceData.store?._id, user));
  //       navigate(`${SITE_CONFIG.linkPath}/home`);
  //     }
  //     const useremailData = userEmail(orderDetail, userprofile, storeSliceData);
  //     // console.log(useremailData);
  //     if (useremailData) {
  //       const data = await sendEmail(useremailData);
  //     } else {
  //       toast.error("Email data is invalid. Email not sent.");
  //     }

  //     const adminEmailData = hotelAdminEmail(orderDetail, userprofile, storeSliceData);

  //     if (adminEmailData) {
  //       const data = await sendEmail(adminEmailData);
  //     } else {
  //       toast.error("Admin email data is invalid. Email not sent.");
  //     }




  //   } catch (error) {
  //     console.error(
  //       "Error placing order:",
  //       error.response || error.message || error
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };


console.log(cartItems);


const makepayment = async () => {
  try {
    const stripe = await loadStripe("pk_test_51RMJDhGaEKZL1IJGkOs9FWwZ3N9O5X9H6NbysrNuqeqXYKGkC5FB28MnK2GJfgG12PvLeEevS3bv2j7qVdPKv8Cw00vNBeALi3");

    // if (!stripe) {
    //   console.error("Stripe failed to load.");
    //   return;
    // }

    const response = await addStripePayment(cartItems,orderDetail);
    
    // ✅ Check if response is valid
    // if (!response || !response.json) {
    //   console.error("Invalid response from Stripe session request:", response);
    //   return;
    // }

    // const session = await response.json();
    console.log(response);
    

    const result = await stripe.redirectToCheckout({
      sessionId: response.data.id
    });

    if (result.error) {
      console.error("Stripe redirect error:", result.error.message);
    }
  } catch (error) {
    console.error("Payment error:", error);
  }
};


  


  const activePaymentMethods = Array.isArray(paymentMethods)
    ? paymentMethods.filter((method) => method.status === "active")
    : [];

  const paymentDetails = [
    {
      label: "Item Total",
      amount: `$${parseFloat(cartItemTotalAmount).toFixed(2)}`,
    },
    { label: "Delivery Charges", amount: `$${deliveryCharges.toFixed(2)}` },
    ...(isCouponApplied
      ? [
        {
          label: "Product Discount",
          amount: `$${discount}`,
        },
      ]
      : []),
    {
      label: "Total Amount",
      amount: `$${(
        parseFloat(cartItemTotalAmount) +
        deliveryCharges -
        discount
      ).toFixed(2)}`,
      isBold: true,
    },
  ];

  return (
    <div className="flex justify-center items-center mt-2 mb-6">
      <div className="w-12/12 md:w-7/12 lg:w-9/12">
        <div className="flex flex-col sm:flex-row justify-between mb-3">
          <h1 className="text-xl md:text-2xl font-bold">Payment</h1>
          <div className="flex items-center justify-center ml-6 mt-1 space-x-4">
            <StepIndicator icon={faShoppingCart} text="Your Cart" />
            <div className="w-8 h-px bg-gray-400"></div>
            <StepIndicator icon={faClipboardCheck} text="Confirm Order" />
            <div className="w-8 h-px bg-gray-400"></div>
            <StepIndicator icon={faCreditCard} text="Payment" isActive />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
  <div className="mt-2 flex items-center space-x-2 shadow-md rounded-md p-4">
    {/* Always selected radio button */}
    <input
      type="radio"
      name="payment"
      id="payment-method-stripe"
      value="stripe"
      checked={true} // Ensures it's always selected
      readOnly // Prevents user from deselecting
    />
    
    {/* Stripe Logo */}
    <img
      src="/stripe.png" 
      alt="Stripe"
      className="w-32 h-auto"
    />

    {/* <span className="text-md">Stripe</span> */}
  </div>
</div>

          <div className="lg:col-span-5">
            <h3 className="text-md md:text-lg font-semibold mb-4">
              Payment Details
            </h3>
            <PaymentDetails details={paymentDetails} />
            <div className="flex justify-between mt-12 w-full pl-4 pr-4">
              <button
                className="px-6 py-2 text-white "
                style={{ background: "#be0500" }}
                onClick={
                  deliverytype === "pickup" ? onBackToCart : onBackToConfirm
                }
              >
                Back
              </button>
              <Link>
                <button
                  className="py-2 px-8 text-white "
                  style={{ background: "#be0500" }}
                  onClick={makepayment}
                  disabled={loading}
                >
                  Complete Payment
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
