
const express = require("express");
const router = express.Router();
//Error Handling
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");

//we require controller listing
const listingController = require("../controllers/listings.js");

//  we require multer also  pickup on npmjs.com :- multer because it is help full for upload the images for backend  and also required upload for the destination store the files
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
//multer uploaded our data in cloudinary storage
const upload = multer({ storage });


// Search route
  router.get('/search', wrapAsync(listingController.searchListings));






// router.route is a process of all routes store n the one function and more information you read on npmjs.com "router.route"
//Index & Create route
router.route("/")
.get( wrapAsync(listingController.index))
 .post( isLoggedIn,
     upload.single("listing[image]"),
     validateListing,
     wrapAsync(listingController.createListing)
     );
//  we require multer also  pickup on npmjs.com :- multer because it is help full for upload the images for backend  and also required upload for the destination store the files ...we put following middleware listing[image ] se jo bhi image aa rahi hai o apne single folder me upload hogi
// .post(upload.single('listing[image]'),(req, res) =>{
//     res.send(req.file);
// })


// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show & Update & delete Route
router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( isLoggedIn,//first check hoga kya o loggedin hai,
isOwner,    // & then kya o user owner hai
upload.single("listing[image]"), //we upload our edit image
validateListing, wrapAsync(listingController.updateListing))
.delete( isLoggedIn,
isOwner,
 wrapAsync(listingController.destroyListing));



// Index Routes
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// router.get("/", wrapAsync(listingController.index));// we put this route above router.route funcion  // we shifted our other part in to the controllers and heres only present callback function we pass index from controllers..listings.js and wrapasync means error handling contineu




// Show Route
 router.get("/:id", wrapAsync(listingController.showListing));

// Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing)); // we put this route above router.route funcion 

// Edit Route
router.get("/:id/edit", isLoggedIn,
isOwner,
 wrapAsync(listingController.renderEditForm));

// // Update Route
router.put("/:id", isLoggedIn,//first check hoga kya o loggedin hai,
isOwner,    // & then kya o user owner hai
validateListing, wrapAsync(listingController.updateListing));


// Delete Route
router.delete("/:id", isLoggedIn,
isOwner,
 wrapAsync(listingController.destroyListing));


//we create following code for the search listing also we pickup backend code from chatgpt

 module.exports = router;


