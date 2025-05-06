const banner = require("../../models/banner");
const mongoose = require('mongoose');

const getBanner = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            const fetchedBanner = await banner.find().sort({ _id: -1 }).populate("store");
            return res.status(200).json({ success: true, data: fetchedBanner });
        }

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid banner id format" });
        }

        const fetchedBanner = await banner.findOne({ _id: id });
        if (!fetchedBanner) {
            return res.status(400).json({ success: false, message: "Banner not found" });
        }

        return res.status(200).json({ success: true, data: fetchedBanner });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


const addBanner = async (req, res) => {
    const data = req.body;
    try {
        // Check if the data already exists (assuming you have a unique field like 'bannerName')
        const existingRecord = await banner.findOne({ type: data.type,link:data.link,message:data.message,position:data.position,store:data.store,page:data.page });

        if (existingRecord) {
            return res.status(400).send({ success: false, message: "Banner already exists with this data" });
        }

        const newBanner = await banner.create(data)
        res.status(201).send({ success: true, message: "Banner created successfully", data: newBanner })
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error.message })
    }
}

const updateBanner = async (req, res) => {
    const { _id, ...data } = req.body;

    // Validate required fields
    if (!_id) {
        return res.status(400).json({ success: false, message: "Banner ID (_id) is required" });
    }
    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ success: false, message: "Data is required and cannot be empty" });
    }
    const existingBanner = await banner.findOne({
        type: data.type,
        link:data.link,
        message:data.message,
        position:data.position,
        store:data.store,
        page:data.page,
        _id: { $ne: _id },
    });

    if (existingBanner) {
        return res.status(400).send({
            success: false,
            message: "A banner is already exist with this data",
        });
    }

    try {
        // Find and update the banner record
        const updatedConfig = await banner.findOneAndUpdate(
            { _id },
            { $set: data },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );
        console.log(updatedConfig);

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Banner not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Banner updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the banner",
        });
    }
};
const updateBannerStatus = async (req, res) => {
    const { _id, status } = req.body;

    if (!_id) {
        return res.status(400).json({ success: false, message: "Banner ID (_id) is required" });
    }
    if (!status) {
        return res.status(400).json({ success: false, message: "Status is required and cannot be empty" });
    }

    try {
        // Find and update the category record
        const updatedConfig = await banner.findOneAndUpdate(
            { _id },
            { $set: { status: status } },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Banner not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Banner status updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Status update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the banner status",
        });
    }
};


module.exports = {
    getBanner,
    addBanner,
    updateBanner,
    updateBannerStatus
}