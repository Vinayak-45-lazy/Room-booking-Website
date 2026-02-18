const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controllers/user.js");
const { saveRedirectUrl } = require("../middleware.js"); // ← FIX PATH


router.get("/signup", userController.renderSignupForm);
router.post("/signup", userController.signup);

router.get("/login", userController.renderLoginForm);

router.post("/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  userController.login
);

router.get("/logout", userController.logout);

module.exports = router;
