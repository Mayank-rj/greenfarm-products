import { useEffect, useState } from "react";
import CartStep from "./CartStep";
import ConfirmOrderStep from "./ConfirmOrderStep";
import PaymentStep from "./PaymentStep";
import { useDispatch, useSelector } from "react-redux";
import emptyCart from "../../assets/emptyCart.jpg";
import { fetchCartDetails } from "../../slices/cart/cartActions";
import { fetchProductBySidnId } from "../../api/fetchProductBySidnId";
import { toast } from "react-toastify";

const Cart = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const dispatch = useDispatch();
  const [cartData, setCartData] = useState({});
  const { cart, error, loading } = useSelector((state) => state.newCart);
  const [isLoggedIn, setIsLoggedIn] = useState();
  const storeSliceData = useSelector((state) => state.storeData);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [updatedAddresses, setUpdatedAddresses] = useState("NA");
 
  

  const [addressDelivery, setAddressDelivery] = useState({
    house: "",
    landmark: "",
    address: "",
    pincode: 0,
    lat: 0,
    lng: 0,
    title: "",
  });
  const [couponCode, setCouponCode] = useState("");
  const [deliverytype, setDeliverytype] = useState("delivery");
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("");
  const [notes, setnotes] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  let auth = localStorage.getItem("AuthToken");
  let user = localStorage.getItem("User");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectaddress, setselectaddress] = useState("");
  const [pickupdate, setpickupdate] = useState("");
  // console.log(pickupdate);

  const [orderDetail, setOrderDetail] = useState({
    product_details: "",
    store_id: storeSliceData.store?._id,
    address: addressDelivery,
    payment_mode: "eftpos",
    order_number: "",
    sub_total: 0,
    surcharge: "NA",
    delivery_charge: 0,
    coupon_code: "0",
    discount: 0,
    order_type: "online",
    change_amount: 0,
    tender_amount: 0,
    split_cash_amount: 0,
    split_card_amount: 0,
    reference_id: "1",
    status: "NA",
    grand_total: 0,
    notes: "",
    user_id: user,
    unique_id: "0",
    tip_amount: 0,
    pickup_date: "",
    store_name: "",
    setdelivarytype: "",
    isPrinted: false,
    date_time: new Date().toISOString(),
    payment_status:""
  });
  const [isActive, setIsActive] = useState(true);
  const [deactiveProductName, setDeactiveProductName] = useState("");
  const [deactiveProductIds, setDeactiveProductIds] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const letters = new Set();

  useEffect(() => {
    setIsLoggedIn(!!(auth && user));
  }, [auth, user]);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };
  const handlePlaceOrder = async () => {
    setIsLoading(true);
    const productIds = cart?.product_details;
    let flag = true;

    //! PRDUCTdATA PROMISE
    const productDataPromises = productIds?.map(async (product) => {
      const fetchProduct = await fetchProductBySidnId(
        storeSliceData.store?._id,
        product.product
      );

      if (fetchProduct[0].status === "deactive") {
        flag = false;
        // console.log(fetchProduct);
        let current_ans = letters.has(fetchProduct[0]._id);
        if (current_ans) {
        } else if (fetchProduct[0]?.variations?.length > 0) {
          letters.add(fetchProduct[0]._id);
          toast.error(
            `${fetchProduct[0].name} and its variations is currently not available.`
          );
        } else {
          toast.error(`${fetchProduct[0].name} is currently not available.`);
        }
      }
      return {
        ...product,
        product: fetchProduct[0],
      };
    });
    const productData = await Promise.all(productDataPromises);
    // console.log(productData)
    setIsLoading(false);
    if (flag) {
      setCurrentStep(2);
    }
  };

  const handleBackToCart = () => {
    setCurrentStep(1);
  };

  const onBackToConfirm = () => {
    setCurrentStep(2);
  };

  const handleProceedToPayment = () => {
    setCurrentStep(3);
  };

  // Always execute the hooks above this line
  useEffect(() => {
    const addresses = `${addressDelivery.house}, ${addressDelivery.landmark}, ${addressDelivery.address}`;
    setUpdatedAddresses(addresses);
  }, [addressDelivery, selectaddress]);

  // console.log(updatedAddresses)

  useEffect(() => {
    if (!storeSliceData.isEmpty) {
      if (user) {
        dispatch(fetchCartDetails(storeSliceData.store?._id, user));
      } else {
        dispatch(fetchCartDetails(storeSliceData.store?._id, null));
      }
    }
  }, []);

  useEffect(() => {
    const fetchProductDataforCart = async () => {
      const productIds = cart?.product_details;
      // console.log(productIds)
      const productDataPromises = productIds?.map(async (product) => {
        const fetchProduct = await fetchProductBySidnId(
          storeSliceData.store?._id,
          product.product
        );
        // console.log(fetchProduct[0].status);
        if (fetchProduct[0].status === "deactive") {
          setIsActive(false);
        }
        return {
          ...product,
          product: fetchProduct[0],
        };
      });
      const productData = await Promise.all(productDataPromises);

      let updatedCart = { ...cart, product_details: productData };
      // console.log(updatedCart);
      setCartData(updatedCart);
    };
    if (!storeSliceData.isEmpty) {
      fetchProductDataforCart();
    }
  }, [cart]);

  if (cart?.product_details?.length === 0 || cart?.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-11">
        <img src={emptyCart} height={200} width={200} alt="Empty Cart" />
        <p>No items found</p>
      </div>
    );
  }
  return (
    <div>
      {currentStep === 1 && (
        <CartStep
          cartItems={cartData}
          onPlaceOrder={handlePlaceOrder}
          handleProceedToPayment={handleProceedToPayment}
          isPopupVisible={isPopupVisible}
          onTogglePopup={togglePopup}
          isLoggedIn={isLoggedIn}
          orderDetail={orderDetail}
          setIsLoggedIn={setIsLoggedIn}
          deliveryCharges={deliveryCharges}
          setDeliveryCharges={setDeliveryCharges}
          discountType={discountType}
          setDiscountType={setDiscountType}
          discount={discount}
          setDiscount={setDiscount}
          isCouponApplied={isCouponApplied}
          setIsCouponApplied={setIsCouponApplied}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          setDeliverytype={setDeliverytype}
          setnotes={setnotes}
          notes={notes}
          setpickupdate={setpickupdate}
          isLoading={isLoading}
        />
      )}
      {currentStep === 2 && (
        <ConfirmOrderStep
          cartItems={cartData}
          setUpdatedAddresses={setUpdatedAddresses}
          setselectaddress={setselectaddress}
          onBackToCart={handleBackToCart}
          onProceedToPayment={handleProceedToPayment}
          isLoggedIn={isLoggedIn}
          orderDetail={orderDetail}
          discountType={discountType}
          setAddressDelivery={setAddressDelivery}
          deliveryCharges={deliveryCharges}
          discount={discount}
          setDiscount={setDiscount}
          isCouponApplied={isCouponApplied}
          setIsCouponApplied={setIsCouponApplied}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
        />
      )}
      {currentStep === 3 && (
        <PaymentStep
          isLoggedIn={isLoggedIn}
          onBackToConfirm={onBackToConfirm}
          onBackToCart={handleBackToCart}
          deliveryCharges={deliveryCharges}
          discount={discount}
          discountType={discountType}
          orderDetail={orderDetail}
          updatedAddresses={updatedAddresses}
          cartItems={cartData}
          setOrderDetail={setOrderDetail}
          couponCode={couponCode}
          isCouponApplied={isCouponApplied}
          deliverytype={deliverytype}
          notes={notes}
          pickupdate={pickupdate}
        />
      )}
    </div>
  );
};

export default Cart;
