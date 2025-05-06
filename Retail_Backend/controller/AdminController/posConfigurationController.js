const posConfiguration = require("../../models/posConfiguration");
const mongoose = require('mongoose');



const getPosConfiguration = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            const fetchedPosConfiguration = await posConfiguration.find().sort({ _id: -1 });
            return res.status(200).json({ success: true, data: fetchedPosConfiguration });
        }

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid posConfiguration id format" });
        }

        const fetchedPosConfiguration = await posConfiguration.findOne({ _id: id });
        if (!fetchedPosConfiguration) {
            return res.status(400).json({ success: false, message: "PosConfiguration not found" });
        }

        return res.status(200).json({ success: true, data: fetchedPosConfiguration });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const addPosConfiguration = async (req, res) => {
    const data = req.body;
    try {
        // Check if the data already exists (assuming you have a unique field like 'posConfigurationName')
        const existingRecord = await posConfiguration.findOne({ mac_address: data.mac_address });

        if (existingRecord) {
            return res.status(400).send({ success: false, message: "Pos Configuration already exists with this mac address" });
        }

        const newPosConfiguration = await posConfiguration.create(data)
        res.status(201).send({ success: true, message: "Pos Configuration created successfully", data: newPosConfiguration })
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error.message })
    }
}

const updatePosConfiguration = async (req, res) => {
    const { _id, ...data } = req.body;

    // Validate required fields
    if (!_id) {
        return res.status(400).json({ success: false, message: "Pos Configuration ID (_id) is required" });
    }
    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ success: false, message: "Data is required and cannot be empty" });
    }
    const existingPosConfiguration = await posConfiguration.findOne({
        mac_address: data.mac_address,
        _id: { $ne: _id },
    });

    if (existingPosConfiguration) {
        return res.status(400).send({
            success: false,
            message: "A posConfiguration is already exist with this mac_address",
        });
    }

    try {
        // Find and update the posConfiguration record
        const updatedConfig = await posConfiguration.findOneAndUpdate(
            { _id },
            { $set: data },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "PosConfiguration not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "PosConfiguration updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the posConfiguration",
        });
    }
};

const updatePosConfigurationStatus = async (req, res) => {
    const { _id, status } = req.body;

    // Validate required fields
    if (!_id) {
        return res.status(400).json({ success: false, message: "PosConfiguration ID (_id) is required" });
    }
    if (!status) {
        return res.status(400).json({ success: false, message: "Status is required and cannot be empty" });
    }

    try {
        // Find and update the posConfiguration record
        const updatedConfig = await posConfiguration.findOneAndUpdate(
            { _id },
            { $set: { status: status } },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "PosConfiguration not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "PosConfiguration status updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Status update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the posConfiguration status",
        });
    }
};

// const getPosConfigurationByMac = async (req, res) => {
//     try {
//         const { mac_address } = req.body;
//         if (!mac_address) {
//             return res.status(400).json({ success: false, message: "MAC Address is required" });
//         }
//         const fetchedPosConfiguration = await posConfiguration.findOne({ mac_address: mac_address,status:"active" }).populate("store");

//         if (!fetchedPosConfiguration) {
//             return res.status(400).json({ success: false, message: "POS Configuration not found" });
//         }

//         return res.status(200).json({ success: true, data: fetchedPosConfiguration });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

module.exports = {
    getPosConfiguration,
    addPosConfiguration,
    updatePosConfiguration,
    updatePosConfigurationStatus,
    // getPosConfigurationByMac
}