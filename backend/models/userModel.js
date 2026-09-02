const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your first name"],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email address"],
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [8, "Password must be at least 8 characters long"],
    },
    propertiesListed: {
      type: Number,
      default: 0,
      min: 0,
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listings",
      },
    ],
    avatar: {
      public_id: {
        type: String,
        default: "profil_default_instagram",
      },
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/okks7spy/image/upload/v1787851897/profil_default_instagram.jpg",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    phoneNumber: {
      type: String,
      required: [true, "Please enter your phone number"],
      unique: true,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Hashing User password in DataBase before saving
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT for login
UserSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

// Method for checking password during login
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method for generating password reset token
UserSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("Users", UserSchema);