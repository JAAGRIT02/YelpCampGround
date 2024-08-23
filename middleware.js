//making passport middleware to find that is user logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // console.log(req.path,req.originalUrl)
        req.session.returnTo = req.originalUrl  //store the url they are requesting
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}