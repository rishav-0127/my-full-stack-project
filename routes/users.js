const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware");

router.get("/signup", (req, res) => {
res.render("user/signup.ejs");
});
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {

const newUser = new User({ username, email });
 const registeredUser = await User.register(newUser, password);
  
  console.log(registeredUser);
  req.login(registeredUser, (err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "User registered successfully");
    res.redirect("/listings");
  }
  );

  } catch (e) {
  req.flash("error", e.message);
  res.redirect("/signup");
  }
});
// router.post("/signup", async (req, res) => {
//   const { username, email, password } = req.body;

//   // Ensure all required fields are provided
//   if (!username || !email || !password) {
//       req.flash("error", "All fields (username, email, password) are required.");
//       return res.redirect("/signup");
//   }

//   // Create a new user instance
//   const newUser = new User({ username, email });

//   // Register the user using passport-local-mongoose
//   User.register(newUser, password , (err, registeredUser) => {
//       if (err) {
//           req.flash("error", err.message); // Pass error to flash if registration fails
//           return res.redirect("/signup");
//       }

//       req.flash("success", "User registered successfully");
//       console.log(registeredUser); // Log the registered user
//       res.redirect("/listings");
//   });
// });

router.get("/login", (req, res) => {
  res.render("user/login.ejs");

});
router.post("/login", saveRedirectUrl, passport.authenticate("local", {
  failureFlash: true,
  failureRedirect: "/login"
}), async (req, res) => {
  req.flash("success", "Welcome back!");

  // Redirect to the stored redirectUrl, or fallback to the homepage if not set
  const redirectUrl = res.locals.redirectUrl || '/listings'; // Default URL if not set

  res.redirect(redirectUrl);
});

router.get("/logout", (req, res , next) => {
  req.logout((err)=>{
    if (err) {
   next(err);

  }
  req.flash("success", "Logged out successfully");
  res.redirect("/listings");
  })
});


module.exports = router;