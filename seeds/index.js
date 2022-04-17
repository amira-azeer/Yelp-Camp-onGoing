const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places }  = require('./seedhelpers');
const campground = require("../models/campground");

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    // useNewUrlParser : true,
    // useCreateIndex : true,
    // useUnifiedTopology : true,
}); //yelp-camp is the db name

const db = mongoose.connection; //short form rather than type mongoose.connection etc
db.on('error', console.error.bind(console, "connection error:")); // checking for errors
db.once('open', ()=>{
    console.log('Database Connected');
});

const sample = array=>array[Math.floor(Math.random() * array.length)];

const seedDB = async()=>{
    await campground.deleteMany({});
    for(let i =0; i<50; i++){
        const random1000 = Math.floor(Math.random() * 1000); //floor provides an integer
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new campground({
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis, deleniti odit ex quia quibusdam illum, fugiat praesentium vitae ab cumque eos! Repudiandae vel nihil tempore animi eaque aperiam iure libero.',
            price,  
        })
        await camp.save();
    }
};

seedDB().then(()=>{
    mongoose.connection.close(); //automatically closes the database
})
