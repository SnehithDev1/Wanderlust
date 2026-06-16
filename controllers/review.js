const Listing=require("../models/listing.js");
const Review=require("../models/reviews.js");

module.exports.createReview=async(req,res)=>{
    let {id}=req.params;
    
    let listing=await Listing.findById(id);
    let newReview=new Review(req.body.review)
    
    listing.review.push(newReview);
     newReview.author=req.user._id
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
}

module.exports.deleteReview=async(req,res)=>{
    let {id,review_id}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review:review_id}});
    await Review.findByIdAndDelete(review_id);
    req.flash("success","Review Deleted Successfully!")
    res.redirect(`/listings/${id}`);
}