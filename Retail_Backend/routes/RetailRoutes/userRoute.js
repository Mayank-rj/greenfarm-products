const express = require("express");
const {
  register,
  loginUser,
  getuserbyid,
  updateUser,
  updateUserAddress,
  deleteUserAddress,
  verify_token,
  getuserbyauthid,
  sendEmail,
  sendOtp,
  verifyOtp,
  resetPassword,
} = require("../../controller/RetailController/userController");

const router = express.Router();
const { body } = require("express-validator");
const checkUser = require("../../middleware/authUser");

router.post(
  "/register",
  body("first_name", "Enter a valid first name").isLength({ min: 1 }),
  body("last_name", "Enter a valid last name").isLength({ min: 1 }),
  body("email", "Enter a valid email").isEmail(),
  body(
    "password",
    "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long"
  ).matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
  ),
  register
);
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  loginUser
);


router.post("/getuserbyauthid",checkUser, getuserbyauthid);
router.post("/getuserbyid", getuserbyid);
router.post("/updateuser",checkUser ,updateUser);
router.post("/verifytoken", verify_token);
router.post("/updateuseraddress", checkUser, updateUserAddress);
router.post("/deleteuseraddress", checkUser, deleteUserAddress);
router.post("/sendemail", sendEmail);
router.post("/sendOtp", sendOtp);
router.post("/verifyotp", verifyOtp);
router.post("/resetpassword", resetPassword);
module.exports = router;
