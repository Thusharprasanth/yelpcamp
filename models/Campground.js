const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Reviews = require('./Reviews')

const CampgroundSchema = new Schema({
    title:String,
    description:String,
    price:Number,
    image:String,
    location:String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Review'
        }
    ]
})

CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Reviews.deleteMany({_id:{$in:doc.reviews}})
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema)