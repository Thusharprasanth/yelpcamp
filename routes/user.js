const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/AsyncCatch')
const userController = require('../controllers/users')


router.get('/register', userController.renderRegisterForm)
router.post('/register', catchAsync(userController.Register))
router.get('/login', userController.renderLoginForm)
router.post('/login', passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),userController.Login)
router.get('/logout', userController.Logout)

module.exports = router