import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileSidebarMenu from "../../Components/ProfileSidebarMenu";
import axios from "axios";
import SITE_CONFIG from "../../../controller";
import OrderCard from "./OrderCard";
import { setOrderDetails } from "../../slices/orderDetailsSlice";
import ProfileBanner from "../../Components/ProfileBanner";
import { getOrderByUserid } from "../../api/getOrderbyUserId";
import { fetchUserById } from "../../api/fetchUserById";
import { toast } from "react-toastify";
import { token } from "../../api/verifytoken";
import { fetchUserByAuthId } from "../../api/fetchUserByauthId";

const Order = () => {
  const [userinfo, setUserinfo] = React.useState([]); // Initialize as an empty array
  const [userProfile, setUserProfile] = React.useState([]); // Initialize as an empty array
  const [loading, setLoading] = React.useState(true); // Loading state
  const [error, setError] = React.useState(null); // Error state
  const [ordersToShow, setOrdersToShow] = React.useState(6); // State to track how many orders to show

  const dispatch = useDispatch();
  const id = localStorage.getItem("User");
  const [isLogin, setIsLogin] = useState(false)

  let auth = localStorage.getItem("AuthToken");
  let user = localStorage.getItem("User");
  const navigate = useNavigate("")


  // useEffect(() => {
  //   if (auth && user) {
  //     setIsLogin(true);
  //   } else {
  //     setIsLogin(false);
  //     navigate("/home", { state: "Login is required" });
  //   }
  // }, []);

  const getOrderDetails = async () => {

    try {
      const response = await getOrderByUserid(id);
      const completedOrders = response.data.filter(order => order.payment_status === "completed");
      // console.log(completedOrders)
      setUserinfo(completedOrders);
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

  const getSingleUserdetail = async () => {
    try {
      const response = await fetchUserByAuthId(id);
      setUserProfile(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      localStorage.removeItem("AuthToken");
      localStorage.removeItem("User");
      navigate("/home", { state: "Login is required" });
    }
  };

  React.useEffect(() => {
      getOrderDetails();
      getSingleUserdetail();
  }, []);

  const handleViewDetails = (order) => {
    dispatch(setOrderDetails(order)); // Dispatch order details to Redux store
  };

  const handleLoadMore = () => {
    setOrdersToShow((prev) => prev + 6); // Load 6 more orders
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading user info...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }





  return (
    <div className="lg:mx-[60px] px-[15px] bg-white">
      <ProfileBanner
        first_name={userProfile.first_name}
        last_name={userProfile.last_name}
        email={userProfile.email}
        mobile={userProfile.mobile}
      />
      <div className="flex">
        {/*------------------------------ Sidebar Menu ----------------------------------*/}
        <ProfileSidebarMenu />
        {/*-------------- User Order History  ---------------------*/}
        <div className="w-full sm:w-3/4 p-8">
          <h2 className="text-lg font-bold mb-4">Order History</h2>
          <div className="flex flex-wrap gap-5">
            {userinfo.length > 0 ? (
              userinfo.slice(0, ordersToShow).map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onClick={() => handleViewDetails(order)} // Pass the click handler
                />
              ))
            ) : (
              <div className="text-center text-gray-500">No orders found.</div>
            )}
          </div>

          {/* Load More Button */}
          {userinfo.length > ordersToShow && (
            <div className="text-center mt-4">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 bg-custom-red text-white rounded hover:bg-custom-red transition duration-200"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
