const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncError");

exports.authenticatingLogin = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      new ErrorHandler("Please Login first to access this resource", 401),
    );
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await Users.findById(decodedData.id);

  next();
});

exports.authorizedRoles = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403,
        ),
      );
    }
    next()
  };
};
