const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; 

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
const initDB = async () => {
  await Listing.deleteMany({});

  // Get the ObjectId for the owner
  // const ownerId = "65d33624aa57bf47c8f41f5d";

  // // Map over each sample listing and update the owner field
  // const listings = initData.data.map((obj) => ({...obj, owner: ownerId}));

  // Insert the updated listings into the database
  initData.data = initData.data.map((obj) => ({...obj, owner: "65d33624aa57bf47c8f41f5d"}));
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};

initDB();

