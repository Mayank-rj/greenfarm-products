const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    "first_name": {
        type: String,
        required: true,
        trim: true,  // Removes extra spaces
    },
    "last_name": {
        type: String,
        required: true,
        trim: true,  // Removes extra spaces
    },
    "email": {
        type: String,
        required: true,
        unique: true,
        lowercase: true,  // Ensure emails are lowercase
        match: [/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, 'Please fill a valid email address'],
    },
    "password": {
        type: String,
        required: true,

    },
    "gender": {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    "city": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',  // Reference to the Variation model
        required: true
    },
    "address": {
        type: String,
        trim: true,
    },
    "mobile": {
        type: String,
        required: true,
    },
    "status": {
        type: String,
        enum: ['active', 'deactive'],
        default: 'active',  // Default status value
    },
    "cover": {
        type: String,
        trim: true,
    },
    "current_status": {
        type: String,
        default: 'Available',
        trim: true,
    },
    "others": {
        type: String,
        trim: true,
    },
    "country_code": {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Driver', driverSchema);
