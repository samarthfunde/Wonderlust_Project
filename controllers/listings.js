
const cloudinary = require('cloudinary').v2; // Import cloudinary//we require following
// pickup following code on require on mapbox geocoding v6 after insatalltion process and also check documentaion of mapbox 
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const Listing = require("../models/listing");



//we create index route following and also pickup the following function from routes listings 
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

// we create for New Route
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

//we create For the Show Route
module.exports.showListing = async (req, res) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate: {
                    path: "author",
                    select: "username" // Only select the username field of the author
                },
            })
            .populate("owner");

        if (!listing) {
            req.flash("error", "Listing you requested does not exist!");
            return res.redirect("/listings");
        }
        res.render("listings/show.ejs", { listing });
    } catch (error) {
        console.error("Error fetching listing:", error);
        req.flash("error", "Failed to fetch listing");
        res.redirect("/listings");
    }
}


// Create New Listing
module.exports.createListing = async (req, res, next) => {

    //we copied this code on mapbox documentation mapbox-sdk
    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();
      

    try {
        const { title, description, price, location, country } = req.body.listing;
        const { path, filename } = req.file; // Get file path and filename from multer
        
        // Upload image to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(path);
        
        // Create new listing with uploaded image data
        const newListing = new Listing({
            title,
            description,
            image: {
                url: cloudinaryResponse.secure_url, // Get secure URL of uploaded image
                filename: filename // Store filename
            },
            price,
            location,
            country,
            owner: req.user._id // Assuming you're using Passport for authentication
        });
        
        //we store value in the geometry database for map data
        newListing.geometry =  response.body.features[0].geometry;
        let savedListing = await newListing.save();
         console.log(savedListing);
        // Log the newly created listing data to the terminal
        console.log("New Listing Created:", newListing);
        
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    } catch (error) {
        console.error("Error creating listing:", error);
        req.flash("error", "Failed to create new listing");
        res.redirect("/listings/new");
    }
}



//we create Edit Route
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }

    //we create for high quality picture doesnot store i the cloudinary cloud that the reason we pick up following code on "https://cloudinary.com/documentation/image_transformations" this link
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

// Update Route
module.exports.updateListing = async (req, res) => {
    try {
        let { id } = req.params;
        
        const { title, description, price, location, country } = req.body.listing;
        let updatedData = { title, description, price, location, country };

        // Rename the variable to avoid conflict with the imported Listing model
        let updatedListing = await Listing.findByIdAndUpdate(id, updatedData);

        // Handle file upload if a new file is provided
        if (req.file) {
            let { path, filename } = req.file;
            const cloudinaryResponse = await cloudinary.uploader.upload(path);
            updatedListing.image = {
                url: cloudinaryResponse.secure_url,
                filename: filename
            };
            await updatedListing.save();
        }

        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error updating listing:", error);
        req.flash("error", "Failed to update listing");
        res.redirect(`/listings/${id}/edit`);
    }
};



//we create Delete route
module.exports.destroyListing = async (req, res) => {
    try {
      let { id } = req.params;
      let listing = await Listing.findById(id);
      
      // Check if the user is authorized to delete the listing
      if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to delete this listing");
        return res.redirect(`/listings/${id}`);
      }
      
      // Delete the listing
      await Listing.findByIdAndDelete(id); // <--- Potential issue here
      
      // Flash success message
      req.flash("success", "Listing Deleted!");
      
      // Redirect to the listings page
      res.redirect("/listings");
    } catch (error) {
      // Handle any errors
      console.error("Error deleting listing:", error);
      req.flash("error", "Listing Deleted!");
      res.redirect("/listings");
    }
  
  }
  
  

  