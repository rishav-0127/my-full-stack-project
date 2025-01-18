const Review = require("../models/reviews.js");
const Listing = require("../models/listing");
module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    const newReview = new Review(req.body.review); // Assuming req.body.review has the required review data
    newReview.author = req.user._id; 
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success", "Review added successfully");
    res.redirect(`/listings/${listing._id}`); // Redirect back to the listing page after adding the review
    console.log("Review added");
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully');
    res.redirect(`/listings/${id}`);
}