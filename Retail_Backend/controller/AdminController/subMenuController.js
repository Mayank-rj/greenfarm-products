const { default: mongoose } = require("mongoose");
const subMenu = require("../../models/submenu");

const getSubMenuByStore = async (req, res) => {
    const { store } = req.body;
    try {
        if (!store) {
            return res.status(400).json({ success: false, message: "Store ID (_id) is required" });
        }
        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(store)) {
            return res.status(400).json({ success: false, message: "Invalid store id format" });
        }
        const fetchedSubMenu = await subMenu.findOne({ store: store });

        return res.status(200).json({ success: true, data: fetchedSubMenu });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



const updateSubMenu = async (req, res) => {
    const { ...data } = req.body;
    console.log(data);

    // Validate required fields
    if (!data.store) {
        return res.status(400).json({ success: false, message: "Store ID (_id) is required" });
    }

    try {
        // Find and update the subMenu record
        const updatedConfig = await subMenu.findOneAndUpdate(
            { store: data.store },
            { $set: data },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            const newSubMenu = await subMenu.create(data)
            return res.status(201).json({ success: true, message: "SubMenu created successfully", data: newSubMenu });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "SubMenu updated successfully",
            data: updatedConfig,
        });
    } catch (error) {
        console.error("Update failed:", error);
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the subMenu",
        });
    }
};


module.exports = {
    getSubMenuByStore,
    updateSubMenu,
}