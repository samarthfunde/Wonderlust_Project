

const Listing = require("../models/listing"); // Corrected import
const Review = require("../models/review");


// we create Post Route
module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save(); // Save the review to the database
    await listing.save(); // Save the updated listing
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}

//we create Delete Route
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    // Redirect back to the listing page
    res.redirect(`/listings/${id}`);
} 