const express = require('express');
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const { reviewsSchema } = require('../schema.js');
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const { isLogedIn, isReviewAuthor } = require('../middleware.js');
const reviewControler = require("../controllers/reviews.js")
const validateReviews = (req, res, next) => {
    const { error } = reviewsSchema.validate(req.body.review); // Ensure we're validating the review part of the body
    if (error) {
        let errMsg = error.details.map(el => el.message).join(", ");
        return next(new ExpressError(400, errMsg)); // Pass the error to the next middleware
    } else {
        next();
    }
};

// Route for adding a review to a listing
router.post("/",isLogedIn, wrapAsync(reviewControler.createReview));

// Route for deleting a review from a listing
router.delete(
    '/:reviewId',
    isLogedIn, // Ensure user is logged in
    isReviewAuthor,
    wrapAsync(reviewControler.deleteReview)
);


module.exports = router;
