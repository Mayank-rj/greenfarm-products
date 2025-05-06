const mongoose = require("mongoose");

const posConfigurationSchema = new mongoose.Schema({
  store_ip: {
    type: String,
    required: true,
    match:
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, // Regular expression for IPv4 address
    trim: true,
  },
  mac_address: {
    type: String,
    required: true,
    match: /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/, // Regular expression for MAC address
    trim: true,
  },
  weight_scale_port: {
    type: String,
    required: true,
    trim: true,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store", // Reference to the Variation model
    required: true,
  },
  boud_rate: {
    type: Number,
    required: true,
    min: 0, // Baud rate should be a positive number
  },
  data_bits: {
    type: Number,
    required: true,
    // enum: [5, 6, 7, 8], // Valid data bit options
  },
  parity: {
    type: String,
    required: true,
    enum: ["none", "even", "odd"],
    default: "none",
    trim: true,
  },
  stop_bits: {
    type: Number,
    required: true,
    // enum: [1, 1.5, 2], // Valid stop bit options
  },
  flow_type: {
    type: Boolean,
    required: true,
  },
  printer_ip: {
    type: String,
    required: true,
    match:
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, // IPv4 regex
    trim: true,
  },
  printer_port: {
    type: Number,
    required: true,
    min: 0,
    max: 65535, // Valid range for ports
  },
  surcharge: {
    type: Number,
    required: true,
    min: 0, // Assuming surcharge should never be negative
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "deactive"],
    default: "active",
  },
  pos_name: {
    type: String,
    required: true,
    trim: true,
  },
  pin: {
    type: String,
    required: [true, "Pin is required"],
  },
});

posConfigurationSchema.index({ storeIp: 1, macAddress: 1, store: 1 });

// Export the schema as a model
module.exports = mongoose.model("POSCONFIGURATION", posConfigurationSchema);
