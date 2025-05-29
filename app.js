 const express = require("express");
 const app = express();
 const mongoose = require("mongoose");
 const path = require("path");
 const methodOverride = require("method-override");
 const ejsMate= require("ejs-mate");
 const ExpressError = require("./utils/ExpressError.js");


 const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")


const session = require('express-session');
const flash = require("connect-flash");
//password k liye
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js");






 const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then (()=>{
    console.log("connect to db");
}) . catch((err)=>{
    console.log(err)
})

 async function main() {
    await mongoose.connect(MONGO_URL);
 }


 app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
  secret: "mysupersecretcode", 
  resave: false,
  saveUninitialized: true,
  cookie:{
    expire: Date.now() + 7  *24*60*60*100,
    maxAge:7*24*60*60*100,
    httpOnly:true
  },
};


app.get("/",(req ,res)=>{
  res.send("hi , i am anupam")
})


app.use(session(sessionOptions));
app.use(flash());

// basic setting h password k liye
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//  const validateListing = (req,res,next)=>{
//   let {error} =reviewSchema.validate(req.body);
//   if(error){
//     let errMsg = error.details.map((el)=> el.message).join(",");
//     throw new ExpressError(400,errMsg);
//   }
//   else{
//     next();
//   }
//   };

//   const validateReview = (req,res,next)=>{
//     let {error} =listingSchema.validate(req.body);
//     if(error){
//       let errMsg = error.details.map((el)=> el.message).join(",");
//       throw new ExpressError(400,errMsg);
//     }
//     else{
//       next();
//     }
//     };










//Edit Route
// app.get("/listings/:id/edit",  wrapAsync( async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id);
//   //  console.log("Listing Data:", listing)
//   res.render("listings/edit.ejs", { listing });
// }));




// Update Route
// app.put("/listings/:id", 
//   validateListing,
//    wrapAsync (async (req, res) => {
//   let { id } = req.params;
//   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//   res.redirect(`/listings/${id}`);
// }));/


app.use(( req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error= req.flash("error");
  res.locals.currUser= req.user;

  next();
})

app.get("/demouser" , async(req,res)=>{
  let fakeUser = new User({
    email:"khem@gmail.com",
    username:"khem@123",
  });
  let rigesteruser = await User.register(fakeUser,"helloword");
  res.send(rigesteruser);
})
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter)



















//  app.get("/testlisting", async(req,res)=>{
//     let samplelisting = new Listing({
//         title :"my new house",
//         description :"by a beach",
//         price : 30000,
//         location :"bakewar",
//         country : " india"
//     })
//     await samplelisting.save();
//     console.log ("sample was save");
//     res.send("success");
//  })


app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found!"))
})
app.use((err,req,res,next)=>{
  let{statusCode = 500,message = "something went wrong"} = err;
  res.status(statusCode).render("error.ejs",{message})
    // res.status(statusCode).send(message);
})

 app.listen(8080,()=>{
   console.log("server is listen on port 8080")

 })