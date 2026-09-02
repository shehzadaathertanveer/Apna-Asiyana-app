const mongoose = require("mongoose");

const listingsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter a property title"],
      trim: true,
      maxLength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please enter a property description"],
      maxLength: [2000, "Description cannot exceed 2000 characters"],
    },
    purpose: {
      type: String,
      required: [true, "Please specify if for Rent or Sale"],
      enum: {
        values: ["Rent", "Sale"],
        message: "Purpose must be either Rent or Sale",
      },
    },
    propertyType: {
      type: String,
      required: [true, "Please select property type"],
      enum: {
        values: [
          "House",
          "Apartment",
          "Plot",
          "Commercial",
          "Upper Portion",
          "Lower Portion",
          "Farm House",
        ],
        message: "Please select a valid property type",
      },
    },
    price: {
      type: Number,
      required: [true, "Please enter property price"],
      min: [0, "Price cannot be negative"],
    },
    location: {
      city: {
        type: String,
        required: [true, "Please enter city"],
        trim: true,
      },
      address: {
        type: String,
        required: [true, "Please enter location address"],
        trim: true,
      },
    },
    features: {
      bedrooms: {
        type: Number,
        default: 0,
        min: 0,
      },
      bathrooms: {
        type: Number,
        default: 0,
        min: 0,
      },
      floors: {
        type: Number,
        default: 0,
        min: 0,
      },
      area: {
        type: Number,
        required: [true, "Please enter property area size"],
        min: [0, "Area cannot be negative"],
      },
      areaUnits: {
        type: String,
        required: [true, "Please select area unit"],
        enum: ["Marla", "Kanal", "Sq. Ft."],
        default: "Marla",
      },
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listings", listingsSchema);