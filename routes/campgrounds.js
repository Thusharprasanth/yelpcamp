const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/AsyncCatch');
const Campground = require("../models/Campground");
const {isLoggedIn, isAuthor,validateCampground} = require('../middleware')
const campgroundController = require('../controllers/campgrounds')

router.get('/', catchAsync(campgroundController.index))
router.post('/',  validateCampground, catchAsync(campgroundController.createCampground))
router.get('/new',isLoggedIn, campgroundController.renderNewForm)
router.get('/:id/edit',isLoggedIn,catchAsync(campgroundController.renderEditForm))
router.get('/:id', catchAsync(campgroundController.showCampground))
router.put('/:id',isLoggedIn, isAuthor,validateCampground,catchAsync(campgroundController.editCampground))
router.delete('/:id',isLoggedIn, isAuthor,catchAsync(campgroundController.deleteCampground))

module.exports = router