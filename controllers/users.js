const User = require("../models/user");


module.exports.renderRegister = (req, res) => {
	res.render("users/register");
};

module.exports.register = async (req, res, next) => {
	try {
		const { email, username, password } = req.body; //destructuring for body
		const user = new User({ email, username }); //making user
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, (err) => {
			//directly login after registering
			if (err) return next(err);
			req.flash("success", "Welcome to Yelp Camp!");
			res.redirect("/campgrounds");
			// console.log(registeredUser);
		});
	} catch (e) {
		//if any error occur
		req.flash("error", e.message);
		res.redirect("register");
	}
};

module.exports.renderLogin = (req, res) => {
	res.render("users/login");
};

module.exports.login = (req, res) => {
	//middleware by passport
	req.flash("success", "welcome back!");
	// console.log(req.session)
	const redirectUrl = req.session.returnTo || "/campgrounds"; //redirecting to the requested url
	delete req.session.returnTo; //deleting the session after its use
	res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
	req.logout(function (err) {
		// if (err) { return next(err); }
		req.flash("success", "Goodbye!");
		res.redirect("/campgrounds");
	});
};
