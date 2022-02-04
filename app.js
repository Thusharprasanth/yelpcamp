const express = require("express");
const mongoose = require('mongoose');
const Campground = require("./models/Campground");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Joi = require('joi')
const { campgroundSchema, reviewSchema } = require('./schemas')
const catchAsync = require('./utils/AsyncCatch');
const ExpressError = require('./utils/ExpressError');
const Review = require("./models/Reviews");

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser:true, useUnifiedTopology:true});

const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("Database connected");
})

const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)

const validateCampground = (req,res,next)=>{
    const { error } = campgroundSchema.validate(req.body)
    if (error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

const validateReview = (req,res,next)=>{
    const { error } = reviewSchema.validate(req.body)
    if (error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}


app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/campgrounds', catchAsync(async(req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}))

app.post('/campgrounds',  validateCampground, catchAsync(async(req,res,next)=>{
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.get('/campgrounds/new', (req,res)=>{
    res.render('campgrounds/new')
})

app.get('/campgrounds/:id/edit', catchAsync(async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', {campground})
}))

app.get('/campgrounds/:id', catchAsync(async(req,res)=>{
    const {id} =  req.params
    const campground = await Campground.findById(id).populate('reviews')
    res.render('campgrounds/show', {campground})
}))

app.put('/campgrounds/:id', validateCampground,catchAsync(async (req,res)=>{
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req,res)=>{
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect(`/campgrounds`)
}))

app.post('/campgrounds/:id/review', validateReview,catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id/review/:reviewId', catchAsync(async(req,res)=>{
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
}))

app.all('*', (req,res,next)=>{
    next(new ExpressError('Page not found',404))
})

app.use((err,req,res,next)=>{
    const { statusCode=500, message = 'Something went wrong' } = err
    res.status(statusCode).render('err', { err })
})

app.listen(3000, ()=>{
    console.log('Listening port 3000...');
})