import { useState, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faClipboardCheck,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; // For validation schema
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import markerIconUrl from "/marker-icon.png";
import { v4 as uuid } from "uuid";
import { MdLocationPin } from "react-icons/md";
import debounce from "lodash/debounce";
import axios from "axios";
import SITE_CONFIG from "../../../controller";
import {
  selectNewCartItemCount,
  selectNewCartItemTotalAmount,
} from "../../slices/cart/newcartReducer";
import { updateUserByAddress } from "../../api/updateUserAddress";
import { fetchUserById } from "../../api/fetchUserById";

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

//Icon for Map marker
const markerIcon = new L.Icon({
  iconUrl: markerIconUrl,
  iconSize: [28, 33],
});

const CartItem = ({ item, imageUrl }) => {
  return (
    <div className="flex mb-4 mt-4">
      <img
        src={`${imageUrl}${item.cover}`}
        alt={item.name}
        className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover"
      />
      <div className="ml-4">
        <h4 className="text-sm md:text-md font-semibold mt-6">{item.name}</h4>
      </div>
    </div>
  );
};
const PaymentDetails = ({
  deliveryCharges,
  cartItemTotalAmount,
  isCouponApplied,
  discount,
}) => {
  return (
    <div>
      <h3 className="text-md md:text-lg font-semibold mb-4">Payment Details</h3>
      <div className="flex justify-between text-sm md:text-md">
        <span>Item Total</span>
        <span>$ {parseFloat(cartItemTotalAmount).toFixed(2)}</span>
      </div>
      <hr className="my-2" />
      <div className="flex justify-between text-sm md:text-md">
        <span>Delivery Charges</span>
        <span>$ {deliveryCharges}</span>
      </div>
      <hr className="my-2" />
      {isCouponApplied && (
        <div className="flex justify-between text-sm md:text-md">
          <span>Product Discount</span>
          <span>
            $ {discount}
            {/* {parseFloat((cartItemTotalAmount * discount) / 100).toFixed(2)} */}
          </span>
        </div>
      )}
      {isCouponApplied && <hr className="my-2" />}
      <div className="flex justify-between text-sm md:text-md font-semibold">
        <span>Total Amount</span>
        <span>
          ${" "}
          {(
            parseFloat(cartItemTotalAmount) +
            parseFloat(deliveryCharges) -
            parseFloat(discount)
          ).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

const ConfirmOrderStep = ({
  cartItems,
  setselectaddress,
  setUpdatedAddresses,
  onBackToCart,
  onProceedToPayment,
  setAddressDelivery,
  deliveryCharges,
  discount,
  isCouponApplied,
}) => {
  const cartItemTotalAmount = useSelector(selectNewCartItemTotalAmount);
  const cartItemCount = useSelector(selectNewCartItemCount);
  const { imageUrl } = SITE_CONFIG;
  const [address, SetAddress] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [addressPopup, setAddressPopup] = useState(false);
  const [addressSearchPopup, setAddressSearchPopup] = useState(false);
  const [addressType, setAddressType] = useState("home");
  const [houseText, setHouseText] = useState("");
  const [landmarkText, setLandmarkText] = useState("");
  const [pincodeText, setPincodeText] = useState("");
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [deliveryArea, setDeliveryArea] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [editAddressId, setEditAddressId] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json`
      );

      if (response.status !== 200) {
        throw new Error("Error fetching address suggestions");
      }

      const data = response.data;
      setSuggestions(data.map((item) => item.display_name));
    } catch (error) {
      console.error(error);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
    []
  );

  const handleInputChange = (event) => {
    const { value } = event.target;
    setInputText(value);
    debouncedFetchSuggestions(value);
  };

  const userId = localStorage.getItem("User");

  const validationSchema = Yup.object().shape({
    house: Yup.string()
      // .min(0, 'House number cannot be negative')
      .required("House number is required"),
    landmark: Yup.string().required("Landmark is required"),
    pincode: Yup.number()
      .min(0, "Pincode cannot be negative")
      .required("Pincode is required"),
    addressType: Yup.string().required("Address type is required"),
    // deliveryArea: Yup.string()
    //   .required('Delivery area is required'),
  });

  const updateUserAddress = async (values) => {
    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    const newAddress = {
      title: values.addressType,
      address: values.deliveryArea,
      house: values.house,
      landmark: values.landmark,
      pincode: values.pincode,
      lat: location.latitude || 0,
      lng: location.longitude || 0,
    };
    let updatedAddresses;

    if (editAddressId === null) {
      newAddress.id = uuid();
    } else {
      newAddress.id = editAddressId;
    }

    const updatedAddressesString = JSON.stringify(updatedAddresses);

    try {
      const response = await updateUserByAddress(userId, newAddress);

      if (response.success) {
        getSingleUser();
        // Optionally reset form values here or rely on Formik to do it.
        // For example: resetForm();
      }

      setAddressPopup(false);
      setEditAddressId(null);
    } catch (error) {
      console.error("Error updating user address:", error);
    }
  };

  const handleAddressClick = (address) => {
    setDeliveryArea(address);
    setAddressSearchPopup(false);
    setSuggestions([]);
    setAddressDelivery(address);
    setInputText("");
  };
  const getSingleUser = async () => {
    try {
      const response = await fetchUserById(userId);
      // console.log(response);

      const addressData = response.data.address;
      // console.log(addressData);

      setUserAddresses(addressData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    getSingleUser();
  }, []);
  const addreshandlecall = () => {
    if (!address) {
      toast.error("please select a addres");
      return;
    }
    onProceedToPayment();
  };

  useEffect(() => {
    const handlePosition = async (position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      setDeliveryArea(response.data.display_name);
    };

    navigator.geolocation.getCurrentPosition(handlePosition);
  }, []);

  useEffect(() => {
    if (userAddresses.length !== 0) {
      const deliveryAddress = userAddresses[selectedAddressIndex];
      setAddressDelivery({
        house: deliveryAddress.house,
        landmark: deliveryAddress.landmark,
        address: deliveryAddress.address,
        pincode: deliveryAddress.pincode,
        lat: deliveryAddress.lat,
        lng: deliveryAddress.lng,
        title: deliveryAddress.title,
      });
    }
  }, [selectedAddressIndex]);

  return (
    <>
      <div className="flex justify-center items-center w-full mt-2 mb-6 px-2">
        <div className="w-12/12 md:w-6/12 lg:w-9/12">
          <div className="flex flex-col sm:flex-row justify-between mb-3">
            <h2 className="text-xl md:text-2xl font-bold">Confirm Order</h2>
            <div className="flex items-center justify-center ml-6 mt-1 space-x-4">
              <StepIndicator icon={faShoppingCart} text="Your Cart" />

              <div className="w-8 h-px bg-gray-400"></div>

              <StepIndicator
                icon={faClipboardCheck}
                text="Confirm Order"
                isActive
              />

              <div className="w-8 h-px bg-gray-400"></div>

              <StepIndicator icon={faCreditCard} text="Payment" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Section: Basket/Order Items */}
            <div className="lg:col-span-7 ">
              <div className="relative flex flex-wrap items-start gap-2 p-2">
                <p className="font-bold">Select Address</p>
                <div className="grid grid-cols-1 gap-4 w-full  overflow-y-auto">
                  {userAddresses.map((address, index) => (
                    <div
                      key={index}
                      className={`relative bg-white rounded-lg py-2 px-3 cursor-pointer border`}
                      onClick={() => {
                        SetAddress(true);
                        setSelectedAddressIndex(index);
                      }}
                    >
                      {selectedAddressIndex === index && (
                        <div className="absolute top-2 right-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 bg-red-600 text-white rounded-full"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="text-sm font-bold uppercase">
                        {address.title}
                      </div>
                      <div className="text-sm">
                        <div>
                          {address.house}, {address.landmark}, {address.address}
                        </div>
                        <div>{address.pincode}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  onClick={() => setAddressPopup(true)}
                  className="flex flex-col items-center justify-center  cursor-pointer w-full p-5 bg-red-100 hover:bg-red-300 transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white bg-black rounded-full"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 5v14m-7-7h14"
                    />
                  </svg>
                  <span className="text-black">Add New Address</span>
                </div>
                {(addressPopup || addressSearchPopup) && (
                  <div className="fixed -inset-8 bg-black bg-opacity-50 p-4 flex justify-center items-center z-30 min-h-[600px] overflow-y-auto">
                    {(addressPopup || addressSearchPopup) && (
                      <div className="fixed -inset-8  m-8 bg-opacity-50 p-4 flex justify-center items-center z-30 min-h-[600px] overflow-y-auto">
                        {addressPopup && !addressSearchPopup && (
                          <Formik
                            initialValues={{
                              deliveryArea: deliveryArea,
                              house: houseText,
                              landmark: landmarkText,
                              pincode: pincodeText,
                              addressType: addressType || "home",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={updateUserAddress}
                          >
                            {({ setFieldValue }) => (
                              <Form className="relative bg-white p-4 shadow-lg w-full max-w-lg h-[100%] overflow-y-auto">
                                <button
                                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-3xl"
                                  type="button"
                                  onClick={() => {
                                    setAddressPopup(false);
                                    setFormErrors({});
                                  }}
                                >
                                  &times;
                                </button>
                                <h1 className="text-2xl font-semibold mb-4">
                                  Set your delivery location
                                </h1>

                                {/* Map Section */}
                                <div
                                  style={{
                                    backgroundColor: location
                                      ? "transparent"
                                      : "gray",
                                    height: "200px",
                                    width: "100%",
                                  }}
                                >
                                  {location.latitude ? (
                                    <MapContainer
                                      center={[
                                        location.latitude,
                                        location.longitude,
                                      ]}
                                      zoom={15}
                                      style={{ height: "200px", width: "100%" }}
                                    >
                                      <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                      />
                                      <Marker
                                        position={[
                                          location.latitude,
                                          location.longitude,
                                        ]}
                                        icon={markerIcon}
                                      >
                                        <Popup>
                                          A marker at latitude{" "}
                                          {location.latitude}, longitude{" "}
                                          {location.longitude}.
                                        </Popup>
                                      </Marker>
                                    </MapContainer>
                                  ) : (
                                    <div
                                      style={{
                                        color: "gray",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: "100%",
                                      }}
                                    >
                                      Location services are off. Please turn on
                                      location services to view the map.
                                    </div>
                                  )}
                                </div>

                                {/* Delivery Area */}
                                <div className="mt-4">
                                  <label
                                    htmlFor="deliveryArea"
                                    className="block text-sm font-medium text-gray-700 mb-2 uppercase"
                                  >
                                    Delivery Area
                                  </label>
                                  <div className="relative w-full">
                                    <Field
                                      id="deliveryArea"
                                      name="deliveryArea"
                                      value={deliveryArea}
                                      className={`w-full border border-gray-300 rounded-lg p-2 pr-16`}
                                      placeholder="Enter Delivery Area"
                                      readOnly
                                    />
                                    {/* <ErrorMessage name="deliveryArea" component="p" className="text-[#B91C1C] text-sm" /> */}

                                    <button
                                      type="button"
                                      onClick={() =>
                                        setAddressSearchPopup(true)
                                      }
                                      className="absolute top-1 right-1 h-[70%] text-[#B91C1C] bg-white font-bold rounded-lg px-2 py-1"
                                    >
                                      Change
                                    </button>
                                  </div>
                                </div>

                                {/* House Number */}
                                <label
                                  htmlFor="house"
                                  className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                  House/Flat No
                                </label>
                                <Field
                                  id="house"
                                  name="house"
                                  // required
                                  type="text"
                                  min={0}
                                  className={`w-full border border-gray-300 rounded-lg p-2 mb-2`}
                                />
                                <ErrorMessage
                                  name="house"
                                  component="p"
                                  className="text-[#B91C1C] text-sm"
                                />

                                {/* Landmark */}
                                <label
                                  htmlFor="landmark"
                                  className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                  Landmark
                                </label>
                                <Field
                                  id="landmark"
                                  name="landmark"
                                  // required
                                  type="text"
                                  className={`w-full border border-gray-300 rounded-lg p-2 mb-2`}
                                />
                                <ErrorMessage
                                  name="landmark"
                                  component="p"
                                  className="text-[#B91C1C] text-sm"
                                />

                                {/* Pincode */}
                                <label
                                  htmlFor="pincode"
                                  className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                  Pincode
                                </label>
                                <Field
                                  id="pincode"
                                  name="pincode"
                                  type="number"
                                  // required
                                  min={0}
                                  className={`w-full border border-gray-300 rounded-lg p-2 mb-2`}
                                />
                                <ErrorMessage
                                  name="pincode"
                                  component="p"
                                  className="text-[#B91C1C] text-sm"
                                />

                                {/* Address Type */}
                                <label
                                  htmlFor="addressType"
                                  className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                  Address Type
                                </label>
                                <Field
                                  as="select"
                                  id="addressType"
                                  name="addressType"
                                  className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                                >
                                  <option value="home">Home</option>
                                  <option value="work">Work</option>
                                  <option value="office">Office</option>
                                </Field>
                                <ErrorMessage
                                  name="addressType"
                                  component="p"
                                  className="text-[#B91C1C] text-sm"
                                />

                                <div className="flex justify-center mt-5">
                                  <button
                                    type="submit"
                                    className="bg-[#B91C1C] text-white h-10 w-20 mr-5"
                                  >
                                    CREATE
                                  </button>
                                  <button
                                    type="button"
                                    className="text-[#B91C1C] h-10 w-20 border-2 border-[#B91C1C] bg-white"
                                    onClick={() => {
                                      setAddressPopup(false);
                                      setHouseText("");
                                      setLandmarkText("");
                                      setPincodeText("");
                                      setAddressType("");
                                      // Resetting form values will be handled by Formik on submission or reset
                                    }}
                                  >
                                    CANCEL
                                  </button>
                                </div>
                              </Form>
                            )}
                          </Formik>
                        )}

                        {addressSearchPopup && (
                          <div className="fixed inset-0 bg-white left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 justify-center shadow-md z-50 lg:w-[60%] w-[90%] ">
                            <h1 className="font-semibold text-2xl">
                              Search Location
                            </h1>
                            <br />
                            <input
                              type="text"
                              placeholder="Search"
                              value={inputText}
                              onChange={handleInputChange}
                              className="w-full p-2 border-b-2 border-gray-400"
                            />
                            <ul className="mt-2 overflow-auto h-[70%]">
                              {suggestions.map((address) => (
                                <li
                                  key={address}
                                  onClick={() => handleAddressClick(address)}
                                  className="cursor-pointer flex hover:bg-gray-100 p-2 rounded-md"
                                >
                                  <MdLocationPin
                                    color="gray"
                                    size={22}
                                    className="mr-2"
                                  />
                                  {address}
                                </li>
                              ))}
                            </ul>
                            <button
                              onClick={() => {
                                setAddressSearchPopup(false);
                                setSuggestions([]);
                                setInputText("");
                              }}
                              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-3xl"
                            >
                              &times;
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {addressSearchPopup && (
                      <div className="fixed inset-0 bg-white left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 justify-center shadow-md z-50 lg:w-[60%] w-[90%] ">
                        <h1 className="font-semibold text-2xl">
                          Search Location
                        </h1>
                        <br />
                        <input
                          type="text"
                          placeholder="Search"
                          value={inputText}
                          onChange={handleInputChange}
                          className="w-full p-2 border-b-2 border-gray-400"
                        />
                        <ul className="mt-2 overflow-auto h-[70%]">
                          {suggestions.map((address) => (
                            <li
                              key={address}
                              onClick={() => handleAddressClick(address)}
                              className="cursor-pointer flex hover:bg-gray-100 p-2 rounded-md"
                            >
                              <MdLocationPin
                                color="gray"
                                size={22}
                                className="mr-2"
                              />
                              {address}
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => {
                            setAddressSearchPopup(false);
                            setSuggestions([]);
                            setInputText("");
                          }}
                          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-3xl"
                        >
                          &times;
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <h3 className="text-md font-semibold">
                  Basket{" "}
                  <span className="text-gray-500">
                    ({cartItemCount} item{cartItemCount > 1 ? "s" : ""})
                  </span>
                </h3>
                <h3 className="text-sm md:text-md font-semibold">
                  $ {parseFloat(cartItemTotalAmount).toFixed(2)}
                </h3>
              </div>
              <div className="flex items-center mt-1">
                {cartItems.product_details.slice(0, 3).map((item, index) => {
                  // console.log(item);

                  return (
                    <div
                      key={index}
                      className={`relative ${index > 0 ? "-ml-3" : ""}`}
                    >
                      <img
                        src={`${imageUrl}${item.product.cover}`}
                        alt={item.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>
                  );
                })}
                {cartItems.product_details.length > 3 && (
                  <div className="font-bold ml-2  ">
                    +{cartItems.product_details.length - 3} more
                  </div>
                )}
              </div>
              {/* {cartItems.product_details.map((item) => ( */}
              {/* // <CartItem key={item.product._id} item={item.product} imageUrl={imageUrl} /> */}

              {/* ))} */}
              <hr className="mt-2" />
            </div>
            {/* Right Section: Payment Details */}
            <div className="lg:col-span-5">
              <PaymentDetails
                cartItems={cartItems}
                deliveryCharges={deliveryCharges.toFixed(2)}
                cartItemTotalAmount={cartItemTotalAmount}
                discount={discount}
                isCouponApplied={isCouponApplied}
                // discountType={discountType}
              />
              <div className="flex justify-between mt-12 pr-4 pl-4 ">
                <button
                  className="px-6 py-2 text-white"
                  style={{ background: "#be0500" }}
                  onClick={onBackToCart}
                >
                  Back
                </button>
                <button
                  className="py-2 ml-4 px-6 text-white"
                  style={{ background: "#be0500" }}
                  onClick={addreshandlecall}
                >
                  Make Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrderStep;
