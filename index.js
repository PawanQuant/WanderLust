if(process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utills/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


// const { listingSchema , reviewSchema  } = require("./schema.js");
// const wrapAsync = require("./utills/wrapAsync.js");
// const Listing = require("./models/listing.js");
// const Review = require("./models/review.js")

const listingRouter = require("./routes/listings.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

const dbUrl = process.env.ATLASDB_URL;

main()
  .then((res) => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}
// 'mongodb://127.0.0.1:27017/wanderlust'
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
  res.send(
    "hello world from root node <br><br><br><a href='/listings'>All listings</a>",
  );
});

const sessionOptions = {
  secret : "mysupersecretcode",
  resave : false,
  saveUninitialized : true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge :   7 * 24 * 60 * 60 * 1000,
    httpOnly : true 
  },
}; 


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

// app.get("/demouser",async (req,res) => {
//   let User1 = new User({
//     email : "pawan@gmail.com",
//     username : "delta-student"
//   });

//  let registeredUser = await User.register(User1, "helloworld");
//  console.log(registeredUser)
// })


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter)

//agar koi route nhi milega tab
app.all("/*splat", (req, res, next) => {
  next(new ExpressError(404, "page not found !"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "some thing want wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
