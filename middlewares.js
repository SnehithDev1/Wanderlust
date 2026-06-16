  const Listing=require("./models/listing.js");
  const Review=require("./models/reviews.js");
  const listingSchema=require("./schema.js");
  const reviewSchema=require("./reviewschema.js");
const ExpressError=require("./utils/ExpresssError.js");
  const isLoggedIn = async(req,res,next)=>{  
    if(!req.isAuthenticated()){
        req.session.redirecturl=req.originalUrl;
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }
    next();
}

const saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirecturl){
        res.locals.redirecturl=req.session.redirecturl;
    }
    next();
}

const isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    const currUser=req.user;
    if(!listing.owner._id.equals(currUser._id)){
        req.flash("error","You have No access");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

const Validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if (error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
}

const Validatereview=(req,res,next)=>{
    let {error1}=reviewSchema.validate(req.body.review);
    if(error1){
        throw new ExpressError(400,error1);
    }else{
        next();
    }
}


const isReviewAuthor = async(req, res, next) => {
    // 1. FIX: Match the exact parameter name from the route (:review_id)
    let { id, review_id } = req.params; 
    
    let review = await Review.findById(review_id);

    // 2. DEFENSIVE CHECK: Always verify the database actually found something
    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

    // 3. SECURITY FIX: Added 'const' to prevent global variable pollution
    const currUser = req.user;

    // Note: review.author is likely just an ObjectId here, so we compare it directly
    if(!review.author.equals(currUser._id)){
        req.flash("error", "You do not have permission to do that.");
        return res.redirect(`/listings/${id}`);
    }
    
    next();
}


module.exports = {isLoggedIn, saveRedirectUrl,isOwner,Validatelisting,Validatereview,isReviewAuthor};