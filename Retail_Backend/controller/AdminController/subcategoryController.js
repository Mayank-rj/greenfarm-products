const subcategory = require("../../models/subcategory");
const mongoose = require('mongoose');

const getSubcategory = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            const fetchedSubcategory = await subcategory.find().sort({ _id: -1 }).populate([{
                path: 'category',        // Populate the category field of Subcategory
                select: '_id name status', // Optionally select fields from Category (e.g., 'name' and 'description')
            },{
                path: 'store',
                select: '_id name status',
            }]);
            return res.status(200).json({ success: true, data: fetchedSubcategory });
        }

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid subcategory id format" });
        }

        const fetchedSubcategory = await subcategory.findOne({ _id: id });
        if (!fetchedSubcategory) {
            return res.status(400).json({ success: false, message: "Subcategory not found" });
        }

        return res.status(200).json({ success: true, data: fetchedSubcategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


const addSubcategory = async (req, res) => {
    const data = req.body;
    try {
        // Check if the data already exists (assuming you have a unique field like 'subcategoryName')
        const existingRecord = await subcategory.findOne({ name: data.name, catgeory: data.category,store:data.store });

        if (existingRecord) {
            return res.status(400).send({ message: "Subcategory already exists with this name,category and store" });
        }

        const newSubcategory = await subcategory.create(data)
        res.status(201).send({ success: true, message: "Subcategory created successfully", data: newSubcategory })
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error.message })
    }
}

const updateSubcategory = async (req, res) => {
    const { _id, ...data } = req.body;

    // Validate required fields
    if (!_id) {
        return res.status(400).json({ success: false, message: "Subcategory ID (_id) is required" });
    }
    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ success: false, message: "Data is required and cannot be empty" });
    }
    const existingSubcategory = await subcategory.findOne({
        name: data.name,
        catgeory: data.category,
        store:data.store, 
        _id: { $ne: _id },
    });

    if (existingSubcategory) {
        return res.status(400).send({
            success: false,
            message: "A subcategory is already exist with this name,category and store",
        });
    }


    try {
        // Find and update the subcategory record
        const updatedConfig = await subcategory.findOneAndUpdate(
            { _id },
            { $set: data },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );
        console.log(updatedConfig);

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Subcategory not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Subcategory updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the subcategory",
        });
    }
};

const getSubcategoryByCatgeoryId = async (req, res) => {
    try {
        const {category,store} = req.body;
        if (!category || !store) {
            return res.status(400).json({ success: false, message: "Category and Store id is required" });
        }

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(category) || !mongoose.Types.ObjectId.isValid(store)) {
            return res.status(400).json({ success: false, message: "Invalid category and store id format" });
        }

        const fetchedSubcategory = await subcategory.find({ category: category,store:store });
        if (!fetchedSubcategory) {
            return res.status(400).json({ success: false, message: "Subcategory not found" });
        }

        return res.status(200).json({ success: true, data: fetchedSubcategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const updateSubcategoryStatus = async (req, res) => {
    const { _id, status } = req.body;

    // Validate required fields
    if (!_id) {
        return res.status(400).json({ success: false, message: "Subcategory ID (_id) is required" });
    }
    if (!status) {
        return res.status(400).json({ success: false, message: "Status is required and cannot be empty" });
    }

    try {
        // Find and update the subcategory record
        const updatedConfig = await subcategory.findOneAndUpdate(
            { _id },
            { $set: { status: status } },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Subcategory not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Subcategory status updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Status update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the subcategory status",
        });
    }
};

module.exports = {
    getSubcategory,
    addSubcategory,
    updateSubcategory,
    getSubcategoryByCatgeoryId,
    updateSubcategoryStatus,
}