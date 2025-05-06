import { useState, useEffect, useCallback } from "react";
import ProfileBanner from "../../Components/ProfileBanner";
import ProfileSidebarMenu from "../../Components/ProfileSidebarMenu";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'; // For validation schema
import SITE_CONFIG from "../../../controller";
import { MdLocationPin } from "react-icons/md";
import debounce from "lodash/debounce";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIconUrl from "/marker-icon.png";
// import { fetchUserById } from "../../api/fetchUserById";
import { updateUserByAddress } from "../../api/updateUserAddress";
import { v4 as uuid } from "uuid";
import { deleteUserByAddress } from "../../api/deleteUserByAddress";
import { useNavigate } from "react-router-dom";
import { fetchUserByAuthId } from "../../api/fetchUserByauthId";

const Address = () => {
  const [userinfo, setUserinfo] = useState([]);
  const [userAddresses, setUserAddresses] = useState([]);
  const [addressPopup, setAddressPopup] = useState(false);
  const [buttonType, setButtonType] = useState('');
  const [addressSearchPopup, setAddressSearchPopup] = useState(false);
  const [addressType, setAddressType] = useState("home");
  const [houseText, setHouseText] = useState("");
  const [landmarkText, setLandmarkText] = useState("");
  const [pincodeText, setPincodeText] = useState("");
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [deliveryArea, setDeliveryArea] = useState("");
  const { apiIP, apiToken } = SITE_CONFIG;
  const [formErrors, setFormErrors] = useState({});
  const [editAddressId, setEditAddressId] = useState(null);
  const [confirmDeletePopup, setConfirmDeletePopup] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [loading, setLoading] = useState(true);
  //Icon for Map marker
  const markerIcon = new L.Icon({
    iconUrl: markerIconUrl,
    iconSize: [28, 33],
  });
  const [isLogin, setIsLogin] = useState(false)
  const [error, setError] = useState(null);
  let auth = localStorage.getItem("AuthToken");
  let user = localStorage.getItem("User");
  const navigate = useNavigate("")

  // useEffect(() => {
  //     if (auth && user) {
  //       setIsLogin(true);
  //     } else {
  //       setIsLogin(false);
  //       navigate("/home",{state:"Login is required"});
  //       // toast.error("Login is required")

  //     }
  //   }, []);


  // useEffect(() => {
  //   // Function to handle user's location retrieval
  //   const handlePosition = async (position) => {
  //     const { latitude, longitude } = position.coords;
  //     setLocation({ latitude, longitude });
  //     const response = await axios.get(
  //       `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
  //     );
  //     setDeliveryArea(response.data.display_name);
  //   };
  //   // Get user's current location
  //   navigator.geolocation.getCurrentPosition(handlePosition);
  // }, []);
  const handlePosition = async (position) => {
    const { latitude, longitude } = position.coords;
    setLocation({ latitude, longitude });

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );

      if (response.status === 200) {
        // console.log(response.data.display_name)
        setDeliveryArea(response.data.display_name);
      } else {
        setDeliveryArea('temp'); // Reset if not successful
      }
    } catch (error) {
      console.error('Error fetching delivery area:', error);
      setDeliveryArea('temp'); // Reset on error
    }
  };
  // useEffect(() => {
  //   if (addressPopup) {


  // navigator.geolocation.getCurrentPosition(handlePosition, (error) => {
  //   console.error('Error getting location:', error);
  //   // setDeliveryArea('');
  // });
  //   }
  // }, [addressPopup]);

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
      setSuggestions(data);
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

  const validateForm = () => {
    const errors = {};
    if (!deliveryArea) errors.deliveryArea = "Delivery area is required";
    if (!houseText) errors.house = "House/Flat No is required";
    if (!landmarkText) errors.landmark = "Landmark is required";
    if (!pincodeText) errors.pincode = "Pincode is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validationSchema = Yup.object().shape({
    house: Yup.string()
      // .min(0, 'House number cannot be negative')
      .required('House number is required'),
    pincode: Yup.number()
      .min(0, 'Pincode cannot be negative')
      .required('Pincode is required'),
    addressType: Yup.string()
      .required('Address type is required'),
    // deliveryArea: Yup.string()
    //   .required('Delivery area is required'),
  });



  const updateUserAddress = async (values) => {
    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }
    // console.log(values);

    const newAddress = {
      title: values.addressType,
      address: deliveryArea,
      house: values.house,
      landmark: values.landmark,
      pincode: values.pincode,
      lat: location.latitude || 0,
      lng: location.longitude || 0,
    };
    // console.log(newAddress);
    // let updatedAddresses;

    if (editAddressId === null) {
      // updatedAddresses = userAddresses.map((address, index) =>
      //   index === editAddressId ? newAddress : address
      // );
      newAddress.id = uuid()
    } else {
      // updatedAddresses = [...userAddresses, newAddress];

      newAddress.id = editAddressId
    }
    // console.log(newAddress);
    // const updatedAddressesString = JSON.stringify(newAddress);

    try {
      const response = await updateUserByAddress(userId, newAddress);
      if (response.success) {
        getSingleUser();
        setDeliveryArea("");
        setHouseText("");
        setLandmarkText("");
        setPincodeText("");
        setAddressType("");
        setLocation({ latitude: null, longitude: null });
      }
      setAddressPopup(false);
      setEditAddressId(null);
    } catch (error) {
      // console.log(error)//
      console.log(error.response.data.message);
      console.log(typeof error.response.data.message || "An error occurred");
      //  setError(error.response.data.message || "An error occurred");
      setIsLogin(false);
      localStorage.removeItem("AuthToken");
      localStorage.removeItem("User");
      navigate("/home", { state: "Login is required" });
    } finally {
      setLoading(false);
    }




    //  else {
    //     // console.error("Error updating user address:", error);
    //   }
  };


  const deleteUserAddress = async () => {
    if (!userId || !addressToDelete) return;


    // const updatedAddresses = userAddresses.filter(
    //   (address) =>
    //     address.title !== addressToDelete.title ||
    //     address.address !== addressToDelete.address ||
    //     address.house !== addressToDelete.house ||
    //     address.landmark !== addressToDelete.landmark ||
    //     address.pincode !== addressToDelete.pincode
    // );

    // const updatedAddressesString = JSON.stringify(updatedAddresses);
    // const authToken = localStorage.getItem('AuthToken');

    // const response = await deleteUserByAddress(userId, addressToDelete)



    // console.error("Error deleting user address:", error);
    try {
      const response = await deleteUserByAddress(userId, addressToDelete);
      if (response.success) {
        setDeliveryArea("");
        setHouseText("");
        setLandmarkText("");
        setPincodeText("");
        setAddressType("");
        getSingleUser();
      }
      setConfirmDeletePopup(false);
    } catch (error) {
      // console.log(error)//
      console.log(error.response.data.message);
      console.log(typeof error.response.data.message || "An error occurred");
      //  setError(error.response.data.message || "An error occurred");
      setIsLogin(false);
      localStorage.removeItem("AuthToken");
      localStorage.removeItem("User");
      navigate("/home", { state: "Login is required" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddressClick = (address) => {
    setDeliveryArea(address.display_name);
    setLocation({ latitude: address.lat, longitude: address.lon })
    setAddressSearchPopup(false);
    setSuggestions([]);
    setInputText("");
  };

  const getSingleUser = async () => {
    try {
      const response = await fetchUserByAuthId(userId)

      setUserinfo(response.data);
      const addressData = response.data.address;
      setUserAddresses(addressData);
    } 
    catch (error) {
      // console.log(error)//
      console.log(error.response.data.message);
      console.log(typeof error.response.data.message || "An error occurred");
      //  setError(error.response.data.message || "An error occurred");

      setIsLogin(false);
      localStorage.removeItem("AuthToken");
      localStorage.removeItem("User");
      navigate("/home", { state: "Login is required" });
    }
     finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    getSingleUser();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading user info...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="lg:mx-[60px] px-[15px] bg-white">
      <ProfileBanner
        first_name={userinfo.first_name}
        last_name={userinfo.last_name}
        email={userinfo.email}
        mobile={userinfo.mobile}
      />
      <div className="flex">
        <ProfileSidebarMenu />
        <div className="w-full sm:w-3/4 p-8">
          <h2 className="text-lg font-bold mb-4">My Addresses</h2>
          <div className="relative flex flex-wrap items-start gap-2">
            <div
              onClick={() => {
                setAddressPopup(true); setButtonType('CREATE'); navigator.geolocation.getCurrentPosition(handlePosition, (error) => {
                  console.error('Error getting location:', error);
                  // setDeliveryArea('');
                });
              }}
              className="flex flex-col items-center justify-center p-[80px] rounded-lg cursor-pointer w-[250px] hover:bg-gray-200 transition-colors duration-300"
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
              <span className="text-black">Add New</span>
            </div>
            {userAddresses &&
              userAddresses.map((address, index) => (
                <div
                  key={index}
                  className="max-w-md bg-white rounded-lg p-6 mb-4 w-[250px]"
                >
                  <div className="text-lg font-bold uppercase ">
                    {address.title}
                  </div>

                  <div className="text-sm">
                    <div>
                      {address.house}, {address.landmark}, {address.address}
                    </div>
                    <div>{address.pincode}</div>
                  </div>

                  <div className="flex justify-start space-x-4 font-bold">
                    <button
                      onClick={() => {
                        setAddressPopup(true);
                        setButtonType('EDIT');
                        handlePosition({ coords: { latitude: address.lat, longitude: address.lng } })
                        setDeliveryArea(address.address);
                        setHouseText(address.house);
                        setLandmarkText(address.landmark);
                        setPincodeText(address.pincode);
                        setAddressType(address.title);
                        setEditAddressId(address.id);
                      }}
                      className="text-red-600 px-2 py-1"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setConfirmDeletePopup(true);
                        setAddressToDelete(address.id);
                      }}
                      className="text-black px-1 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

            {(addressPopup || addressSearchPopup) && (
              <div className="fixed -inset-8 bg-black bg-opacity-50 p-4 flex justify-center items-center z-30 min-h-[600px] overflow-y-auto">
                {addressPopup && !addressSearchPopup && (
                  <Formik
                    initialValues={{
                      deliveryArea: deliveryArea,
                      house: houseText,
                      landmark: landmarkText,
                      pincode: pincodeText,
                      addressType: addressType || 'home',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={updateUserAddress}
                  >
                    {({ setFieldValue }) => (
                      <Form className="relative bg-white m-10 p-4 shadow-lg w-full max-w-lg h-[100%] overflow-y-auto">
                        <button
                          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-3xl"
                          type="button"
                          onClick={() => {
                            setAddressPopup(false); setFormErrors({});
                            setHouseText("");
                            setLandmarkText("");
                            setDeliveryArea("")
                            setPincodeText("");
                            setAddressType("");
                            setLocation({ latitude: null, longitude: null });
                          }}
                        >
                          &times;
                        </button>
                        <h1 className="text-2xl font-semibold mb-4">Set your delivery location</h1>

                        {/* Map Section */}
                        <div
                          style={{
                            backgroundColor: location ? "transparent" : "gray",
                            height: "200px",
                            width: "100%",
                          }}
                        >
                          {location.latitude ? (
                            <MapContainer
                              center={[location.latitude, location.longitude]}
                              zoom={15}
                              style={{ height: "200px", width: "100%" }}
                            >
                              <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              />
                              <Marker
                                position={[location.latitude, location.longitude]}
                                icon={markerIcon}
                              >
                                <Popup>
                                  A marker at latitude {location.latitude}, longitude {location.longitude}.
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
                              Location services are off. Please turn on location services to view the map.
                            </div>
                          )}
                        </div>

                        {/* Delivery Area */}
                        <div className="mt-4">
                          <label htmlFor="deliveryArea" className="block text-sm font-medium text-gray-700 mb-2 uppercase">
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
                              onClick={() => setAddressSearchPopup(true)}
                              className="absolute top-1 right-1 h-[70%] text-[#B91C1C] bg-white font-bold rounded-lg px-2 py-1"
                            >
                              {
                                buttonType === "CREATE" ? "Add" : "Change"
                              }
                            </button>
                          </div>
                        </div>

                        {/* House Number */}
                        <label htmlFor="house" className="block text-sm font-medium text-gray-700 mb-2">
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
                        <ErrorMessage name="house" component="p" className="text-[#B91C1C] text-sm" />

                        {/* Landmark */}
                        <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-2">
                          Landmark
                        </label>
                        <Field
                          id="landmark"
                          name="landmark"
                          // required
                          type="text"
                          className={`w-full border border-gray-300 rounded-lg p-2 mb-2`}
                        />
                        <ErrorMessage name="landmark" component="p" className="text-[#B91C1C] text-sm" />

                        {/* Pincode */}
                        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode
                        </label>
                        <Field
                          id="pincode"
                          name="pincode"
                          type="number"
                          onWheel={(e) => e.target.blur()}
                          // required
                          min={0}
                          className={`w-full border border-gray-300 rounded-lg p-2 mb-2`}
                        />
                        <ErrorMessage name="pincode" component="p" className="text-[#B91C1C] text-sm" />

                        {/* Address Type */}
                        <label htmlFor="addressType" className="block text-sm font-medium text-gray-700 mb-2">
                          Address Type
                        </label>
                        <Field as="select" id="addressType" name="addressType" className="w-full border border-gray-300 rounded-lg p-2 mb-4">
                          <option value="home">Home</option>
                          <option value="work">Work</option>
                        </Field>
                        <ErrorMessage name="addressType" component="p" className="text-[#B91C1C] text-sm" />

                        <div className="flex justify-center mt-5">
                          <button type="submit" className="bg-[#FF3547] text-white h-10 w-20 mr-5">
                            {buttonType}
                          </button>
                          <button
                            type="button"
                            className="text-[#FF3547] h-10 w-20 border-2 border-[#FF3547] bg-white"
                            onClick={() => {
                              setAddressPopup(false);
                              setHouseText("");
                              setLandmarkText("");
                              setDeliveryArea("")
                              setPincodeText("");
                              setAddressType("");
                              setLocation({ latitude: null, longitude: null });
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
                    <h1 className="font-semibold text-2xl">Search Location</h1>
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
                          key={address.place_id}
                          onClick={() => handleAddressClick(address)}
                          className="cursor-pointer flex hover:bg-gray-100 p-2 rounded-md"
                        >
                          <MdLocationPin
                            color="gray"
                            size={22}
                            className="mr-2"
                          />
                          {address.display_name}
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

            {confirmDeletePopup && (
              <div className="fixed inset-0 bg-black bg-opacity-50 p-4 flex justify-center items-center z-30 h-[700px]">
                <div className="relative bg-white p-4 shadow-lg w-full max-w-lg h-[30%] flex flex-col items-center justify-center">
                  <h1 className="text-xl font-semibold mb-4">
                    Are you sure you want to delete this address?
                  </h1>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={deleteUserAddress}
                      className="bg-[#FF3547] text-white h-10 w-20 mr-5"
                    >
                      CONFIRM
                    </button>
                    <button
                      onClick={() => setConfirmDeletePopup(false)}
                      className="text-[#FF3547] h-10 w-20 border-2 border-[#FF3547] bg-white"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </div>
            )}{" "}
            {/* {confirmDeletePopup && (
              <div className="fixed inset-0 bg-black bg-opacity-50 p-4 flex justify-center items-center z-30 h-[700px]">
                <div className="relative bg-white p-4 shadow-lg w-full max-w-lg h-[30%] flex flex-col items-center justify-center">
                  <h1 className="text-xl font-semibold mb-4">
                    Are you sure you want to delete this address?
                  </h1>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={deleteUserAddress}
                      className="bg-[#FF3547] text-white h-10 w-20 mr-5"
                    >
                      CONFIRM
                    </button>
                    <button
                      onClick={() => setConfirmDeletePopup(false)}
                      className="text-[#FF3547] h-10 w-20 border-2 border-[#FF3547] bg-white"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;
