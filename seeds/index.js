const mongoose = require('mongoose')
const Campground = require("../models/Campground")
const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser:true, useUnifiedTopology:true});

const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"));
db.once("open",()=>{
    ("Database connected");
})

const sample = array => array[Math.floor((Math.random())*(array.length))]

const seedDb = async()=>{
    await Campground.deleteMany({})
    for(let i=1;i<350;i++){
        random1000 = Math.floor(Math.random()*1000)
        const price = Math.floor(Math.random()*20 + 10)
        const camp = new Campground({
            author:'62062a76204c8884fe29acc6',
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            geometry:{
                type:"Point",
                coordinates:[
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images : [ { "url" : "https://res.cloudinary.com/dhsz4vpfv/image/upload/v1646647863/yelpcamp/eyzjl83klmimw9ielzfo.jpg",
                         "filename" : "yelpcamp/eyzjl83klmimw9ielzfo"},
                          { "url" : "https://res.cloudinary.com/dhsz4vpfv/image/upload/v1646647858/yelpcamp/h7g98t8jjszmz6tndmxl.jpg",
                           "filename" : "yelpcamp/h7g98t8jjszmz6tndmxl"} ],
            description : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem reiciendis culpa quo provident atque qui, earum velit facere itaque nam, ipsum dicta! Aut perferendis ipsa sapiente, molestias dolorum dolore consectetur.',
            price
        })
        await camp.save()
    }
}
seedDb().then(()=>{
    mongoose.connection.close()
})