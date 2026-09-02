const Contact = require("../models/contactModel"); 
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

//---------------------------public--------------------------

exports.sendMessage = catchAsyncError(async (req, res, next) => {
  const { name, email, phone, subject, message } = req.body;
  
  if (!name || !email || !phone || !message) {
    return next(new ErrorHandler("Please fill out all required fields (*)", 400));
  }

  const newMessage = await Contact.create({
    name,
    email,
    phone,
    subject: subject || "General Inquiry",
    message,
  });

  res.status(201).json({
    success: true,
    message: "Your message has been sent successfully!",
    data: newMessage,
  });
});

//-----------------------admin-------------------------

exports.getAllMessages = catchAsyncError(async (req, res, next) => {
  const messages = await Contact.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: messages.length,
    messages,
  });
});

exports.readMessage = catchAsyncError(async (req, res, next) => {
  const message = await Contact.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );

  if (!message) {
    return next(new ErrorHandler("Message not found", 404)); 
  }

  res.status(200).json({
    success: true,
    message: "Message marked as read",
    data: message,
  });
});