import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderPaymentStatus } from '../../api/orderPaymentStatus';
import { useDispatch, useSelector } from 'react-redux';
import { emptyCart } from '../../slices/cart/cartActions';
import { fetchSessionId } from '../../api/fetchSessionId';
import { toast } from 'react-toastify';
import { userEmail } from '../../assets/userEmail';
import { sendEmail } from '../../api/sendemail';
import { adminEmail } from '../../assets/adminEmail';
import { fetchUserById } from '../../api/fetchUserById';
import { getStoreById } from '../../api/getStoreById';

const Success = () => {
  const navigate = useNavigate();
  // const storeSliceData = useSelector((state) => state.storeData);
  const user = localStorage.getItem("User") || "";
  const storeSliceData = localStorage.getItem("localStoreId") || "";
   const [userprofile, setUserprofile] = useState("");
   const [prevent,setPrevent]=useState("")
   const[storeData,setStoreData]=useState("")
  const [orderId, setOrderId] = useState(null)
  const dispatch = useDispatch()
  const sessionId = new URLSearchParams(window.location.search).get("session_id");
  const fetchOrderDetail = async () => {
    try {
      const response = await fetchSessionId(sessionId)
      // console.log(response);
      const orderDetailString = response.data.session.metadata.orderDetail; 
      // console.log(JSON.parse(orderDetailString));
      setOrderId(JSON.parse(orderDetailString));

    } catch (error) {
      console.error(error)
    }
  }

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
    

    const getStore= async ()=>{
      try {
        const response = await getStoreById(storeSliceData)
        setStoreData(response)
      } catch (error) {
        console.error(error)
      }
     
    }

  const orderStatus = async () => {
    try {
      const response = await orderPaymentStatus(orderId, "completed")
      // console.log(response.data);
      // setOrderDetail(response.data)
      setPrevent(response.data.payment_status)
      
      if (response.success) {
        console.log(storeSliceData);
        toast.success("Order Placed Successfully");
        dispatch(emptyCart(storeSliceData, user));

        const useremailData = userEmail(response.data, userprofile, storeData);
     
        if (useremailData) {
          const data = await sendEmail(useremailData);
          console.log("mail sent user");
        } else {
          toast.error("Email data is invalid. Email not sent.");
        }
  
        const adminEmailData = adminEmail(response.data, userprofile, storeData);
  
        if (adminEmailData) {
          const data = await sendEmail(adminEmailData);
          console.log("mail sent");
          
        } else {
          toast.error("Admin email data is invalid. Email not sent.");
        }
  
      }

       


    } catch (error) {
      console.error(error)
    }
  }

  console.log(prevent);
  useEffect(() => {
    fetchOrderDetail()
    getStore()
  }, [])

  useEffect(()=>{
    if(orderId && prevent !=="completed") orderStatus()
  },[orderId])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-6">
      <div className="w-full max-w-md mx-auto p-6 md:p-8 text-center bg-white rounded-xl shadow-md">
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 md:h-12 md:w-12 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-green-600 mb-3 md:mb-4">
          Payment Successful!
        </h2>

        <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
          Thank you for your purchase.
        </p>

        <div
          className="bg-blue-50 p-3 md:p-4 rounded-md mb-4 md:mb-6 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <p className="text-xs md:text-sm text-blue-600">
            Continue Shopping
          </p>
        </div>

      </div>
    </div>
  );
};

export default Success;
