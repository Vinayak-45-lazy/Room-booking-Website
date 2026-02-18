const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    // Clear existing listings
    await Listing.deleteMany({});

    // ✅ Convert string to ObjectId
    const ownerId = new mongoose.Types.ObjectId(
  "698b45c23b43635f3d92e795"
);


    // Attach owner to each listing
    const listings = initData.data.map((obj) => ({
      ...obj,
      owner: ownerId
    }));

    // Insert into DB
    await Listing.insertMany(listings);

    console.log("Database initialized successfully 🚀");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

initDB();
