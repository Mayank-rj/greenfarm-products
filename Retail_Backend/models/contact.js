const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true, // Ensure emails are lowercase
      match: [
        /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        "Please fill a valid email address",
      ],
    },
    contact: {
      type: String,
      required: true,
      match: [
        /^(?:\+?(\d{1,3}))?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/,
        "Please enter a valid contact number",
      ],
    },
    notes: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ContactUs", ContactSchema);
