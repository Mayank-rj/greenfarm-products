import React from "react";

const CouponModal = ({
  isVisible,
  onToggle,
  coupons,
  setCouponCode,
  handleApplyCoupon,
}) => {
  if (!isVisible) return null;

  const handleCouponClick = (code) => {
    // console.log(code);
    setCouponCode(code);
    handleApplyCoupon(code);
    onToggle();
  };
  // const cartInfo = useSelector((state) => state.cart.items);
  //   console.log(coupons)
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 shadow-lg w-[300px] rounded-md">
        <h4 className="text-xl font-medium mb-4 text-center">Apply Coupon</h4>
        <div className="mt-4">
          <p className="text-center mb-2 text-gray-600">Use coupon code:</p>
          <div className="max-h-[300px] overflow-y-auto">
            {" "}
            {/* Set a maximum height and enable vertical scrolling */}
            {coupons.length > 0 ? (
              coupons.map((coupon) => (
                <div
                  key={coupon._id}
                  onClick={() => handleCouponClick(coupon.coupon_code)}
                  className="border border-gray-600 rounded p-2 mb-2 cursor-pointer hover:bg-gray-100"
                >
                  <p className="text-lg font-semibold text-blue-600">
                    {coupon.coupon_code}
                  </p>

                  <p className="text-xs w-[190px] text-gray-500 mt-2 line-clamp-3">
                    {coupon.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No coupons available.</p>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onToggle}
            className="mt-4 px-6 py-2 text-white bg-[#BE0500] rounded shadow-md hover:bg-[#ae2019]"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponModal;
