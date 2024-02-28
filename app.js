//we require dotenv from npmjs.com: dotnev website....and also we use dotenv only one developing time not production time...production mean deployement
if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

// console.log(process.env.SECRET); // remove this after you've confirmed it is working

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

//we installed and require following session
const session = require("express-session");
//we pickup following path from npmjs.con/express-session for the connect mongo
const MongoStore = require('connect-mongo');
//we require our connect-flash after installed on the terminal
const flash = require("connect-flash");
//we require user passport on npmjs.com website 
const passport = require("passport");
//and also we require our local-stratergy
const LocalStrategy = require("passport-local");
//ans also we require user.js
const User = require("./models/user.js");


//Error Handling
const ExpressError = require("./utils/ExpressError.js");

//we require /router/listing.js file
const listingRouter = require("./routes/listing.js");
//we require /router/review.js file
const reviewRouter = require("./routes/review.js");
//router user.js require
const userRouter = require("./routes/user.js");

//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// we access following code from .env code for the connect aws mongodb cloud
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


// we create following session for the connect-mongo to the cloud and also pickup the following code from npmjs.con/express-session
// this is method to create new mongo 
//this is store actual mongodb cloud database
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter: 24 * 3600,//in seconds
})


store.on("error", () => {
 console.log("ERROR in MONGO SESSION STORE", err);
});


//we create sessionoptions
// we write store becoz our mongo store information save also following session
//this is store actual memory storage as well as local storage
const sessionoptions = {
  store,
secret: process.env.SECRET,
resave: false,
saveUninitialized: true,
//we create cookie 
cookie: {
  expires: Date.now() + 7 * 24* 60*60* 1000,
  maxAge : 7 * 24 * 60* 60 *1000,
  httpOnly: true,
}
}

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });





//we use sessionOtions
app.use(session(sessionoptions));
//we use session-flash
app.use(flash());
//when any coming to request we create following middleware
app.use(passport.initialize());
app.use(passport.session());//we go npm.js => passport first of all passport initialize is important and then use session.......
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//we difine flash middleware 

app.use((req, res, next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  //we create locals.variable for navbar sign up, log in, log out locals.variable also use for ejs access lets create
  res.locals.currUser = req.user; 
  next();
})

//we create route demo user for the passport... and check also npmjs.com static methods =>register process reference
//  app.get("/demouser", async(req,res) =>{
//   let fakeUser = new User({
//     email:"Student@gmail.com",
//     username:"delta-student",
//   });

//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
//  });




const validateReview = (req, res, next) =>{
  let {error}  = reviewSchema.validate(req.body);
  
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else{
    next();
  }
};

//we use listing.js only following
app.use("/listings", listingRouter);
//we use review.js only following
app.use("/listings/:id/reviews", reviewRouter);
//we use user.js only following
app.use("/", userRouter);

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

app.all("*", (req, res, next) =>{
  next(new ExpressError(404, "Page Not Found!"));
});

//Error Handling 
app.use((err, req,res, next) => {
  let{statusCode=500, message="something went wrong!"} = err;
  res.status(statusCode).render("error.ejs", {message});
  // res.status(statusCode).send(message);
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${3000}`);
  });


  