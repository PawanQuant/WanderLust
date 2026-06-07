// const express = require("express");
// const app = express();
// const cookieParser = require("cookie-parser");
// // const session = require("express-session");
// // const flash = require("connect-flash");
// const path = require("path")

// // app.set("view engine", "ejs");
// // app.set("views", path.join(__dirname, "views"))


// // const sessionOption = session({
// //      secret : "mysupersecretstring",
// //      resave : false,
// //      saveUninitialized : true
// //     });

// // app.use(sessionOption);
// // app.use(flash());
// app.use(cookieParser("secretcookie"));

// app.get("/", (req,res) => {
//     res.send("<h1> Hello wolrd </h1>")
// })

// // app.get("/test", (req,res) => {
// //     res.send("test successful")
// // })

// // app.get("/reqcount", (req,res) => {
// //     if(req.session.count){
// //         req.session.count++;
// //     }
// //     else{
// //         req.session.count = 1;
// //     }
// //     res.send(`You sent a request ${req.session.count} times`)
// // });

// // app.get("/ragister", (req,res) => {
// //     let {name   = "anonymous"} = req.query;
// //     req.session.name = name;
// //     req.flash("success", "user registration successfully !")
// //     res.redirect("/hello");
// // })

// // app.get("/hello", (req,res) => {
// //     res.render("page.ejs", { name : req.session.name, msg : req.flash("success")} )
// // })
 

// app.get("/getsignedcookie", (req, res) => {
//     res.cookie("made-In", "India", {signed: true});
//     res.send("Signed cookie start")
// });

// app.get("/verify", (req, res) => {
//     console.log(req.signedCookies);
//     res.send("Verified");
// })

// app.get("/", (req, res) => {
//     res.send("Hi, I'm root");
//     console.dir(req.cookies);
// });


// app.get("/getcookies", (req, res) => {
//     //res.cookie(key, value)
//     res.cookie("name", "Deepak");
//     res.cookie("class", "BCA-5th sem");
//     res.cookie("rollno", "24000100134");
//     res.send("sent cookies successfully");
// });

// app.get("/greet", (req, res) => {
//     let { name = "anonyms"} = req.cookies;
//     res.send(`Hi ${name}`)
// })

// app.listen(8080, () => {
//     console.log("Server starting at port 8080");
// })

