const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
 const ExpressError = require("../utils/ExpressError.js");
 const{reviewSchema}=require("../schema.js")
 const Review  = require("../models/review.js");
 const Listing = require("../models/listing.js");
const { isloggedIn } = require("../middleware.js");



 const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);  // Use reviewSchema here
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
  };
// reviews
//post rout
router.post("/",isloggedIn, validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }
  
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    await newReview.save();  // Save the review first
  
    if (!listing.reviews) { 
        listing.reviews = []; // Ensure 'reviews' array exists
    }

  
    listing.reviews.push(newReview); // Push only the review ID
    await listing.save();
    req.flash("success","new Review created!")
    res.redirect(`/listings/${listing._id}`);
  }));
  // delete review rout
  router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
  
    // Remove the review reference from the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  
    // Delete the review document from the database
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","review deleted!")
  
    // Redirect back to the correct listing page
    res.redirect(`/listings/${id}`);
  }));

  module.exports=router;