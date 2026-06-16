const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const WrapAsync=require("../utils/WrapAsync.js");
const passport=require("passport");
const localStratergy=require("passport-local");
const User=require("../models/user.js");
const ExpressError=require("../utils/ExpresssError.js");
const {saveRedirectUrl, isLoggedIn}=require("../middlewares.js");


passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.route("/signup")
.get(WrapAsync(async(req,res)=>{
    res.render("signup.ejs");
}))
.post(WrapAsync(async(req,res)=>{
    try{
        let {username, email, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        
        req.login(registeredUser,(err)=>{
            if (err){
                return next(err);
            }
            req.flash("success", "User registered successfully!");
            res.redirect("/listings");
        });
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));


router.route("/login")
.get(WrapAsync(async(req,res)=>{
    res.render("login.ejs");
}))
.post(saveRedirectUrl,passport.authenticate('local', 
    { failureRedirect: '/login', failureFlash: true }), (req,res)=>{
        req.flash("success", "Logged in successfully!");
        const redirectUrl = res.locals.redirecturl || "/listings";
        res.redirect(redirectUrl);
    });

router.get("/logout",WrapAsync(async(req,res,next)=>{
    req.logout((err)=>{
        if (err){
            return next(err);
        }
        req.flash("success","Logged out!");
        res.redirect("/listings");
    });
}))

module.exports = router;