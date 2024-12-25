const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path")


// app.use(cookieParser("secretecode"));



// app.get("/getsignedcookie", (req, res) => {
//     res.cookie("color", "blue", {signed: true});
//     res.send("signed cookie sent");
// })


// app.get("/verify", (req, res) => {
//     res.send(req.signedCookies);
// })



// app.get("/getcookies", (req, res) => {
//     res.cookie("greet", "namaste");
//     res.cookie("origin", "India");
//     res.send("cooki received");
// })

// app.get("/", (req, res) => {
//     // res.cookie("greet", "namaste");
//     // res.cookie("origin", "India");
//     console.dir(req.cookies.origin);
//     res.send("I am root");
// })

const sessionOpts = {
    secret: "mysupersecretestring",
    resave: false,
    saveUninitialized: true              
}

app.use(session(sessionOpts));
app.use(flash());
app.use((req, res, next) => {
    res.locals.msg = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



app.get("/register", (req, res) => {
    let {name = "anonymous"} = req.query;
    req.session.name = name;

    if(name === "anonymous") {
        req.flash("error", "User not registered");
    }
    else {
        req.flash("success", "User registered successfully");
    }

    res.redirect("/hello");
})


app.get("/hello", (req, res) => {
    res.render("page.ejs", {name: req.session.name});
})

// app.get("/reqcount", (req, res) => {
//     if(req.session.count) {
//         req.session.count++;
//     }
//     else {
//         req.session.count = 1;
//     }
                                            
//     res.send(`You sent a request ${req.session.count} times`)
// })                                      

// app.get("/test", (req, res) => {
//    res.send("test successful");
// })

app.listen(3000, () => {
    console.log("app is listing at port 3000");
});

