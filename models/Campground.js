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

const CampgroundSchema = new Schema({
    title: String,
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
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Reviews.deleteMany({ _id: { $in: doc.reviews } })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema)