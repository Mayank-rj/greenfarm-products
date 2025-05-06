const user = require("../../models/user");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array() });
  }
  const userDetail = req.body;
  try {
    let fetcheduser = await user.findOne({
      $or: [{ email: userDetail.email }, { mobile: userDetail.mobile }],
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
    if (fetcheduser.type !== "admin" || fetcheduser.status !== "active") {
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
        id: fetcheduser._id,
      },
    };

    const authToken = jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.send({ success: true, authToken });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

const getAllUsers = async (req, res, type) => {
  try {
    const id = req.query.id;
    if (!id) {
      // Fetch users of the given type and exclude the password field
      const fetchedUsers = await user
        .find({ type: type })
        .sort({ _id: -1 })
        .select("-password");
      return res.status(200).json({ success: true, data: fetchedUsers });
    }

    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user id format" });
    }

    // Fetch a single user of the given type and exclude the password field
    const fetchedUser = await user.findOne({ _id: id }).select("-password");
    if (!fetchedUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: fetchedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  const { _id, ...data } = req.body;
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
    $or: [{ email: data.email }, { mobile: data.mobile }],
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

const updateUserbyEmail = async (req, res) => {
  const { email, ...data } = req.body;

  // Validate required fields
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }
  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Data is required and cannot be empty",
    });
  }

  delete data.password; // Prevent password updates here if not handled separately

  // Check for duplicate mobile (if being updated)
  if (data.mobile) {
    const existingUser = await user.findOne({
      mobile: data.mobile,
      email: { $ne: email } // Exclude the current user by email
    });

    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "A user already exists with this mobile number",
      });
    }
  }

  try {
    // Find and update the user by email
    const updatedUser = await user.findOneAndUpdate(
      { email },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while updating the user",
    });
  }
};


const updateUserStatus = async (req, res) => {
  const { _id, status } = req.body;

  // Validate required fields
  if (!_id) {
    return res
      .status(400)
      .json({ success: false, message: "User ID (_id) is required" });
  }
  if (!status) {
    return res.status(400).json({
      success: false,
      message: "Status is required and cannot be empty",
    });
  }

  try {
    // Find and update the user record
    const updatedConfig = await user.findOneAndUpdate(
      { _id },
      { $set: { status: status } },
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
      message: "User status updated successfully",
      data: updatedConfig, // Return the updated record for confirmation
    });
  } catch (error) {
    console.error("Status update failed:", error); // Log the error for debugging purposes
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating the user status",
    });
  }
};
const getUserCount = async (req, res) => {
  try {
    const totalUser = await user.find({ type: "user" }).countDocuments();
    res.status(200).json({ success: true, total: totalUser });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  updateUser,
  updateUserStatus,
  getUserCount,
  updateUserbyEmail
};
