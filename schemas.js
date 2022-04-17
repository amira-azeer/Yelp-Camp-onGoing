
const joi = require('joi');


// Server side validation
// VALIDATION DONE BEFORE SENDNG THE DATA TO MONGOOSE ELSE MONGOOSE WLL THROW ERRORS

module.exports.campgroundSchema = joi.object({
    campground : joi.object({
        title : joi.string().required(),
        price : joi.number().required().min(0),
        image : joi.string().required(),
        location : joi.string().required(),
        description : joi.string().required(), 
    }).required()
});