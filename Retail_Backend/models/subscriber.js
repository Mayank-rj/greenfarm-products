const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema(
  {
    "email": {
        type: String,
        required: true,
        lowercase: true,  // Ensure emails are lowercase
        match: [/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, 'Please fill a valid email address'],
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt`
  }
);


module.exports = mongoose.model("Subscriber", subscriberSchema);
