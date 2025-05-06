const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
    "name": {
        type: String,
        required: true
    },
    "cover": {
        type: String,
        required: true,
        trim: true,
    },
    "category": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',  // Reference to the Category model
        required: true,
    },
    "status": {
        type: String,
        enum: ["active", "deactive"],  // Add possible values for status
        default: "active"  // Default status value
    },
    "store": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
    }
}, { timestamps: true });

// Create and export the 'Subcategory' model
module.exports = mongoose.model("Subcategory", subcategorySchema);
