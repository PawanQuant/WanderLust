const express = require("express");
const router = express.Router();
const wrapAsync = require("../utills/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage });

const  listingController = require("../controllers/listings.js")

//index route
router.get(
  "/",
  wrapAsync(listingController.index)
);

//new route
router.get("/new", isLoggedIn, listingController.renderForm);

//show route
router.get(
  "/:id",
  wrapAsync(listingController.showListing)
);

//create route
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.createListing)
);

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

//update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
   upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing),
);

//delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing),
);

module.exports = router;
