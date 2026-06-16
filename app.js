if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const Review=require("./models/reviews.js");
const path=require("path");
const WrapAsync=require("./utils/WrapAsync.js");
const listingSchema=require("./schema.js");
const reviewSchema=require("./schema.js");
const ExpressError=require("./utils/ExpresssError.js");
const methodOverride = require('method-override');
const ejsMate=require("ejs-mate");
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');
const { error } = require("console");
app.engine("ejs", ejsMate);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"public")));
const passport=require("passport");
const isLoggedIn=require("./middlewares.js");
const ATLAS_URL=process.env.MONGO_ATLAS_URL;
const store=MongoStore.create({
    mongoUrl:ATLAS_URL,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
})
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        secure:false,
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000
    },
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// Middleware to make flash messages available to all templates
app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});



async function main() {
    await mongoose.connect(ATLAS_URL);
}
main().then(()=>{
    console.log("Connected to db");
})
.catch((err)=>{
    console.log(err);
});
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.listen(8080,()=>{
    console.log("Listening...");
});

const listings=require("./routes/listings.js");
const reviews=require("./routes/reviews.js");
const { register } = require("module");

const user=require("./routes/user.js");
app.get("/", (req, res) => {
    res.redirect("/listings");
});
app.get("/privacy", (req, res) => {
    res.render("pages/privacy.ejs"); 
});

app.get("/terms", (req, res) => {
    res.render("pages/terms.ejs");
});
app.use("/",user);
app.use("/listings",listings);
app.use("/listings/:id/review",reviews);
app.use("/listings/:id/review",reviews);
app.use((err,req,res,next)=>{
    console.log("Error caught:", err);
    let {status=500,message="Some error occured"}=err;
    res.status(status).render("errors/errors.ejs",{err,status,message});
})
