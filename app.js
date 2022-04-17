const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const campground = require("./models/campground");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema } = require('./schemas');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
}); //yelp-camp is the db name

const db = mongoose.connection; //short form rather than type mongoose.connection etc
db.on('error', console.error.bind(console, "connection error:")); // checking for errors
db.once('open', ()=>{
    console.log('Database Connected');
});

const app = express();
app.use(methodOverride('_method'));


const validateCampground = (request, response, next)=>{
    //passing data through to the mongoose schema
    const {error} = campgroundSchema.validate(request.body); // calling the campground schema 
    if(error){
        const message = error.details.map(element => element.message).join(',') //an array mapped over to a single string message
        throw new ExpressError(message, 400);
    } else{
        next();
    }
};

app.engine('ejs', ejsMate); //using ejs as ejs mate 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true})); //parses the url request body 

app.get("/", (require, response)=>{
    response.render('home');
});

app.get("/campgrounds", catchAsync(async(require, response)=>{
    const campgrounds = await campground.find({}); // finding all available campgrounds
    response.render('campgrounds/index', {campgrounds}); // passing campgrounds into the respective page
}));

app.get('/campgrounds/new', (request, response)=>{
    response.render('campgrounds/new');
});

app.post('/campgrounds', validateCampground, catchAsync(async(request, response, next)=>{
    const campgrounds = new campground (request.body.campground);
    await campgrounds.save(); // saving the new campground added via the form before redirecting the user
    response.redirect(`/campgrounds/${campgrounds._id}`);
}));

app.get("/campgrounds/:id", catchAsync(async(request, response)=>{
    const campgrounds = await campground.findById(request.params.id);
    response.render('campgrounds/show', {campgrounds});
}));

app.get('/campgrounds/:id/edit', catchAsync(async(request,response)=>{
    const campgrounds = await campground.findById(request.params.id);
    response.render('campgrounds/edit', {campgrounds});
}));

app.put('/campgrounds/:id', validateCampground, catchAsync(async(request, response)=>{
    const {id} = request.params;
    const campgrounds = await campground.findByIdAndUpdate(id, {...request.body.campground});
    response.redirect(`/campgrounds/${campgrounds._id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async(request, response)=>{
    const { id } = request.params;
    await campground.findByIdAndDelete(id);
    response.redirect('/campgrounds');
}));

app.all('*', (request, response, next)=>{
    // all indicates for ever request 
    // * indicates for every type of request (GET PUT PATCH etc)
    next(new ExpressError("Page not found", 404));
})

app.use((error, request, response, next)=>{
    const {statusCode = 500, message="Something went wrong!"} = error;
    if(!error.message){
        error.message="Oh no something went wrong";
    }
    response.status(statusCode).render('campgrounds/error', {error});
});

app.listen(3000, ()=>{
    console.log('Listening on port 3000')
});
