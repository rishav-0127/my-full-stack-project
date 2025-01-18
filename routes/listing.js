const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const passport = require("passport");
const  {  isLogedIn ,owner, isOwner }= require("../middleware.js");
 const multer = require("multer");
 const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

 const listingControler = require("../controllers/listings.js");






// Validation Middleware
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body.listing);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        req.flash("error", errMsg);
        return res.redirect("/listings/new");
    } else {
        next();
    }
};

// Get all listings
router.get("/", wrapAsync(listingControler.index));

// Render form to create a new listing
router.get("/new",isLogedIn, validateListing,  listingControler.renderNewForm); 

// Create a new listing
router.post("/",upload.single("listing[image]"), validateListing, wrapAsync(listingControler.createListing));

// Show specific listing
router.get("/:id", wrapAsync(listingControler.showListing));

// Render form to edit a listing
router.get("/:id/edit",isLogedIn,isOwner, wrapAsync(listingControler.renderEditForm));

// Update a listing
router.put("/:id", isLogedIn, isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingControler.updateListing));

// Delete a listing
router.delete("/:id",isLogedIn,isOwner, wrapAsync(listingControler.deleteListing));

//filters
router.get("/filter", async (req, res) => {
    const { category } = req.query;
    try {
        const filteredListings = await Listing.find({ category });
        res.render("listings/index", { listings: filteredListings }); // Assuming `index.ejs` displays listings
    } catch (err) {
        console.error(err);
        req.flash("error", "Could not fetch listings for this category.");
        res.redirect("/listings");
    }
});
module.exports = router;
