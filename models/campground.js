const mongoose = require('mongoose');
const Schema = mongoose.Schema; //short form for requiring schema

const CampGroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});

module.exports = mongoose.model('CampGround', CampGroundSchema); // compiling the model 

