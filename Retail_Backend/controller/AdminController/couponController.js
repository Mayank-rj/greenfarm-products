const coupon = require("../../models/coupon");
const mongoose = require('mongoose');



const getCoupon = async (req, res) => {
    try {
           const id = req.query.id;
           if (!id) {
               const fetchedCoupon = await coupon.find().sort({ _id: -1 });
               return res.status(200).json({ success: true, data: fetchedCoupon });
           }
   
           // Check if the provided ID is a valid ObjectId
           if (!mongoose.Types.ObjectId.isValid(id)) {
               return res.status(400).json({ success: false, message: "Invalid coupon id format" });
           }
   
           const fetchedCoupon = await coupon.findOne({ _id: id });
           if (!fetchedCoupon) {
               return res.status(400).json({ success: false, message: "Coupon not found" });
           }
   
           return res.status(200).json({ success: true, data: fetchedCoupon });
       } catch (error) {
           console.error(error);
           res.status(500).json({ success: false, message: "Internal Server Error" });
       }
  };

const addCoupon = async (req, res) => {
    const data = req.body;
    try {
        // Check if the data already exists (assuming you have a unique field like 'couponName')
        const existingRecord = await coupon.findOne({ coupon_code: data.coupon_code });

        if (existingRecord) {
            return res.status(400).send({ success: false, message: "Coupon already exists with this code" });
        }

        const newCoupon = await coupon.create(data)
        res.status(201).send({ success: true, message: "Coupon created successfully", data: newCoupon })
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error.message })
    }
}

const updateCoupon = async (req, res) => {
    const { _id, ...data } = req.body;

    // Validate required fields
    if (!_id) {
        return res.status(400).json({ success: false, message: "Coupon ID (_id) is required" });
    }
    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ success: false, message: "Data is required and cannot be empty" });
    }
    const existingCoupon = await coupon.findOne({
        coupon_code: data.coupon_code,
        _id: { $ne: _id },
    });

    if (existingCoupon) {
        return res.status(400).send({
            success: false,
            message: "A coupon is already exist with this code",
        });
    }

    try {
        // Find and update the coupon record
        const updatedConfig = await coupon.findOneAndUpdate(
            { _id },
            { $set: data },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Coupon not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Coupon updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the coupon",
        });
    }
};

const updateCouponStatus = async (req, res) => {
    const { _id, status } = req.body;

    // Validate required fields
    if (!_id) {
        return res.status(400).json({ success: false, message: "Coupon ID (_id) is required" });
    }
    if (!status) {
        return res.status(400).json({ success: false, message: "Status is required and cannot be empty" });
    }

    try {
        // Find and update the coupon record
        const updatedConfig = await coupon.findOneAndUpdate(
            { _id },
            { $set: { status: status } },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Coupon not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Coupon status updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Status update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the coupon status",
        });
    }
};


module.exports = {
    getCoupon,
    addCoupon,
    updateCoupon,
    updateCouponStatus
}