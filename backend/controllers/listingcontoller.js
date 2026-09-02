const Listings = require("../models/listingsModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const APIFeatures = require("../utils/APIFeatures");
const ErrorHandler = require("../utils/ErrorHandler");
const streamifier = require("streamifier");
const connectDatabase = require("../config/dataBase");
const cloudinary = require("cloudinary").v2;

// Get All Property Listings (With Search & Filter)
exports.getAllListings = catchAsyncError(async (req, res, next) => {
  // CRITICAL FOR VERCEL: Ensure database is connected before querying
  await connectDatabase()

  const resPerPage = 8;
  const listingsCount = await Listings.countDocuments();

  const apiFeature = new APIFeatures(Listings.find(), req.query)
    .search()
    .filter();

  let listings = await apiFeature.query.clone();
  const filteredListingsCount = listings.length;

  apiFeature.pagination(resPerPage);
  listings = await apiFeature.query;

  res.status(200).json({
    success: true,
    totalListings: listingsCount,
    filteredCount: filteredListingsCount,
    resPerPage,
    listings,
  });
});

// Get Single Property Details
exports.getListingDetails = catchAsyncError(async (req, res, next) => {
  // Populate the 'owner' reference so the frontend gets full user details (including phoneNumber)
  const listing = await Listings.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("owner", "firstName lastName email phoneNumber avatar");

  if (!listing) {
    return next(new ErrorHandler("Listing not found", 404));
  }

  res.status(200).json({
    success: true,
    listing,
  });
});

//post a property
exports.createANewlisting = catchAsyncError(async (req, res, next) => {
  let images = [];

  if (req.files && req.files.length > 0) {
    const uploadStream = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "listings" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          },
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    for (const file of req.files) {
      const result = await uploadStream(file.buffer);
      images.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  }

  req.body.images = images;
  req.body.owner = req.user.id;

  const listing = await Listings.create(req.body);

  res.status(201).json({
    success: true,
    listing,
  });
});

//delete listing
exports.deleteListing = catchAsyncError(async (req, res, next) => {
  const listing = await Listings.findById(req.params.id);

  if (!listing) {
    return next(new ErrorHandler("Listing not found", 404));
  }

  if (
    listing.owner.toString() !== req.user.id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(
      new ErrorHandler("Unauthorized: You cannot delete this listing", 403),
    );
  }

  if (listing.images && listing.images.length > 0) {
    for (const image of listing.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }
  }

  await listing.deleteOne();

  res.status(200).json({
    success: true,
    message: "Listing deleted successfully",
  });
});

//update listing

exports.updateListingOwner = catchAsyncError(async (req, res, next) => {
  let listing = await Listings.findById(req.params.id);

  if (!listing) {
    return next(new ErrorHandler("Listing not found", 404));
  }

  if (
    listing.owner.toString() !== req.user.id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(
      new ErrorHandler("Unauthorized: You cannot edit this listing", 403),
    );
  }

  if (req.files && req.files.length > 0) {
    if (listing.images && listing.images.length > 0) {
      for (const img of listing.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    const uploadStream = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "listings" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          },
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    let newImages = [];
    for (const file of req.files) {
      const result = await uploadStream(file.buffer);
      newImages.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = newImages;
  }

  listing = await Listings.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    listing,
  });
});

// Get all properties posted by the user
exports.getMyListings = catchAsyncError(async (req, res, next) => {
  const listings = await Listings.find({ owner: req.user.id });

  res.status(200).json({
    success: true,
    count: listings.length,
    listings,
  });
});
