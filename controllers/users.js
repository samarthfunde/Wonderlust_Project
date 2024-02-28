// const { model } = require("mongoose");
//we require user
const User = require("../models/user");
 
module.exports.renderSignupForm =  (req, res) =>{
    res.render("users/signup.ejs");
}

// we pickup the following code from routes/users.js for yhr MVC
module.exports.signup = async(req,res)=>{
    try{
        let{username, email, password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    //we pickup following on passportjs.org/concepts/authentication/Login website
    req.login(registeredUser, (err) => {
        if(err) {
            return next(err);
        }    
    req.flash("success", "Welcome to Wondurlust!");
    res.redirect("/listings");
    });
}
catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
}}

//we create login form
module.exports.renderLoginForm=(req,res) =>{
    res.render("users/login.ejs");
}

//we create success fully login after process
module.exports.login =  async(req,res) => {
    req.flash("success", "Welcome back to Wandurlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    // Redirect to the saved redirect URL if exists, otherwise redirect to default URL ("/listings")
    res.redirect(redirectUrl); // Change req.locals to res.locals
  }

  //we create loggout function  
  module.exports.loggout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
}