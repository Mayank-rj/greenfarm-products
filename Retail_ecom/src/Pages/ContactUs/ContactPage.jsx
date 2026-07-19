import React, { useEffect } from "react";
import { FaHome } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { FaEnvelope } from "react-icons/fa6";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addcontact } from "../../api/addContact";
import { useSelector } from "react-redux";
import { countries } from "countries-list";

const ContactPage = () => {
  const storeSliceData = useSelector((state) => state.storeData);
  const countryCodes = Object.keys(countries).map((code) => ({
    code: `+${countries[code].phone}`,
    label: `${countries[code].name} (+${countries[code].phone})`,
  }));

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const initialValues = {
    fullName: "",
    emailId: "",
    contact_no: "",
    message: "",
    country_code: "",
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required"),
    emailId: Yup.string()
      .email("Invalid email format")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email must be a valid format"
      )
      .required("Email ID is required"),
    contact_no: Yup.string()
      .min(9, "Mobile number must be at least 10 digits")
      .max(15, "Mobile number must be at most 15 characters")
      .required("Mobile number is required"),
    message: Yup.string().required("Message is required"),
    country_code: Yup.string().required("Please select a country."),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const contactDetails = {
        full_name: values.fullName,
        email: values.emailId,
        contact: values.country_code + " " + values.contact_no,
        notes: values.message,
      };
      // console.log(contactDetails);
      const response = await addcontact(contactDetails);
      if (response.success) {
        toast.success("Thank you for reaching out!");
        resetForm();
      }
    } catch (error) {
      toast.error("There was an error sending your message. Please try again.");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-0 mb-12">
        <h1 className="text-2xl font-semibold mb-2 mt-1 sm:text-left">
          Contact Us
        </h1>
        <hr className="hidden lg:block mt-1 mb-14" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="flex flex-col gap-4">
                <div>
                  <Field
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Full Name"
                    className={`appearance-none border rounded w-full py-2 px-3 text-gray-900 ${
                      errors.fullName && touched.fullName
                        ? "border-[#BE0500]"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="fullName"
                    component="div"
                    className="text-[#BE0500]"
                  />
                </div>
                <div>
                  <Field
                    type="email"
                    id="emailId"
                    name="emailId"
                    placeholder="Email ID"
                    className={`appearance-none border rounded w-full py-2 px-3 text-gray-900 ${
                      errors.emailId && touched.emailId
                        ? "border-[#BE0500]"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="emailId"
                    component="div"
                    className="text-[#BE0500]"
                  />
                </div>
                <div className="flex">
                  <div className="mr-2 w-[20%]">
                    <Field
                      as="select"
                      name="country_code"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    >
                      <option value="">Select Country Code</option>
                      {countryCodes.map((option, index) => (
                        <option key={index} value={option.code}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="country_code"
                      component="div"
                      className="text-[#BE0500]"
                    />
                  </div>
                  <div className="flex-1">
                    <Field
                      type="number"
                      id="contact_no"
                      name="contact_no"
                      placeholder="Contact No"
                      className={`appearance-none border rounded w-full py-2 px-3 text-gray-900 ${
                        errors.contact_no && touched.contact_no
                          ? "border-[#BE0500]"
                          : ""
                      }`}
                    />
                    <ErrorMessage
                      name="contact_no"
                      component="div"
                      className="text-[#BE0500]"
                    />
                  </div>
                </div>
                <div>
                  <Field
                    as="textarea"
                    id="message"
                    name="message"
                    className={`appearance-none border rounded w-full py-2 px-3 h-32 text-gray-900 ${
                      errors.message && touched.message
                        ? "border-[#BE0500]"
                        : ""
                    }`}
                    placeholder="Write Message..."
                  />
                  <ErrorMessage
                    name="message"
                    component="div"
                    className="text-[#BE0500]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#BE0500] text-white focus:outline-none rounded-md"
                  style={{ width: "165px", height: "45px" }}
                >
                  SUBMIT
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-8 md:mt-0">
            <ul className="flex flex-col gap-4">
              <li className="flex items-center">
                <span className="text-[#BE0500] text-xl">
                  <FaHome />
                </span>
                <span className="ml-2">
                  {storeSliceData.isEmpty
                    ? "Select Store"
                    : storeSliceData.store?.name}
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-[#BE0500] text-xl">
                  <FaHome />
                </span>
                <span className="ml-2">
                  {storeSliceData.isEmpty
                    ? "Select Store"
                    : storeSliceData.store?.address}
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-[#BE0500] text-xl">
                  <FaEnvelope />
                </span>
                <span className="ml-2">
                  contact@greenfarmmeatnswhalal.com.au
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-[#BE0500] text-xl">
                  <IoCall />
                </span>
                <span className="ml-2">
                  +61{" "}
                  {storeSliceData.isEmpty
                    ? "Select Store"
                    : storeSliceData.store?.mobile}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
