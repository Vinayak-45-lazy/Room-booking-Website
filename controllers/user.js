const User = require("../models/user");


module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};


module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = new User({ username, email });

    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Welcome to Hotel Reviews!");
      res.redirect("/listings");
    });

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};


module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back!");
  res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have logged out!");
    res.redirect("/listings");
  })};


  