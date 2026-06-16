const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const Review=require("../models/reviews.js");
const WrapAsync=require("../utils/WrapAsync.js");
const reviewSchema=require("../reviewschema.js");
const ExpressError=require("../utils/ExpresssError.js");
const {isLoggedIn, Validatereview,isReviewAuthor}=require("../middlewares.js");
const reviewsController=require("../controllers/review.js");


// POST - Create new review
router.post("/",isLoggedIn,Validatereview,WrapAsync(reviewsController.createReview));

// DELETE - Delete review
router.delete("/:review_id",isLoggedIn,isReviewAuthor,WrapAsync(reviewsController.deleteReview));

module.exports=router;
