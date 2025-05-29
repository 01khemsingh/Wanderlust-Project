// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const listenSchema = new Schema({
//     title :{ 
//         type :String,
//        require : true,
//     },
//     description :String,
//     image :{
//     type :    String,
//     default: "https://unsplash.com/photos/a-living-room-with-a-couch-and-a-desk-bqSjAngxOVU",
//     set : (v)=> v=== " " ? "https://unsplash.com/photos/a-living-room-with-a-couch-and-a-desk-bqSjAngxOVU": v,
//     },
//     price :String,
//     location :String,
//     country :String,
// });
//  const Listing = mongoose.model("Listing",listenSchema);
//  module.exports = Listing;



const mongoose = require('mongoose');
const Schema = mongoose.Schema; // ✅ Ensure Schema is defined
const Review = require('./review.js'); // ✅ Ensure Review model is correctly imported

const listingSchema = new Schema({
  title: { type: String },
  description: { type: String },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  image: {
    url: { 
      type: String, 
      default: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", // ✅ Direct Unsplash Image URL
      set: (v) => v.trim() === "" ? "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" : v, // ✅ Ensures empty values are replaced
    }, 
    filename: { type: String, default: "" }
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner : {
    type:Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}}) 
  }
})

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
