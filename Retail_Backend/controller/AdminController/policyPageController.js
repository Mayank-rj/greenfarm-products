const policyPage = require("../../models/policyPage");
const mongoose = require('mongoose');



const getPolicyPage = async (req, res) => {
    try {
           const id = req.query.id;
           if (!id) {
               const fetchedPolicyPage = await policyPage.find().sort({ _id: -1 });
               return res.status(200).json({ success: true, data: fetchedPolicyPage });
           }
   
           // Check if the provided ID is a valid ObjectId
           if (!mongoose.Types.ObjectId.isValid(id)) {
               return res.status(400).json({ success: false, message: "Invalid policyPage id format" });
           }
   
           const fetchedPolicyPage = await policyPage.findOne({ _id: id });
           if (!fetchedPolicyPage) {
               return res.status(400).json({ success: false, message: "Policy Page not found" });
           }
   
           return res.status(200).json({ success: true, data: fetchedPolicyPage });
       } catch (error) {
           console.error(error);
           res.status(500).json({ success: false, message: "Internal Server Error" });
       }
  };

const addPolicyPage = async (req, res) => {
    const data = req.body;
    try {
        // Check if the data already exists (assuming you have a unique field like 'policyPageName')
        const existingRecord = await policyPage.findOne({ title: data.title });

        if (existingRecord) {
            return res.status(400).send({ success: false, message: "Policy Page already exists with this title" });
        }

        const newPolicyPage = await policyPage.create(data)
        res.status(201).send({ success: true, message: "Policy Page created successfully", data: newPolicyPage })
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error.message })
    }
}

const updatePolicyPage = async (req, res) => {
    const { _id, ...data } = req.body;

    // Validate required fields
    if (!_id) {
        return res.status(400).json({ success: false, message: "Policy Page ID (_id) is required" });
    }
    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ success: false, message: "Data is required and cannot be empty" });
    }
    const existingPolicyPage = await policyPage.findOne({
        title: data.title,
        _id: { $ne: _id },
    });

    if (existingPolicyPage) {
        return res.status(400).send({
            success: false,
            message: "A policy page is already exist with this title",
        });
    }

    try {
        // Find and update the policyPage record
        const updatedConfig = await policyPage.findOneAndUpdate(
            { _id },
            { $set: data },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Policy Page not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Policy Page updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the policyPage",
        });
    }
};

const updatePolicyPageStatus = async (req, res) => {
    const { _id, status } = req.body;

    // Validate required fields
    if (!_id) {
        return res.status(400).json({ success: false, message: "Policy Page ID (_id) is required" });
    }
    if (!status) {
        return res.status(400).json({ success: false, message: "Status is required and cannot be empty" });
    }

    try {
        // Find and update the policyPage record
        const updatedConfig = await policyPage.findOneAndUpdate(
            { _id },
            { $set: { status: status } },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Policy Page not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Policy Page status updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Status update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the policyPage status",
        });
    }
};


module.exports = {
    getPolicyPage,
    addPolicyPage,
    updatePolicyPage,
    updatePolicyPageStatus
}