const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const WrapAsync=require("../utils/WrapAsync.js");
const listingSchema=require("../schema.js");
const ExpressError=require("../utils/ExpresssError.js");
const {isLoggedIn,isOwner,Validatelisting}=require("../middlewares.js");
const { Index } = require("../controllers/listing.js");
const listingController=require("../controllers/listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

router.
route("/")
.get(listingController.Index)
.post(isLoggedIn,upload.single("image"),Validatelisting,WrapAsync(listingController.createNewListing));
router.get("/search",WrapAsync(listingController.searchListing));
// GET new listing form
router.get("/new",isLoggedIn,WrapAsync(listingController.renderNewForm));

router.route("/:id")
.get(WrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("image"),Validatelisting,WrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,WrapAsync(listingController.DeleteListing));

// GET edit form
router.get("/:id/edit",isLoggedIn,isOwner,WrapAsync(listingController.editListing));


module.exports=router;