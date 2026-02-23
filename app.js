if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
};


const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError");
const User = require("./models/user.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRoutes = require("./routes/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// ---------- Connect to Database ----------
mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to Database"))
  .catch(err => console.log("Database connection error:", err));

// ---------- App Setup ----------
const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));



// ---------- Session & Flash ----------
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionOptions));
app.use(flash());

// ---------- Passport ----------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ---------- Flash & Current User Middleware ----------
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.messages = req.flash(); // ✅ Pass all flash messages as messages
  next();
});

// ---------- Routes ----------
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", userRoutes);



// ---------- 404 Handler ----------
// 404 Handler
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});



// ---------- Error Handler ----------
app.use((err, req, res, next) => {
  console.log("ERROR 👉", err);
  const { statusCode = 500 } = err;
  res.status(statusCode).render("error.ejs", { err });
});

// ---------- Start Server ----------
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
