const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://kanha_db:v3izt8pnfRAn2akS@ac-phmndhk-shard-00-00.5h3t1md.mongodb.net:27017,ac-phmndhk-shard-00-01.5h3t1md.mongodb.net:27017,ac-phmndhk-shard-00-02.5h3t1md.mongodb.net:27017/wanderlust?ssl=true&replicaSet=atlas-1366hm-shard-0&authSource=admin&appName=Cluster0";

main()
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  // 1. Clear existing data
  await Listing.deleteMany({});
  console.log("Cleared existing listings. Fetching coordinates...");

  // 2. Loop through each listing sequentially (Do NOT use .map or Promise.all here)
  for (let listing of initData.data) {
    const address = `${listing.location}, ${listing.country}`;
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

    try {
      const response = await fetch(geoUrl, {
        headers: { 'User-Agent': 'WanderlustApp/1.0' }
      });
      const geoData = await response.json();

      // Default to Center of India if API fails
      let geometry = { type: "Point", coordinates: [78.9629, 20.5937] };

      if (geoData && geoData.length > 0) {
        geometry.coordinates = [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)];
      }

      // Attach geometry to the current listing object
      listing.geometry = geometry;

      // 3. The Security Delay: Force Node.js to pause for 1.2 seconds to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1200));

    } catch (err) {
      console.log(`Failed to fetch geometry for ${address}`, err);
      // Fallback in case of network error so the DB still seeds
      listing.geometry = { type: "Point", coordinates: [78.9629, 20.5937] }; 
    }
  }

  // 4. Insert the updated data into MongoDB
  await Listing.insertMany(initData.data);
  console.log("Data was initialized successfully with real map coordinates!");
};

initDB();