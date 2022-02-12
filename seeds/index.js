const mongoose = require('mongoose')
const Campground = require("../models/Campground")
const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser:true, useUnifiedTopology:true});

const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("Database connected");
})

const sample = array => array[Math.floor((Math.random())*(array.length))]

const seedDb = async()=>{
    await Campground.deleteMany({})
    for(let i=1;i<50;i++){
        random1000 = Math.floor(Math.random()*1000)
        const price = Math.floor(Math.random()*20 + 10)
        const camp = new Campground({
            author:'62062a76204c8884fe29acc6',
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            image : 'https://source.unsplash.com/collection/483251',
            description : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem reiciendis culpa quo provident atque qui, earum velit facere itaque nam, ipsum dicta! Aut perferendis ipsa sapiente, molestias dolorum dolore consectetur.',
            price
        })
        await camp.save()
    }
}
seedDb().then(()=>{
    mongoose.connection.close()
})