const category = require("../../models/category");
const mongoose = require('mongoose');



const getCategory = async (req, res) => {
    try {
           const id = req.query.id;
           if (!id) {
               const fetchedCategory = await category.find().sort({ _id: -1 });
               return res.status(200).json({ success: true, data: fetchedCategory });
           }
   
           // Check if the provided ID is a valid ObjectId
           if (!mongoose.Types.ObjectId.isValid(id)) {
               return res.status(400).json({ success: false, message: "Invalid category id format" });
           }
   
           const fetchedCategory = await category.findOne({ _id: id });
           if (!fetchedCategory) {
               return res.status(400).json({ success: false, message: "Category not found" });
           }
   
           return res.status(200).json({ success: true, data: fetchedCategory });
       } catch (error) {
           console.error(error);
           res.status(500).json({ success: false, message: "Internal Server Error" });
       }
  };

const addCategory = async (req, res) => {
    const data = req.body;
    try {
        // Check if the data already exists (assuming you have a unique field like 'categoryName')
        const existingRecord = await category.findOne({ name: data.name });

        if (existingRecord) {
            return res.status(400).send({ success: false, message: "Category already exists with this name" });
        }

        const newCategory = await category.create(data)
        res.status(201).send({ success: true, message: "Category created successfully", data: newCategory })
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error.message })
    }
}

const updateCategory = async (req, res) => {
    const { _id, ...data } = req.body;

    // Validate required fields
    if (!_id) {
        return res.status(400).json({ success: false, message: "Category ID (_id) is required" });
    }
    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ success: false, message: "Data is required and cannot be empty" });
    }
    const existingCategory = await category.findOne({
        name: data.name,
        _id: { $ne: _id },
    });

    if (existingCategory) {
        return res.status(400).send({
            success: false,
            message: "A category is already exist with this name",
        });
    }

    try {
        // Find and update the category record
        const updatedConfig = await category.findOneAndUpdate(
            { _id },
            { $set: data },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the category",
        });
    }
};

const updateCategoryStatus = async (req, res) => {
    const { _id, status } = req.body;

    // Validate required fields
    if (!_id) {
        return res.status(400).json({ success: false, message: "Category ID (_id) is required" });
    }
    if (!status) {
        return res.status(400).json({ success: false, message: "Status is required and cannot be empty" });
    }

    try {
        // Find and update the category record
        const updatedConfig = await category.findOneAndUpdate(
            { _id },
            { $set: { status: status } },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Category status updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Status update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the category status",
        });
    }
};


module.exports = {
    getCategory,
    addCategory,
    updateCategory,
    updateCategoryStatus
}