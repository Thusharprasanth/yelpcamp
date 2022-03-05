const { campgroundSchema } = require('./schemas')
const { reviewSchema } = require('./schemas')
const Campground  = require('./models/Campground')
const Review  = require('./models/Reviews')
const ExpressError = require('./utils/ExpressError')

module.exports.isLoggedIn = (req,res,next)=>{
    if (req.isAuthenticated()){
        next()
    }
    else{
        req.session.returnTo = req.originalUrl;
        req.flash('error','you have to login first')
        res.redirect('/login')
    }
}
module.exports.validateCampground = (req,res,next)=>{
    const { error } = campgroundSchema.validate(req.body)
    if (error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}
module.exports.isAuthor = async(req,res,next)=>{
    const { id } = req.params
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You dont have permission for this')
        return res.redirect('/campgrounds')
    }
    next()
}
module.exports.validateReview = (req,res,next)=>{
    const { error } = reviewSchema.validate(req.body)
    if (error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}
module.exports.isReviewAuthor = async(req,res,next)=>{
    // console.log(id);
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash('error','You dont have permission for this')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}