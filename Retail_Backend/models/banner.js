const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    cover: {
      type: String,
      required: true,
      trim: true, // Ensures no leading/trailing spaces
    },
    link: {
      type: String,
      //   required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['category', 'product', 'external'],
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    message: {
      type: String,
      //   required: true,
      minlength: [10, 'Message should be at least 10 characters long'], // Ensure message is of adequate length
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'deactive'], // Only allows certain values
      default: 'active', // Default value is active
    },
    position: {
      type: String,
      required: true,
      trim: true,
      enum: ['top', 'bottom', 'between'],
    },
    page: {
      type: String,
      required: true,
      trim: true,
      enum: ['home', 'catalogue', 'product'],
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt`
  }
);


module.exports = mongoose.model("Banner", bannerSchema);
