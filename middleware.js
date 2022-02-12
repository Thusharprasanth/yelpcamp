module.exports.isLoggedIn = (req,res,next)=>{
    if (req.isAuthenticated()){
        next()
    }
    else{
        req.session.returnTo = req.originalUrl;
        req.flash('error','you have to login first')
        res.redirect('/login')
    }
}