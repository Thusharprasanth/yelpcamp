const { string } = require("joi")
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Reviews = require('./Reviews')
const Users = require('./user')

const imageSchema = new Schema({
    url:String,
    filename:String
})
imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})

const opts = {toJSON:{virtuals:true}}

const CampgroundSchema = new Schema({
    title: String,
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    description: String,
    price: Number,
    images: [imageSchema],
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},opts)
CampgroundSchema.virtual('properties.popupText').get(function(){
    return `<a href="campgrounds/${this._id}">${this.title}</a>`
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Reviews.deleteMany({ _id: { $in: doc.reviews } })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema)