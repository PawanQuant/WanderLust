const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js")
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utills/wrapAsync.js");
const ExpressError = require("./utills/ExpressError.js");
const { listingSchema , reviewSchema  } = require("./schema.js");


main()
  .then((res) => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

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

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
// app.get("/listing", async(req,res) => {

//     let samplelisting = new Listing({
//         title : "Mathematics",
//         description : "Written by RD sharma",
//         price : 2000,
//         location : "pune",
//         country : "India"
//     });
//     await samplelisting.save()
//     console.log("sample is saved");
//     res.send("Succefull testing")
// })

//index route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    // res.send("working")
    let alllistings = await Listing.find({});
    res.render("./listings/index.ejs", { alllistings });
  }),
);

//new route
app.get("/listings/new", (req, res) => {
  res.render("./listings/new.ejs");
});

//show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/show.ejs", { listing });
  }),
);

//create route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  }),
);

//edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
  }),
);

//update route
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  }),
);

//delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);

//post route
app.post("/listings/:id/reviews", validateReview, wrapAsync ( async (req,res) => {
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.Review);
   listing.reviews.push(newReview);
   await newReview.save()
   await listing.save();

   res.redirect(`listings/${listing._id}`);
}))

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
