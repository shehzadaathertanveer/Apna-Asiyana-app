const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
      maxLength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email address"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Please enter your phone number"],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Please select a subject"],
      default: "General Inquiry",
      enum: [
        "General Inquiry",
        "Buying Property",
        "Selling Property",
        "Technical Support",
      ],
    },
    message: {
      type: String,
      required: [true, "Please enter your message"],
      maxLength: [1000, "Message cannot exceed 1000 characters"],
    },
    isRead: {
      type: Boolean,
      default: false, 
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Contact", contactSchema);