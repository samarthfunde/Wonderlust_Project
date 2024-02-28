
//we pickup the schema.js from "joi.dev" from chrome for server side schema validation//

const Joi = require('joi');
module.exports. listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country: Joi.string().required(),
        //price should be minimum 0 not negative value
        price: Joi.number().required().min(0),
        // image could empty or null also not necessary required word
        image: Joi.string().allow("", null)
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
})