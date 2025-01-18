require('dotenv').config();



const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore= require('connect-mongo')
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/users.js");
const app = express();
const port = 8080;


// Connect to MongoDB
const uri = process.env.ATLASDB_URL;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB:', err));
// Set up view engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Session and Flash Config
const store= MongoStore.create({
    mongoUrl: uri,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})
store.on("error",()=>{
    console.log("Your store has some error");

})

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};


app.use(session(sessionOptions));
app.use(flash());

// Passport Config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
   res.locals.currentUser = req.user;
    next();
});

// // Demo user registration route
// app.get("/demouser", async (req, res) => {
//     const fakeUser = new User({ username: "demo", email: "student@gmail.com" });
//     try {
//         const newUser = await User.register(fakeUser, "demo"); // Register user with password 'demo'
//         res.send(newUser);
//     } catch (error) {
//         res.send(error);
//     }
// });

// Logging Middleware
app.use((req, res, next) => {
    console.log(`Handling request for ${req.method} ${req.originalUrl}`);
    next();
});

// // Routes
// app.get("/", (req, res) => {
//     res.send("Welcome to Wanderlust!");
// });

app.use("/listings/:id/reviews", reviewsRouter);
app.use("/listings", listingsRouter);
app.use("/", userRouter);
// 404 Handler
app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404));
});

// Error Handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error", { message });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
