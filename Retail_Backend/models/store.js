const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
    "name": {
        type: String,
        required: true
    },
    "mobile": {
        type: String,
        required: true,
    },
    "abn":{
        type:String,
        required: true
    },
    "lat": {
        type: Number, // Changed to Number for better handling of coordinates
        // required: true,
        min: -90,
        max: 90 // Validation for valid latitude range
    },
    "lng": {
        type: Number, // Changed to Number for better handling of coordinates
        // required: true,
        min: -180,
        max: 180 // Validation for valid longitude range
    },
    "address": {
        type: String,
        required: true
    },
    "description": {
        type: String,
        required: true,
    },

    "cover": {
        type: String,
        required: true,
        trim: true,
    },
    "status": {
        type: String,
        required: true,
        enum: ["active", "deactive"], // Enum for predefined status values
        default: "active" // Default status
    },
    "commission": {
        type: Number, // Changed to Number for better calculations
        required: true
    },
    "open_time": {
        type:String,
        required: true
    },
    "close_time": {
        type:String,
        required: true
    },
    "isClosed": {
        type: Boolean, // Changed to Boolean for true/false values
        required: false,
    },
    "certificate_url": {
        type: String,
        required: true
    },
    "certificate_type": {
        type: String,
        required: true
    },
    "rating": {
        type: Number, // Changed to Number
        required: true,
        min: 0,
        max: 5 // Assuming a 0-5 rating scale
    },
    "city": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',  // Reference to the Variation model
        required:true
    }
}, { timestamps: true });

module.exports = mongoose.model("Store", storeSchema);
