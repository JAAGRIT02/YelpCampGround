const express = require("express");
const router = express.Router();
const passport = require('passport')

const User = require("../models/user");
const catchAsync = require("../Utils/catchAsync");

//register page
router.get('/register',(req,res)=>{
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;  //destructuring for body
        const user = new User({ email, username });    //making user
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {   //directly login after registering
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
            // console.log(registeredUser);
        })
    } catch (e) {          //if any error occur
        req.flash('error', e.message);
        res.redirect('register');
    }
}));


//login page
router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    //middleware by passport
    req.flash('success', 'welcome back!');
    // console.log(req.session)
    const redirectUrl = req.session.returnTo || '/campgrounds';  //redirecting to the requested url
    delete req.session.returnTo;  //deleting the session after its use
    res.redirect(redirectUrl);
})

//logout 
router.get('/logout', (req, res) => {
    req.logout(function (err) {
    // if (err) { return next(err); }
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
    });
    })

module.exports = router;