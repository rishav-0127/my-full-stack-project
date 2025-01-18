const Listing = require('./models/listing');
const Review = require('./models/reviews.js');


module.exports.isLogedIn= (req, res, next) => {

if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You need to be logged in to view this page");
    return res.redirect("/login");
    }
next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (!req.session.redirectUrl) {
        // Set the redirect URL in the session or do something else to assign a value
        req.session.redirectUrl = '/listings'; // Example default URL
    }
    
    // Now set the redirect URL in res.locals for access in views or further middleware
    res.locals.redirectUrl = req.session.redirectUrl;

    next();
}
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;

    try {
        // Find the listing by ID
        const listing = await Listing.findById(id);

        // Check if the listing exists
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        // Check if listing.owner exists and is valid
        if (!listing.owner || !res.locals.currentUser || !listing.owner.equals(res.locals.currentUser._id)) {
            req.flash("error", "You do not have permission to do that");
            return res.redirect(`/listings/${id}`);
        }

        // Proceed to the next middleware if ownership is verified
        next();
    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong");
        return res.redirect("/listings");
    }
};
// Ensure this path is correct

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;

    // Find the review and populate the author field
    const review = await Review.findById(reviewId).populate('author');

    if (!review) {
        req.flash('error', 'Review not found');
        return res.redirect(`/listings/${id}`);
    }

    // Ensure currentUser is set and compare with review.author
    if (!review.author || !review.author.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/listings/${id}`);
    }

    next();
};
// module.exports.validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body.listing);
//     if (error) {
//         const errMsg = error.details.map((el) => el.message).join(", ");
//         req.flash("error", errMsg);
//         return res.redirect("/listings/new");
//     } else {
//         next();
//     }
// };


       

 