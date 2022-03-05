const express = require('express')
const router = express.Router({mergeParams:true})
const catchAsync = require('../utils/AsyncCatch');
const Review = require("../models/Reviews");
const Campground = require("../models/Campground");
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')
const reviewController = require('../controllers/review')

router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.newReview))

router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview))

module.exports = router