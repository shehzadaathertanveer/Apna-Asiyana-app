const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const Users = require("../models/userModel");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const ErrorHandler = require("../utils/ErrorHandler");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

//-----------------------------------------User Controllers--------------------------------------------

// Register a new user

exports.registerNewUSer = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, email, password, phoneNumber } = req.body;

  let avatarData;

  if (req.file) {
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "avatars", width: 150, crop: "scale" },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          },
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    avatarData = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const userData = {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
  };

  if (avatarData) {
    userData.avatar = avatarData;
  }

  const user = await Users.create(userData);

  sendToken(user, 200, res);
});

// login user

exports.userLogin = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  const user = await Users.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid credentials, please try again", 401));
  }

  const isPassCorrect = await user.comparePassword(password);

  if (!isPassCorrect) {
    return next(new ErrorHandler("Invalid credentials, please try again", 401));
  }

  sendToken(user, 200, res);
});

// logout user

exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// get user details for profile

exports.getUserDetailsForUser = catchAsyncError(async (req, res, next) => {
  const user = await Users.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// forgot password send mail

exports.forgotPasswordSendMailCode = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  const user = await Users.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetPasswordUrl = `${FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your password reset link is:\n\n ${resetPasswordUrl} \n\nIf you have not requested this email, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Apna Ashiyana Password Recovery Link`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// reset user password

exports.resetUserPasswordFromLink = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await Users.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Reset Password Token is invalid or has expired", 400),
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// update password user from dashboard

exports.UpdatesUserPassword = catchAsyncError(async (req, res, next) => {
  const user = await Users.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(
      new ErrorHandler("Old password is incorrect, please try again", 400),
    );
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Passwords do not match, please try again", 400),
    );
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

//update User Profile

exports.updateUserData = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
  };

  if (req.file) {
    const user = await Users.findById(req.user.id);

    if (user.avatar && user.avatar.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "avatars", width: 150, crop: "scale" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          },
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    newUserData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const user = await Users.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// delete user account

exports.deleteUserAccount = catchAsyncError(async (req, res, next) => {
  const user = await Users.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (user.avatar && user.avatar.public_id) {
    await cloudinary.uploader.destroy(user.avatar.public_id);
  }

  await user.deleteOne();

  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "User account deleted successfully",
  });
});

// Toggle Add/Remove Favorite Property

exports.toggleFavorite = catchAsyncError(async (req, res, next) => {
  const { listingId } = req.body; // or req.params.listingId

  if (!listingId) {
    return next(new ErrorHandler("Please provide a listing ID", 400));
  }

  const user = await Users.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const isFavorite = user.favorites.includes(listingId);

  if (isFavorite) {
    user.favorites = user.favorites.filter(
      (id) => id.toString() !== listingId.toString(),
    );
  } else {
    user.favorites.push(listingId);
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: isFavorite
      ? "Property removed from saved favorites"
      : "Property saved to favorites",
    favorites: user.favorites,
  });
});

// user saved favorite route

exports.getMyFavorites = catchAsyncError(async (req, res, next) => {
  const user = await Users.findById(req.user.id).populate("favorites");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const favorites = user.favorites.filter((listing) => listing !== null);

  res.status(200).json({
    success: true,
    count: favorites.length,
    favorites,
  });
});

// ------------------------------------- Admin Controllers ---------------------------------------------

// Get all users (Admin)
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const allUsers = await Users.find();

  res.status(200).json({
    success: true,
    count: allUsers.length,
    allUsers,
  });
});

// Get a single user details (Admin)
exports.getUserDetailsAdmin = catchAsyncError(async (req, res, next) => {
  const user = await Users.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Delete a user (Admin)
exports.deleteUserAdmin = catchAsyncError(async (req, res, next) => {
  const user = await Users.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (user.avatar && user.avatar.public_id) {
    await cloudinary.uploader.destroy(user.avatar.public_id);
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User account deleted successfully",
  });
});

// Update user role (Admin)
exports.changeUserRole = catchAsyncError(async (req, res, next) => {
  const { role } = req.body;

  if (!role) {
    return next(new ErrorHandler("Please provide a user role", 400));
  }

  const user = await Users.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  user.role = role;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `User role updated to ${role} successfully`,
    user,
  });
});
