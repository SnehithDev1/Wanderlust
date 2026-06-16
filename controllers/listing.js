const Listing=require("../models/listing.js");
const ExpressError = require("../utils/ExpresssError");

module.exports.Index=async(req,res)=>{
    let allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings, msg:req.flash("msg")})
}
module.exports.renderNewForm=async(req,res)=>{
 res.render("listings/new.ejs");
}

module.exports.searchListing = async (req, res) => {
    // 1. Extract the search query from the URL (e.g., ?q=beach)
    let { q } = req.query;

    // 2. If the user submits an empty search, just redirect to all listings
    if (!q) {
        return res.redirect("/listings");
    }

    // 3. Search the database using Regex for partial, case-insensitive matches
    let allListings = await Listing.find({
        $or: [
            { title: { $regex: q, $options: "i" } },     // "i" means case-insensitive
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } }
        ]
    });

    // 4. Render the existing index page, but only pass the filtered listings
    res.render("listings/index.ejs", { allListings, msg: req.flash("msg") });
}

module.exports.createNewListing = async (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        throw new ExpressError(400, "Data payload not received");
    }

    let { title, description, price, location, country } = req.body;
    let url = req.file.path;
    let filename = req.file.filename;

    // GEOCODING: Default Fallback Setup
    const address = `${location}, ${country}`;
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    let geometry = { type: "Point", coordinates: [78.9629, 20.5937] }; 

    // Defensive API Call
    try {
        const response = await fetch(geoUrl, {
            headers: { 'User-Agent': 'WanderlustApp/1.0' } 
        });
        
        if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const geoData = await response.json();
                if (geoData.length > 0) {
                    geometry.coordinates = [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)];
                }
            } else {
                console.log("Create: Geocoding API returned non-JSON data. Using fallback.");
            }
        } else {
            console.log(`Create: Geocoding API failed with status ${response.status}. Using fallback.`);
        }
    } catch (err) {
        console.log("Create: Network error contacting Geocoding API:", err.message);
    }

    let newlist = new Listing({
        title: title,
        description: description,
        price: price,
        location: location,
        country: country, 
        image: {
            url: url,
            filename: filename
        },
        geometry: geometry,
        owner: req.user._id
    });

    await newlist.save();
    req.flash("success", "Successfully created new listing!");
    res.redirect("/listings");
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id).populate({path:"review",populate:{
        path:"author"
    }}).populate("owner");
    if(!listing){
        req.flash("error","listing doesnt exist")
        return res.redirect("/listings")
    }
    
    res.render("listings/show.ejs",{listing});
}
module.exports.editListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let oriImg=listing.image.url;
   oriImg= oriImg.replace("/upload","/upload/h_300/w_250")
    res.render("listings/edit.ejs",{listing,oriImg});
}
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let { title, description, price, location, country } = req.body;

    // GEOCODING: Default Fallback Setup
    const address = `${location}, ${country}`;
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    let geometry = { type: "Point", coordinates: [78.9629, 20.5937] }; 

    // Defensive API Call
    try {
        const response = await fetch(geoUrl, {
            headers: { 'User-Agent': 'WanderlustApp/1.0' } 
        });
        
        if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const geoData = await response.json();
                if (geoData.length > 0) {
                    geometry.coordinates = [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)];
                }
            } else {
                console.log("Update: Geocoding API returned non-JSON data. Using fallback.");
            }
        } else {
            console.log(`Update: Geocoding API failed with status ${response.status}. Using fallback.`);
        }
    } catch (err) {
        console.log("Update: Network error contacting Geocoding API:", err.message);
    }

    let updateData = {
        title: title,
        description: description,
        price: price,
        location: location,
        country: country,
        geometry: geometry
    };

    if (req.file) {
        updateData.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await Listing.findByIdAndUpdate(id, updateData);
    req.flash("success", "Updated Successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.DeleteListing=async(req,res)=>{
    let {id}=req.params;

    await Listing.findByIdAndDelete(id);
    req.flash("success","Deleted Successfully")
    res.redirect("/listings");
}