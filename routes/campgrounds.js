const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/AsyncCatch');
const ExpressError = require('../utils/ExpressError');
const Campground = require("../models/Campground");
const { campgroundSchema, reviewSchema } = require('../schemas')
const {isLoggedIn} = require('../middleware')

const validateCampground = (req,res,next)=>{
    const { error } = campgroundSchema.validate(req.body)
    if (error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

router.get('/', catchAsync(async(req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}))

router.post('/',  validateCampground, catchAsync(async(req,res,next)=>{
    const campground = new Campground(req.body.campground)
    await campground.save()
    req.flash('success','Successfully created a Campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/new',isLoggedIn, (req,res)=>{
    res.render('campgrounds/new')
})

router.get('/:id/edit',isLoggedIn, catchAsync(async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', {campground})
}))

router.get('/:id', catchAsync(async(req,res)=>{
    const {id} =  req.params
    const campground = await Campground.findById(id).populate('reviews').populate('author')
    console.log(campground.author);
    if(!campground){
        req.flash('error','Campground not found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
}))

router.put('/:id',isLoggedIn, validateCampground,catchAsync(async (req,res)=>{
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success','Successfully Edited')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id',isLoggedIn, catchAsync(async (req,res)=>{
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully deleted')
    res.redirect(`/campgrounds`)
}))

module.exports = router