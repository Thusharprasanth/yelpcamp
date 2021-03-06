const User = require('../models/user')

module.exports.renderRegisterForm = (req,res)=>{
    res.render('users/register')
}
module.exports.Register = async (req,res,next)=>{
    try{
    const {email, username, password} = req.body
    const user = new User({email, username})
    const registeredUser = await User.register(user, password)
    req.login(registeredUser,err=>{
        if(err) return next(err)
        req.flash('success','Welcome to yelpcamp')
        res.redirect('/campgrounds')
    })
    }catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }

}
module.exports.renderLoginForm = (req,res)=>{
    res.render('users/login')
}
module.exports.Login = (req,res)=>{
    req.flash('success', 'welcome back')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    res.redirect(redirectUrl)
}
module.exports.Logout = (req,res)=>{
    req.logout()
    req.flash('success','Logged Out')
    res.redirect('/campgrounds')
}