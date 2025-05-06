import React from "react";
import { Link } from "react-router-dom";
import SITE_CONFIG from "../../../controller";

function OrderCard({ order, onClick }) {
 
  const productDetails = JSON.parse(order.product_details || "[]");
  const totalItems = productDetails.length;

  return (
    <div className="max-w-sm p-6 w-[375px]  bg-white border border-gray-200 rounded-lg shadow-lg">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Order ID: {order.order_number}
      </h5>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        Amount: {`$${order.grand_total.toFixed(2)}`}
        <br />
        
        Date: {new Date(order.date_time).toLocaleDateString()}{" "}
        {/* Formatting the date */}
        <br />
        Items: {totalItems}
      </p>
      <Link
        to={`${SITE_CONFIG.linkPath}/orderdetail/${order._id}`} // Optionally update to match your route setup
        className="inline-flex items-center px-3 py-2 text-sm cursor-pointer font-medium text-center bg-[#B91C1C] rounded text-white"
        onClick={onClick}
      >
        View Details
        <svg
          className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </Link>
    </div>
  );
}

export default OrderCard;
