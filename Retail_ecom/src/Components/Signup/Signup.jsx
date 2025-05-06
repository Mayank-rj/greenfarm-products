import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./Signup.css";
import { countries } from "countries-list";
import { toast } from "react-toastify";
import { signUp } from "../../api/signUp.js";

const Signup = ({ openSignup, setOpenSignup, setIslogin, setOpenLogin }) => {
  const countryCodes = Object.keys(countries).map((code) => ({
    code: `+${countries[code].phone}`,
    label: `${countries[code].name} (+${countries[code].phone})`,
  }));

  const closePopup = () => {

    setOpenSignup(false);
    setOpenLogin(false);
  };

  useEffect(() => {
    let auth = localStorage.getItem("AuthToken");
    let user = localStorage.getItem("User");
    if (auth && user) {
      setIslogin(true);
      closePopup();
    } else {
      setIslogin(false);
    }
  }, [setIslogin]);

  const handleOpenLogin = () => {
    setOpenSignup(false);
    setOpenLogin(true);
  };

  const signUpSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string()
      // .matches(
      //   /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      //   "Please enter a valid email address"
      // )
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
        "Password should be a combination of one uppercase, one lowercase, one special character, one digit, and between 8 to 20 characters long"
      )
      .required("Password is required"),
    mobile: Yup.string()
      // .matches(
      //   /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/,
      //   "Invalid mobile number"
      // )
      .min(10, "Mobile number must be at least 10 digits")
      .max(15, "Mobile number must be at most 15 characters")
      .required("Mobile number is required"),
    country_code: Yup.string().required("Country code is required"),
    gender: Yup.string().required("Please select a gender"),
  });

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      mobile: "",
      password: "",
      country_code: "",
      gender: "",
      type: "user",
      status: "active",
      cover: "",
      address: [],
    },
    validationSchema: signUpSchema,

    onSubmit: async (values) => {
      try {
        const response = await signUp(values);
        if (response.success) {
          closePopup();
          toast.success("Signup successful!");
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
    },
  });

  if (!openSignup) return null;

  return (
    <>
      {openSignup && (
        <div className="fixed inset-0 flex items-start justify-center bg-gray-800 bg-opacity-50 z-50 p-10">
          <div className="w-[95%] md:w-[500px] lg:w-[500px] xl:w-[500px] bg-white relative  h-[100%] overflow-y-auto">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              &#x2715;
            </button>
            <div className="flex items-center justify-center p-4 border-b border-gray-200">
              <h3 className="text-2xl font-bold">Signup</h3>
            </div>

            <form
              // noValidate
              onSubmit={formik.handleSubmit}
              className="p-3 mt-3"
            >
              {/* {console.log("check1")} */}
              <div className="space-y-2">
                <input
                  type="email"
                  name="email"
                  spellCheck="false"
                  autoCapitalize="off"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 placeholder-semibold"
                  placeholder="Email"
                />
                {formik.errors.email && formik.touched.email && (
                  <p className="form-error text-red-500">
                    {formik.errors.email}
                  </p>
                )}

                <input
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 placeholder-semibold"
                  placeholder="Password"
                />
                {formik.errors.password && formik.touched.password && (
                  <p className="form-error text-red-500">
                    {formik.errors.password}
                  </p>
                )}

                <input
                  type="text"
                  name="first_name"
                  spellCheck="false"
                  autoCapitalize="off"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 placeholder-semibold"
                  placeholder="First Name"
                />
                {formik.errors.first_name && formik.touched.first_name && (
                  <p className="form-error text-red-500">
                    {formik.errors.first_name}
                  </p>
                )}

                <input
                  type="text"
                  name="last_name"
                  spellCheck="false"
                  autoCapitalize="off"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 placeholder-semibold"
                  placeholder="Last Name"
                />
                {formik.errors.last_name && formik.touched.last_name && (
                  <p className="form-error text-red-500">
                    {formik.errors.last_name}
                  </p>
                )}

                <div className="flex space-x-4">
                  <select
                    name="country_code"
                    value={formik.values.country_code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    className="w-[30%] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                  >
                    <option value={""}>
                      Select Country Code
                    </option>
                    {countryCodes.map((option, index) => (
                      <option key={index} value={option.code}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="mobile"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    className="w-[65%] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 placeholder-semibold"
                    placeholder="Mobile Number"
                  />
                </div>
                {formik.errors.mobile && formik.touched.mobile && (
                  <p className="form-error text-red-500 text-end">
                    {formik.errors.mobile}
                  </p>
                )}

                <select
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {formik.errors.gender && formik.touched.gender && (
                  <p className="form-error text-red-500">
                    {formik.errors.gender}
                  </p>
                )}

                {/* <div className="flex items-start space-x-2">
                  <input type="checkbox" className="mt-1" required />
                  <p className="text-sm" style={{ fontSize: "11px" }}>
                    By clicking on the I agree button, you agree to be bound by
                    the{" "}
                    <a
                      href="#"
                      className="text-blue-500 underline"
                      style={{ textDecorationColor: "#000000" }}
                    >
                      EULA certificate
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-blue-500 underline"
                      style={{ textDecorationColor: "#000000" }}
                    >
                      Privacy Policy
                    </a>{" "}
                    of this app.
                  </p>
                </div> */}

                <div className="flex justify-end">
                  <p className="text-gray-600 text-sm">
                    or{" "}
                    <span
                      className="text-red-500 hover:cursor-pointer"
                      onClick={handleOpenLogin}
                    >
                      login to your account
                    </span>
                  </p>
                </div>

                <hr />

                <div className="flex justify-center p-1 border-gray-200">
                  <button
                    type="submit"
                    className="bg-[#2BBBAD] text-white py-2 px-4 font-sm"
                  // onClick={()=>{console.log("clicked")}}
                  >
                    SIGNUP
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Signup;
