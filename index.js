const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const initdata=require("./init/data.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(MONGO_URL);
    delete mongoose.models.Listing;
}
main().then(()=>{
    console.log("Connected to db");
})
.catch((err)=>{
    console.log(err);
});
const initDB=async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
}
initDB();