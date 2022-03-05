const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/AsyncCatch');
const Campground = require("../models/Campground");
const {isLoggedIn, isAuthor,validateCampground} = require('../middleware')
const campgroundController = require('../controllers/campgrounds')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router.route('/')
    .get(catchAsync(campgroundController.index))
    // .post(validateCampground, catchAsync(campgroundController.createCampground))
    .post(upload.array('image'), (req, res) =>{
        res.send(req.files);
      })
    

router.get('/new',isLoggedIn, campgroundController.renderNewForm)

router.get('/:id/edit',isLoggedIn,catchAsync(campgroundController.renderEditForm))

router.route('/:id')
    .get(catchAsync(campgroundController.showCampground))
    .put(isLoggedIn, isAuthor,validateCampground,catchAsync(campgroundController.editCampground))
    .delete(isLoggedIn, isAuthor,catchAsync(campgroundController.deleteCampground))

module.exports = router