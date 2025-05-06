const store = require("../../models/store");
const mongoose = require('mongoose');

const getStore = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            const fetchedStore = await store.find().sort({ _id: -1 }).populate("city");
            return res.status(200).json({ success: true, data: fetchedStore });
        }

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid store id format" });
        }

        const fetchedStore = await store.findOne({ _id: id });
        if (!fetchedStore) {
            return res.status(400).json({ success: false, message: "Store not found" });
        }

        return res.status(200).json({ success: true, data: fetchedStore });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


const addStore = async (req, res) => {
    
    const data = req.body;
    try {
        // Check if the data already exists (assuming you have a unique field like 'storeName')
        const existingRecord = await store.findOne({ name: data.name, address: data.address,mobile:data.mobile });

        if (existingRecord) {
            return res.status(400).send({ message: "Store already exists with this name, mobile and address" });
        }

        const newStore = await store.create(data)
        res.status(201).send({ success: true, message: "Store created successfully", data: newStore })
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error.message })
    }
}

const updateStore = async (req, res) => {
    const { _id, ...data } = req.body;

    // Validate required fields
    if (!_id) {
        return res.status(400).json({ success: false, message: "Store ID (_id) is required" });
    }
    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ success: false, message: "Data is required and cannot be empty" });
    }
    const existingStore = await store.findOne({
        name: data.name,
        address: data.address,
        mobile:data.mobile,
        _id: { $ne: _id },
    });

    if (existingStore) {
        return res.status(400).send({
            success: false,
            message: "A store is already exist with this name and address",
        });
    }
    try {
        // Find and update the store record
        const updatedConfig = await store.findOneAndUpdate(
            { _id },
            { $set: data },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );
        console.log(updatedConfig);

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Store not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Store updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the store",
        });
    }
};



const getStoreCount = async (req, res) => {
    try {
        const totalStore = await store.countDocuments();
        res.status(200).json({ success: true, total: totalStore });
    } catch (error) {
        console.error("Error fetching store count:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const updateStoreStatus = async (req, res) => {
    const { _id, status } = req.body;

    // Validate required fields
    if (!_id) {
        return res.status(400).json({ success: false, message: "Store ID (_id) is required" });
    }
    if (!status) {
        return res.status(400).json({ success: false, message: "Status is required and cannot be empty" });
    }

    try {
        // Find and update the store record
        const updatedConfig = await store.findOneAndUpdate(
            { _id },
            { $set: { status: status } },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Store not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Store status updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Status update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the store status",
        });
    }
};
module.exports = {
    getStore,
    addStore,
    updateStore,
    getStoreCount,
    updateStoreStatus
}