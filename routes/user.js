const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

//we require controllers/users.js 
const userController = require("../controllers/users.js");

//we use router.route becoz all same route path collect in one function... read more on npm.js about router.route
//we create Signup routes
router.route("/signup")
.get(userController.renderSignupForm)
//we extract following signup route
.post(
 wrapAsync(userController.signup));

 //we create Login routes
 router.route("/login")
 .get( userController.renderLoginForm)
//login username
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
 userController.login
);


// router.get("/signup",userController.renderSignupForm);

//we extract following signup route
// router.post("/signup",
//  wrapAsync(userController.signup));


//we crete login route
// router.get("/login", userController.renderLoginForm);

//login username
//login username
// router.post("/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//  userController.login
// );



//user.js
 //we create logout route
 router.get("/logout", userController.loggout);


module.exports = router;