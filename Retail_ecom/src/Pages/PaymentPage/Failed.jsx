import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderPaymentStatus } from '../../api/orderPaymentStatus';
import { useDispatch, useSelector } from 'react-redux';
import { emptyCart } from '../../slices/cart/cartActions';
import { fetchSessionId } from '../../api/fetchSessionId';
// import { toast } from 'react-toastify'

const PaymentFailedPage = () => {
   const navigate = useNavigate();
   const user = localStorage.getItem("User") || "";
     const storeSliceData = localStorage.getItem("localStoreId") || "";
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
   
   
     const orderStatus = async () => {
       try {
         // console.log();
         
         const response = await orderPaymentStatus(orderId, "failed")
         
         if (response.success) {
          //  console.log(storeSliceData);
          //  toast.success("Order Placed Successfully");
          //  dispatch(emptyCart(storeSliceData, user));
           // navigate(`${SITE_CONFIG.linkPath}/home`);
         }
       } catch (error) {
         console.error(error)
       }
     }
   
     console.log(orderId);
     useEffect(() => {
       fetchOrderDetail()
   
     }, [])
   
     useEffect(()=>{
       if(orderId) orderStatus()
     },[orderId])
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-6">
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 md:p-8 text-center bg-white rounded-xl shadow-lg">
        <div className="flex justify-center mb-3 sm:mb-4 md:mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v10"
              />
              <circle cx="12" cy="19" r="1" fill="currentColor" />
            </svg>
          </div>
        </div>

        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-red-600 mb-2 sm:mb-3 md:mb-4">
          Payment Failed
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4 md:mb-6 px-2 sm:px-4">
          We couldn't process your payment. Please check your payment method or
          contact support.
        </p>

        <div className="bg-yellow-50 p-2 sm:p-3 md:p-4 rounded-md mb-3 sm:mb-4 md:mb-6 mx-2 sm:mx-4" onClick={() => navigate('/cart')}>
          <button className="w-full text-xs sm:text-sm md:text-base py-2 rounded">
            Retry Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
