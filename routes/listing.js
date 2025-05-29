const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const{listingSchema,reviewSchema}=require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isloggedIn,validateListing} = require("../middleware.js");



// index rout
router.get("/", wrapAsync( async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }));

  //New Route
router.get("/new", isloggedIn,(req, res) => {
  res.render("listings/new.ejs");
});





 // show rout
  router.get("/:id",  wrapAsync (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
      req.flash("error"," listing you requested does not exit!");
      res.redirect("/listings");

    }
    console.log(listing)
    res.render("listings/show.ejs", { listing});
  }));

  


  //Create Route
  router.post("/", isloggedIn,validateListing,
    wrapAsync (async(req, res,next) => {
     const newListing = new Listing(req.body.listing);
    //  newListing.owner = req.User._id;
    newListing.owner = req.user._id;
     await newListing.save();
     req.flash("success","new listing creatsd!")
    res.redirect("/listings");
 })
 );

 // edit Route
// ye chat gpt s kiya h 
router.get("/:id/edit",isloggedIn, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing.image) {
    listing.image = { url: "", filename: "" }; // Prevents "undefined" errors
  }

  if(!listing){
    req.flash("error"," listing you requested does not exit!");
    res.redirect("/listings");

  }

  res.render("listings/edit.ejs", { listing });
}));

// Update Route
// ye chat gpt s kiya h 
router.put("/:id",isloggedIn, wrapAsync(async (req, res) => {
  let { id } = req.params;
  let updatedData = req.body.listing;

  // Ensure `image` is stored as an object
  if (typeof updatedData.image === "string") {
    updatedData.image = { url: updatedData.image, filename: "" };
  }

  await Listing.findByIdAndUpdate(id, updatedData);
  req.flash("success","Listing Updated!")
  res.redirect(`/listings/${id}`);
}));


//Delete Route
router.delete("/:id", isloggedIn,  wrapAsync (async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted!")
    res.redirect("/listings");
  }));

  module.exports=router;

