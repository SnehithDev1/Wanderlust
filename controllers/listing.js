const Listing=require("../models/listing.js");

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

module.exports.createNewListing=async(req,res,next)=>{

    
    if(!req.body || Object.keys(req.body).length===0){
        throw new ExpressError(400,"Data payload not received");
    }
    let {title, description, price, location, country, image}=req.body;
    let url=req.file.path;
    let filename=req.file.filename;

    //GEOCODING
    const address = `${location}, ${country}`;
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    
    // Nominatim requires a valid User-Agent header
    const response = await fetch(geoUrl, {
        headers: { 'User-Agent': 'WanderlustApp/1.0' } 
    });
    const geoData = await response.json();
    
    // Default to Center of India if API fails or location is totally invalid
    let geometry = { type: "Point", coordinates: [78.9629, 20.5937] }; 
    if (geoData.length > 0) {
        geometry.coordinates = [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)];
    }

    let newlist=new Listing({
        title:title,
        description:description,
        price:price,
        location:location,
        country:country, 
        image:{
            url:url,
            filename:filename
        },
        geometry:geometry,
        owner:req.user._id
    });
    await newlist.save();
        req.flash("success","Successfully created");
        
    res.redirect("/listings");
}


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

    //GEOCODING 
    const address = `${location}, ${country}`;
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    
    const response = await fetch(geoUrl, {
        headers: { 'User-Agent': 'WanderlustApp/1.0' } 
    });
    const geoData = await response.json();
    
    let geometry = { type: "Point", coordinates: [78.9629, 20.5937] }; 
    if (geoData.length > 0) {
        geometry.coordinates = [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)];
    }

    // 1. Prepare the standard text data updates
    let updateData = {
        title: title,
        description: description,
        price: price,
        location: location,
        country: country,
        geometry:geometry
    };

    // 2. Conditionally check if a new file was uploaded
    // If req.file exists, add the new image data to our update object
    if (req.file) {
        updateData.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    // 3. Perform a single database update
    await Listing.findByIdAndUpdate(id, updateData);

    req.flash("success", "Updated Successfully");
    res.redirect(`/listings/${id}`);
}
module.exports.DeleteListing=async(req,res)=>{
    let {id}=req.params;

    await Listing.findByIdAndDelete(id);
    req.flash("success","Deleted Successfully")
    res.redirect("/listings");
}