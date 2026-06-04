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

const listings = require("./routes/listings.js")

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



const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


app.use("/listings", listings);

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


//Reviews
//Post Rout
app.post("/listings/:id/reviews",validateReview, wrapAsync( async (req,res) => {
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);
   listing.reviews.push(newReview);
   await newReview.save()
   await listing.save();
  res.redirect(`/listings/${listing._id}`);

}))

//delete review route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync( async (req,res) => {
  let { id , reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId}})
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
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
