import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import NavigationScroll from "./NavigationScroll";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { fetchStore } from "./api/fetchStore";
import { getStoreById } from "./api/getStoreById";
import { removeStoreSliceData } from "./slices/storedata";
import { useDispatch, useSelector } from "react-redux";


export default function App() {

  const location = useLocation();
  const storeSliceData = useSelector((state) => state.storeData);
  const dispatch = useDispatch()

  useEffect(() => {
    const getStores = async () => {
      try {
        const presentStoreId = localStorage.getItem("localStoreId");
        
        const response = await getStoreById(presentStoreId)
      } catch (error) {
        console.error("Error fetching stores:", error);
        dispatch(removeStoreSliceData())
        localStorage.removeItem("localStoreId")
      }
    };

    getStores();

  }, [location,storeSliceData]);

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={5000} />
      <NavigationScroll>
        <NavBar />
        <div className="pt-[139px] lg:pt-[128px] min-h-screen" id="detail">
          <Outlet />
        </div>
      </NavigationScroll>
      <Footer />
    </>
  );
}
