const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otpHash: { type: String, required: true }, // Store hashed OTP
  attempts: { type: Number, default: 0 }, // Track OTP attempts
  createdAt: { type: Date, default: Date.now, expires: 300 }, // Auto-delete after 10 minutes
});

module.exports = mongoose.model("OTP", otpSchema);
