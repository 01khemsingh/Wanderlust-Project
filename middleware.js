// const Listing = require('../models/listing'); // Adjust the path if necessary
const{listingSchema,reviewSchema}=require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


module.exports.isloggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listing!");
        return res.redirect("/login")
      }
      next()
}

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// module.exports.isOwner = async (req, res, next) => {
//   let { id } = req.params;
//   let listing = await Listing.findById(id);

//   if (!listing) {
//       req.flash("error", "Listing not found!");
//       return res.redirect("/listings");
//   }

//   if (!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {
//       req.flash("error", "You don't have permission to edit this listing.");
//       return res.redirect(`/listings/${id}`);
//   }

//   next(); // Move to next middleware if owner check passes
// };


module.exports.validateListing = (req,res,next)=>{
    let { error } = listingSchema.validate(req.body);  // Use listingSchema here
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
  };
