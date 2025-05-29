const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require ("../middleware.js")


router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})


router.post("/signup", async (req, res, next) => {  // Added `next` for error handling
    try {
        let { username, email, password } = req.body;

        const newUser = new User({ email, username }); 
        const registeredUser = await User.register(newUser, password); 
        
        console.log(registeredUser);
        
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");  // Correct message
            return res.redirect("/listings");  // ✅ Added return
        });

    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup"); // ✅ Added return
    }
});


router.get("/login",async(req,res)=>{
    res.render("users/login.ejs")
});
router.post(
    "/login", saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    async (req, res) => {
        req.flash("success", "Welcome to Wanderlust! You are logged in");
        const redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);

    }
);


router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out")
        res.redirect("/listings")
    })
})
module.exports = router;