if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require("express");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const campgroundsRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews')
const userRoutes = require('./routes/user')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStratergy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const MongoDBStore = require('connect-mongo')(session)


// 'mongodb://localhost:27017/yelp-camp'
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

app.use(methodOverride('_method'))
app.use(express.static('public'))
// app.use(mongoSanitize());
// app.use(helmet({ contentSecurityPolicy : false }))
const SECRET = process.env.SECRET || 'thisshouldbeabettersecret'
const store = new MongoDBStore({
    url:DB_URL,
    secret: SECRET,
    touchAfter:24*60*60

})
store.on("error",(e)=>{
    console.log("Session store error",e);
})

const sessionConfig = {
    store,
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStratergy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.engine('ejs', ejsMate)

// app.get('/',(req,res)=>{
//     res.render('home')
// })

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


app.use('/', userRoutes)
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/review', reviewsRoutes)
app.get('', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err
    res.status(statusCode).render('err', { err })
})

app.listen(3000, () => {
    console.log('Listening port 3000...');
})