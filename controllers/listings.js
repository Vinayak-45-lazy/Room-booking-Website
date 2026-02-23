const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(req.params.id)
    .populate({path:"reviews", populate:{path:"author"}})
    .populate("owner"); // 👈 CHANGE HERE
  if (!listing) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing })};

 module.exports.createListing = async (req, res) => {
  const listing = new Listing(req.body.listing);

  listing.owner = req.user._id;

  if (req.file) {                          // ✅ only set image once, safely
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  await listing.save();

  req.flash("success", "New listing created!");
  res.redirect(`/listings/${listing._id}`);
};

  module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Cannot find that listing!");
      return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url; // Store original image URL
    originalImageUrl = originalImageUrl.replace("/upload/", "/upload/w_300/"); // Modify URL for thumbnail
    res.render("listings/edit", { listing, originalImageUrl });
  };

  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
      await listing.save();
    }
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
  };

  module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
  };