const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");   // 👈 REQUIRED

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  image: {
    url: String,
    filename: String,
    
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  location: String,
  country: String,

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});


// 🔥 MIDDLEWARE: delete all reviews when listing is deleted
listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews },
    });
  }
});

module.exports = mongoose.model("Listing", listingSchema);
