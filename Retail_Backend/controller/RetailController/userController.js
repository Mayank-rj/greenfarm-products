const mongoose = require("mongoose");
const user = require("../../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const otp = require("../../models/otp");

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array() });
  }
  const userDetail = req.body;
  try {
    let fetcheduser = await user.findOne({
      $or: [
        { email: userDetail.email },
        { mobile: userDetail.mobile, country_code: userDetail.country_code },
      ],
    });
    if (fetcheduser) {
      return res.status(400).send({
        success: false,
        message: "User already exist with this email or phone number",
      });
    } else {
      try {
        const salt = await bcrypt.genSalt(10);
        userDetail.password = await bcrypt.hash(userDetail.password, salt);
        await user.create(userDetail);
        res
          .status(201)
          .send({ success: true, message: "User registred successfully" });
      } catch (error) {
        console.error(error);
        res.status(400).send({ success: false, message: error.message });
      }
    }
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let fetcheduser = await user.findOne({ email });

    if (!fetcheduser) {
      return res.status(404).send({ success: false, message: "Invalid Email" });
    }
    if (fetcheduser.status !== "active") {
      return res.status(400).send({ success: false, message: "Invalid User" });
    }
    const passComp = await bcrypt.compare(password, fetcheduser.password);
    if (!passComp) {
      return res
        .status(400)
        .send({ success: false, message: "Incorrect password" });
    }

    const data = {
      user: {
        data: fetcheduser._id,
      },
    };

    const authToken = jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.send({
      success: true,
      authToken,
      message: "Login Successfully",
      data: fetcheduser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

const getuserbyid = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID (_id) is required" });
    }

    const getbyid = await user.findOne({ _id: _id });

    res
      .status(201)
      .send({ success: true, message: "User get by Id", data: getbyid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const getuserbyauthid = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID (_id) is required" });
    }

    const getbyid = await user.findOne({ _id: _id });

    res
      .status(201)
      .send({ success: true, message: "User get by Id", data: getbyid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  const { _id, data } = req.body;
  // Validate required fields

  if (!_id) {
    return res
      .status(400)
      .json({ success: false, message: "User ID (_id) is required" });
  }
  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Data is required and cannot be empty",
    });
  }
  delete data.password;

  const existingUser = await user.findOne({
    $or: [
      { email: data.email },
      { mobile: data.mobile, country_code: data.country_code },
    ],
    _id: { $ne: _id }, // Exclude the current user with the provided _id
  });

  if (existingUser) {
    return res.status(400).send({
      success: false,
      message: "A user is already exist with this email or mobile",
    });
  }

  try {
    // Find and update the user record
    const updatedConfig = await user.findOneAndUpdate(
      { _id },
      { $set: data },
      { new: true, runValidators: true } // Ensures validators are executed on update
    );

    // If no matching record is found
    if (!updatedConfig) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Successfully updated record
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedConfig, // Return the updated record for confirmation
    });
  } catch (error) {
    console.error("Update failed:", error); // Log the error for debugging purposes
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while updating the user",
    });
  }
};

const updateUserAddress = async (req, res) => {
  const { _id, address } = req.body; // Get the new address and user ID from the request body

  if (!address || !_id) {
    return res
      .status(400)
      .json({ success: false, message: "Address and UserId are required" });
  }

  try {
    // Find the user by ID and check if an address with the same `id` exists
    const userDoc = await user.findById(_id);
    if (!userDoc) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const existingAddressIndex = userDoc.address.findIndex(
      (addr) => addr.id === address.id
    );

    if (existingAddressIndex !== -1) {
      // Update the existing address
      userDoc.address[existingAddressIndex] = {
        ...userDoc.address[existingAddressIndex],
        ...address,
      };
    } else {
      // Add a new address to the array
      userDoc.address.push(address);
    }

    // Save the updated user document
    const updatedUser = await userDoc.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUserAddress = async (req, res) => {
  const { _id, addressId } = req.body; // Get the user ID and address ID from the request body

  if (!_id || !addressId) {
    return res
      .status(400)
      .json({ success: false, message: "UserId and AddressId are required" });
  }

  try {
    // Use the `$pull` operator to remove the address with the matching `id`
    const updatedUser = await user.findByIdAndUpdate(
      _id,
      { $pull: { address: { id: addressId } } },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const verify_token = async (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    return res.status(200).json({
      message: "Token is valid!",
      user: decoded,
    });
  });
};




const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: 'pos.sendemail@gmail.com',
    pass: 'rayyyuqztjeqqvyv'
  },
});


