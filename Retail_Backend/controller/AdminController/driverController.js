const driver = require("../../models/driver");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const getDriver = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      const fetchedDriver = await driver
        .find()
        .sort({ _id: -1 })
        .select("-password");
      return res.status(200).json({ success: true, data: fetchedDriver });
    }

    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid driver id format" });
    }

    const fetchedDriver = await driver.findOne({ _id: id }).select("-password");
    if (!fetchedDriver) {
      return res
        .status(400)
        .json({ success: false, message: "Driver not found" });
    }

    return res.status(200).json({ success: true, data: fetchedDriver });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const addDriver = async (req, res) => {
  const data = req.body;
  try {
    const existingRecord = await driver.findOne({
      $or: [
        { mobile: data.mobile, country_code: data.country_code },
        { email: data.email },
      ],
    });

    if (existingRecord) {
      if (
        existingRecord.mobile === data.mobile &&
        existingRecord.country_code === data.country_code &&
        existingRecord.email === data.email
      ) {
        return res.status(400).send({
          success: false,
          message:
            "Driver already exists with this email, country code and mobile number",
        });
      } else if (
        existingRecord.mobile === data.mobile &&
        existingRecord.country_code === data.country_code
      ) {
        return res.status(400).send({
          success: false,
          message:
            "Driver already exists with this country code and mobile number",
        });
      } else if (existingRecord.email === data.email) {
        return res.status(400).send({
          success: false,
          message: "Driver already exists with this email",
        });
      }
    }
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
    const newDriver = await driver.create(data);
    res.status(201).send({
      success: true,
      message: "Driver created successfully",
      data: newDriver,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: error.message });
  }
};

const updateDriver = async (req, res) => {
  const { _id, ...data } = req.body;

  if (!_id) {
    return res
      .status(400)
      .json({ success: false, message: "Driver ID (_id) is required" });
  }
  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Data is required and cannot be empty",
    });
  }
  const existingDriver = await driver.findOne({
    $or: [
      { email: data.email },
      { mobile: data.mobile, country_code: data.country_code },
    ],
    _id: { $ne: _id },
  });

  if (existingDriver) {
    if (
      existingDriver.email === data.email &&
      existingDriver.country_code === data.country_code &&
      existingDriver.mobile === data.mobile
    ) {
      return res.status(400).send({
        success: false,
        message:
          "A driver already exists with this email, country code and mobile number",
      });
    } else if (existingDriver.email === data.email) {
      return res.status(400).send({
        success: false,
        message: "A driver already exists with this email",
      });
    } else if (
      existingDriver.mobile === data.mobile &&
      existingDriver.country_code === data.country_code
    ) {
      return res.status(400).send({
        success: false,
        message:
          "A driver already exists with this country code and mobile number",
      });
    }
  }
  try {
    // Find and update the driver record
    const updatedConfig = await driver.findOneAndUpdate(
      { _id },
      { $set: data },
      { new: true, runValidators: true } // Ensures validators are executed on update
    );

    // If no matching record is found
    if (!updatedConfig) {
      return res
        .status(404)
        .json({ success: false, message: "Driver not found" });
    }

    // Successfully updated record
    res.status(200).json({
      success: true,
      message: "Driver updated successfully",
      data: updatedConfig, // Return the updated record for confirmation
    });
  } catch (error) {
    console.error("Update failed:", error); // Log the error for debugging purposes
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while updating the driver",
    });
  }
};

const updateDriverStatus = async (req, res) => {
  const { _id, status } = req.body;

  // Validate required fields
  if (!_id) {
    return res
      .status(400)
      .json({ success: false, message: "Driver ID (_id) is required" });
  }
  if (!status) {
    return res.status(400).json({
      success: false,
      message: "Status is required and cannot be empty",
    });
  }

  try {
    // Find and update the driver record
    const updatedConfig = await driver.findOneAndUpdate(
      { _id },
      { $set: { status: status } },
      { new: true, runValidators: true } // Ensures validators are executed on update
    );

    // If no matching record is found
    if (!updatedConfig) {
      return res
        .status(404)
        .json({ success: false, message: "Driver not found" });
    }

    // Successfully updated record
    res.status(200).json({
      success: true,
      message: "Driver status updated successfully",
      data: updatedConfig, // Return the updated record for confirmation
    });
  } catch (error) {
    console.error("Status update failed:", error); // Log the error for debugging purposes
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating the driver status",
    });
  }
};

module.exports = {
  getDriver,
  addDriver,
  updateDriver,
  updateDriverStatus,
};
