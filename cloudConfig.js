//we pickup following code from npmjs.com multer-storage-cloudainary  website 
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


//we pass configuraation detailed to backend
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

//we difined storage for the store image data of cloud.............also pickup on npmjs.com multer-storage-cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowerdFormats: ["png", "jpg", "jpeg"],
      
    },
  });

  module.exports = {
    cloudinary,
    storage,
  }