const express = require("express");
const router = express.Router({ mergeParams : true});
const wrapAsync = require("../utills/wrapAsync.js");
const ExpressError = require("../utills/ExpressError.js");
const { listingSchema , reviewSchema  } = require("../schema.js");
const Review = require("../models/review.js")
const Listing = require("../models/listing.js");
const { validateReview , isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//Reviews
//Post Rout
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview))

//delete review route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
