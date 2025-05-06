const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    "name": {
        type: String,
        required: true
    },
    "cover": {
        type: String,
        required: true,
        trim: true,
    },
    "status": {
        type: String,
        enum: ["active", "deactive"],  // Add possible values for status
        default: "active"  // Default status value
    }
}, { timestamps: true });

categorySchema.virtual('subcategories', {
    ref: 'Subcategory',         // The model to reference (Subcategory)
    localField: '_id',          // The field in Category that matches the foreign key in Subcategory
    foreignField: 'category',   // The field in Subcategory that references Category
  });
  
  // Apply virtuals to JSON output (so it appears when converting to JSON)
  categorySchema.set('toJSON', { virtuals: true });
  categorySchema.set('toObject', { virtuals: true });

// Create and export the 'Category' model
module.exports = mongoose.model("Category", categorySchema);
