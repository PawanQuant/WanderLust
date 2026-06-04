const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utills/ExpressError.js");


const listings = require("./routes/listings.js")
const reviews = require("./routes/review.js")

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






app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews)

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