const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// 1️⃣ Send otp for Password Reset
const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const fetchedUser = await user.findOne({ email });
    if (!fetchedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const Otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(Otp, salt);

    // Store otp (Replace if exists)
    await otp.findOneAndUpdate(
      { email },
      { otpHash: hashedOtp, attempts: 0, createdAt: new Date() },
      { upsert: true, new: true }
    );
    console.log(Otp)
    const mailOptions = {
      from: 'GreenFarm Product <pos.sendemail@gmail.com>',
      to: email,
      subject: "Otp sent to email",
      text: `Your otp for is: ${Otp}. It is valid for 3 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "otp sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



const verifyOtp = async (req, res) => {
  const { email, otp: userOtp } = req.body;

  try {
    const otpRecord = await otp.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "OTP not found or expired" });
    }

    // Check if OTP is expired (3 minutes)
    const isExpired = new Date() - new Date(otpRecord.createdAt) > 3 * 60 * 1000;
    if (isExpired) {
      await otp.deleteOne({ email });
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Check max attempts
    if (otpRecord.attempts >= 5) {
      await otp.deleteOne({ email });
      return res.status(403).json({ success: false, message: "Maximum attempts exceeded" });
    }

    const isMatch = await bcrypt.compare(userOtp, otpRecord.otpHash);

    if (!isMatch) {
      // Increment attempts
      await otp.updateOne({ email }, { $inc: { attempts: 1 } });
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    // OTP is correct - cleanup and proceed
    // await otp.deleteOne({ email });

    // Proceed to create/verify user (depends on your flow)
    // Example: Mark user as verified
    await user.updateOne({ email }, { $set: { isVerified: true } });

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const resetPassword = async (req, res) => {
  const { email, Otp, newPassword } = req.body;

  try {
    const otpRecord = await otp.findOne({ email });

    if (!otpRecord) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    // Check attempt limit
    if (otpRecord.attempts >= 5) {
      await otp.deleteOne({ email }); // Delete OTP after max attempts
      return res
        .status(400)
        .json({
          success: false,
          message: "Max OTP attempts reached. Request a new OTP.",
        });
    }

    // Ensure Otp is a string
    // const otpString = Otp.toString();

    // Compare OTP with hashed value
    const isOtpValid = await bcrypt.compare(Otp, otpRecord.otpHash);
    console.log("OTP Comparison Result:", isOtpValid);

    if (!isOtpValid) {
      await otp.findOneAndUpdate({ email }, { $inc: { attempts: 1 } });
      return res.status(400).json({ success: false, message: "Incorrect OTP" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update User Password
    await user.findOneAndUpdate({ email }, { password: hashedPassword });

    // Delete OTP after successful verification
    await otp.deleteOne({ email });

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const sendEmail = async (req, res) => {
  const data = req.body;
  if (!data.to || !data.html) {
    return res.status(400).send({ success: false, message: "Missing recipient email or HTML content." });
  }

  try {
    await transporter.sendMail({
      from: 'GreenFarm Product <pos.sendemail@gmail.com>', // sender address
      to: data.to, // list of receivers
      subject: "Welcome to the Greenfarm Product", // Subject line
      text: "Thank you for choosing Greenfarm Product!", // plain text body
      html: data.html, // html body
    });
    res.send({
      success: true,
      message: "Success"
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error', error });
  }
};








module.exports = {
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
  resetPassword
};
