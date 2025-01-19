const Listing = require("../models/listing");
const Review = require("../models/reviews.js");
module.exports.index = async (req, res) => {
 
    const allListings = await Listing.find();
    res.render("listings/index", { allListings });
}
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new", { currentListing: {} });
  }

  module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    
    // Optional: Uncomment this check if you want to validate the ID format
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     req.flash("error", "Invalid Listing ID");
    //     return res.redirect("/listings");
    // }

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author", select: "username" }
        })
      .populate('owner', '_id username'); // Populate 'owner' with 'username' field

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    res.render("listings/show", { listing });
}

module.exports.createListing = async (req, res) => {
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url, "..", filename);
    const newListing = new Listing(req.body.listing);
   
    newListing.owner = req.user._id;
    newListing.image = { url,filename};
    await newListing.save();
    req.flash("success", "Successfully created a new listing");
    res.redirect("/listings");
   
}
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const currentListing = await Listing.findById(id);
    if (!currentListing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
let originalImageUrl = currentListing.image.url;
originalImageUrl.replace("upload","upload/w_200,h_200,c_thumb");

    res.render("listings/edit", { currentListing, originalImageUrl});
}
module.exports.updateListing = async (req, res) => {  
    const { id } = req.params;

    // Find the listing by ID
    const listing = await Listing.findById(id);
      // Check if the listing exists
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    // Update the listing
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    if( typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image = { url,filename};
    await listing.save();
    }
    req.flash("success", "Successfully updated the listing");
    res.redirect(`/listings/${updatedListing._id}`);
}
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     req.flash("error", "Invalid Listing ID");
    //     return res.redirect("/listings");
    // }
    const deletedListing =  Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    req.flash("success", "Successfully deleted the listing");
    res.redirect("/listings");
}
