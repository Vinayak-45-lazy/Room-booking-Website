const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

const Listing = require("../models/listing");
const Review = require("../models/review");

const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/review.js"); 
// CREATE REVIEW
router.post("/", isLoggedIn, wrapAsync(reviewController.createReview));


// DELETE REVIEW  ← ⭐ THIS WAS MISSING
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,  wrapAsync(reviewController.deleteReview));


module.exports = router;
