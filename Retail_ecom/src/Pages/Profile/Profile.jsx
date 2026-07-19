import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ProfileBanner from "../../Components/ProfileBanner";
import ProfileSidebarMenu from "../../Components/ProfileSidebarMenu";
import { toast } from "react-toastify";
import { countries } from "countries-list";
import profileimg from "../../assets/maskable-icon.png";
// import { fetchUserById } from "../../api/fetchUserById";
import { updateUserById } from "../../api/updateUserById";
import { fetchUserByAuthId } from "../../api/fetchUserByauthId";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("User");
  const countryCodes = Object.keys(countries).map((code) => ({
    code: `+${countries[code].phone}`,
    label: `${countries[code].name} (+${countries[code].phone})`,
  }));
  const [isLoading, setIsLoading] = useState(false);

  const [displayName, setDisplayName] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
  });
  const getSingleUser = async () => {
    try {
      const response = await fetchUserByAuthId(userId);
      formik.setValues(response.data);
      setDisplayName({
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        mobile_number: response.data.mobile,
      });
    } catch (error) {
      // console.log(error)//
      console.log("hii")
      console.log(error.response.data.message);
      console.log(typeof error.response.data.message || "An error occurred");
      // setError(error.response.data.message || "An error occurred");
      setIsLogin(false);
      localStorage.removeItem("AuthToken");
      localStorage.removeItem("User");
      navigate("/home", { state: "Login is required" });
    }
  };


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
  //     // toast.error("Login is required")

  //   }
  // }, []);



  useEffect(() => {
    // if (localStorage.getItem("AuthToken")) { getSingleUser(); }
    getSingleUser()
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      country_code: "",
      email: "",
      gender: "male",
      mobile: "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("First name is required"),
      last_name: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      mobile: Yup.string()
        .required("Mobile number is required")
        .matches(/^\d+$/, "Mobile number must contain only digits")
        .min(9, "Mobile number must be at least 10 digits")
        .max(15, "Mobile number cannot exceed 15 digits"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await updateUserById(userId, values);
        // console.log(response)

        if (response.success) {
          toast.success("Profile updated successfully!");
          setDisplayName({
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            mobile_number: response.data.mobile,
          });
        } else {
          toast.error("Failed to update profile. Please try again.");
        }
      } catch (error) {
        console.error("Error updating user:", error);
        // if (error.response) {
        //   console.error("Response data:", error.response.data);
        //   toast.error(
        //     `Error: ${error.response.data.message || "Failed to update profile."
        //     }`
        //   );
        // } else {
        //   toast.error("Network error. Please check your connection.");
        // }
        console.log(error.response.data.message);
        console.log(typeof error.response.data.message || "An error occurred");
        // setError(error.response.data.message || "An error occurred");
        setIsLogin(false);
        localStorage.removeItem("AuthToken");
        localStorage.removeItem("User");
        navigate("/home", { state: "Login is required" });
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading user info...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  return (
    <div className="lg:mx-[60px] px-[15px] bg-white">
      <ProfileBanner
        first_name={displayName.first_name}
        last_name={displayName.last_name}
        email={formik.values.email}
        mobile={displayName.mobile_number}
      />

      <div className="flex">
        <ProfileSidebarMenu />
        <div className="w-full sm:w-3/4 p-8">
          <h2 className="text-lg font-bold mb-4">User Information</h2>
          <div className="mb-1 flex justify-center gap-4 sm:gap-6 relative">
            <div className="h-[110px] w-[110px] ml-[20px] border-4 border-transparent rounded-full relative">
              <img
                src={profileimg}
                alt="profileimg"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>

          <h2 className="text-center text-lg font-bold mb-2">
            {displayName.first_name} &nbsp; {displayName.last_name}
          </h2>

          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  className="mt-1 block w-full px-3 py-2 border rounded-md sm:text-sm"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.first_name && formik.errors.first_name && (
                  <div className="text-red-600 text-sm">
                    {formik.errors.first_name}
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  className="mt-1 block w-full px-3 py-2 border rounded-md sm:text-sm"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.last_name && formik.errors.last_name && (
                  <div className="text-red-600 text-sm">
                    {formik.errors.last_name}
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 mb-4">
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  name="gender"
                  className="mt-1 block w-full px-3 py-2 border rounded-md sm:text-sm"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">
                  Country Code
                </label>
                <select
                  name="country_code"
                  className="mt-1 block w-full px-3 py-2 border rounded-md sm:text-sm"
                  value={formik.values.country_code}
                  onChange={formik.handleChange}
                >
                  <option value={""}>Select Country Code</option>
                  {countryCodes.map((option, index) => (
                    <option key={index} value={option.code}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="number"
                  min={0}
                  name="mobile"
                  className="mt-1 block w-full px-3 py-2 border rounded-md sm:text-sm"
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.mobile && formik.errors.mobile && (
                  <div className="text-red-600 text-sm">
                    {formik.errors.mobile}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              style={{
                background: "#be0500",
                padding: "13px 34px",
                width: "115px",
              }}
              className="flex items-center rounded-sm shadow-md my-14 justify-center mx-auto"
              disabled={isLoading}
            >
              <span className="text-md text-white uppercase">
                {isLoading ? "Saving..." : "Save"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
