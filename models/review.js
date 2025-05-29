
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,  // Fixed: Use 'Number' instead of 'number'
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,  // Fixed: Use 'Date' instead of 'date'
        default: Date.now,  // Fixed: Remove parentheses
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

module.exports = mongoose.model("Review", reviewSchema);
