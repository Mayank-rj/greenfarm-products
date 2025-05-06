import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import SITE_CONFIG from "../../../controller";
import { sendotp } from "../../api/sendotp";
import { verifyotp } from "../../api/verifyotp";
import { resetpassword } from "../../api/resetpassword";
import { IoIosEyeOff } from "react-icons/io";
import { IoIosEye } from "react-icons/io";

function ForgetPass({ setOpenForgetPassword, setOpenLogin }) {
  const [isOpen, setIsOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("Hello@123");
  const [confirmPassword, setConfirmPassword] = useState("Hello@123");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);

  const closePopup = () => {
    setIsOpen(false);
    setOpenLogin(false);
    setOpenForgetPassword(false);
  };

  const handleOpenLogin = () => {
    setOpenForgetPassword(false);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoadingOtp(true);
    try {
      const response = await sendotp({ email });
      if (response.success) {
        toast.success("OTP sent successfully!");
        setOtpSent(true);
      } else {
        toast.error(response.message || "An error occurred");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "An unexpected error occurred");
      } else {
        toast.error("Network error, please try again later.");
      }
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      toast.error("OTP must be a 6-digit number");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await verifyotp({ email, otp });
      console.log("response verifyotp", response)
      if (response.success) {
        const res = await resetpassword({ email, Otp: otp, newPassword })
        console.log("response resetpassword", res)
        if (res.success) {
          setOtpSent(false)
          closePopup();
          toast.success("Password reset successful!");
        } else {
          toast.error(response.message || "An error occurred");
        }
      } else {
        toast.error(response.message || "An error occurred");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "An unexpected error occurred");
      } else {
        toast.error("Network error, please try again later.");
      }
    }

  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-gray-800 bg-opacity-50 z-50 p-9">
      <div className="w-[76.5%] md:w-[65%] lg:w-[48.6%] xl:w-[40.5%] bg-white transform translate-y-[-5%] relative">
        <button
          onClick={closePopup}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          &#x2715;
        </button>
        <div className="flex items-center justify-center p-3 border-b border-gray-200">
          <h2 className="text-lg font-bold">Reset Password</h2>
        </div>

        <form noValidate className="mt-10 mr-5 ml-5 space-y-3" onSubmit={otpSent ? handleResetPassword : handleSendOtp}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            spellCheck="false"
            autoCapitalize="off"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            placeholder="Email"
            disabled={otpSent || loadingOtp}
          />

          {otpSent && (
            <>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
              />
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                  placeholder="New Password"
                />
                <span
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
                >
                  {showNewPassword ? <IoIosEye /> : <IoIosEyeOff />}
                </span>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                  placeholder="Confirm Password"
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
                >
                  {showConfirmPassword ? <IoIosEye /> : <IoIosEyeOff />}
                </span>
              </div>

            </>
          )}

          <div className="flex justify-end p-3">
            <p className="text-gray-600 text-md">
              or
              <span
                className="text-red-500 hover:cursor-pointer ml-1"
                onClick={handleOpenLogin}
              >
                login to your account
              </span>
            </p>
          </div>


          <div className="flex justify-center p-3 border-t border-gray-200">
            <button
              type="submit"
              className="bg-[#2BBBAD] text-white py-2 px-4"
              disabled={loadingOtp}

            >
              {loadingOtp ? "OTP sending..." : otpSent ? "RESET PASSWORD" : "SEND OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgetPass;
