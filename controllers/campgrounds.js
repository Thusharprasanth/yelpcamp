const Campground = require('../models/Campground')
const cloudinary = require('cloudinary').v2;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAP_TOKEN
const geoCoder = mbxGeocoding({accessToken:mapBoxToken})


module.exports.index = async(req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}

module.exports.createCampground = async(req,res,next)=>{
    const geoData = await geoCoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    res.send(geoData.body.features[0].geometry.coordinates)
    // const campground = new Campground(req.body.campground)
    // campground.images = req.files.map(f=>({url:f.path,filename:f.filename}))
    // campground.author = req.user._id
    // await campground.save()
    // console.log(campground)
    // req.flash('success','Successfully created a Campground')
    // res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.renderNewForm =  (req,res)=>{
    res.render('campgrounds/new')
}

module.exports.renderEditForm = async(req,res)=>{
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', {campground})
}
module.exports.editCampground = async (req,res)=>{
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    const imgs = req.files.map(f=>({url:f.path,filename:f.filename}))
    campground.images.push(...imgs)
    await campground.save()
    if(req.body.deleteImages){
        for(filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    req.flash('success','Successfully Edited')
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.deleteCampground = async (req,res)=>{
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully deleted')
    res.redirect(`/campgrounds`)
}
module.exports.showCampground = async(req,res)=>{
    const {id} =  req.params
    const campground = await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    })
    .populate('author')
    // console.log(campground);
    if(!campground){
        req.flash('error','Campground not found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
}