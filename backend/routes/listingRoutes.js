const express = require("express");
const upload = require("../middleware/multer");
const {
  getAllListings,
  getListingDetails,
  createANewlisting,
  updateListingOwner,
  deleteListing,
  getMyListings, 
} = require("../controllers/listingcontoller");
const { authenticatingLogin } = require("../middleware/auth");

const router = express.Router();


router.route("/listings").get(getAllListings);
router.route("/listing/:id").get(getListingDetails);


router.route("/me/listings").get(authenticatingLogin, getMyListings); 

router
  .route("/listing/new")
  .post(authenticatingLogin, upload.array("images", 10), createANewlisting);

router
  .route("/listing/:id")
  .put(authenticatingLogin, upload.array("images", 10), updateListingOwner)
  .delete(authenticatingLogin, deleteListing);

module.exports = router;