var express = require("express");
var cookieParser = require('cookie-parser')
var app = express();
app.use(cookieParser())

var PORT = process.env.PORT || 8080;

//allow us to access POST request parameters,
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));


app.set("view engine", "ejs");

var urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};

const users = {
    "userRandomID": {
        id: "userRandomID",
        email: "user@example.com",
        password: "purple-monkey-dinosaur"
    },
    "user2RandomID": {
        id: "user2RandomID",
        email: "user2@example.com",
        password: "dishwasher-funk"
    }
};

//random string generator of 6 numbers and letters
function generateRandomString() {
    var text = "";
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 6; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
}

// Function to verify email
function emailSearch(emailIn) {
    for (id in users) {
        if (users[id].email == emailIn) {
            return true
        }
    }
    return false
}

//route to homepage
app.get("/", (req, res) => {
    console.log(req.cookies);
    let loggedIn = req.cookies["user_id"] != undefined;
    // if not logged in go to register
    // if logged go to index page
    if (loggedIn) {
        let templateVars = {
            urls: urlDatabase,
            id: req.cookies["name"],
            loggedIn: loggedIn,
            user: req.body["user_id"]
        };
        res.render("urls_index", templateVars);
    } else {
        //console.log("did this fucker redirect")
        res.redirect("/register");
    }
});


app.get("/urls/new", (req, res) => {
    res.render("urls_new");
});

//used for making the index page
// app.get("/urls", (req, res) => {
//  let templateVars = {
//   urls: urlDatabase,
//   name: req.cookies["name"]
// };
//  res.render("urls_index", templateVars);
// });

app.get("/urls/:id", (req, res) => {
    //console.log(req.params.id);
    let templateVars = {
        urls: urlDatabase,
        shortURL: req.params.id,
        longURL: urlDatabase[req.params.id]
    };
    //console.log(templateVars);
    res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
    let longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
});

//endpoint for registration
app.get('/register', (req, res) => {
    res.render('register');
});

//after inputting info into registration
app.post("/register", (req, res) => {
    let idRandom = generateRandomString()
    let newUser = {
        id: idRandom,
        email: req.body.email,
        password: req.body.password
    }
    //var users ={}
    //users {}
    //idRandom = 'foo'
    users[idRandom] = newUser;
    //users{
      //idRandom:foo
    //}
    //error registation handling
    if (!newUsers.email) {
        res.sendStatus(400);
    }
    if (!newUsers.password) {
        res.sendStatus(400);
    }
    //responding with a previously used email
    if (newUsers.email == emailSearch(req.body.email)) {
        res.sendStatus(400);
    } else {
        //console.log('idRandom',idRandom);
        //console.log('email',req.body.email);
        //console.log('users', users);


        res.cookie('user_id', newUsers.id);
        res.redirect("/");
    }
});

app.post("/urls", (req, res) => {
    var random = generateRandomString();
    urlDatabase[random] = req.body.longURL;
    var newURL = "/urls/" + random;
    //console.log(req.body.longURL);
    //console.log(urlDatabase[random]);
    res.redirect(newURL);
});

//to delete a website entry
app.post("/urls/:id/delete", (req, res) => {
    //console.log(urlDatabase[req.params.id]);
    delete(urlDatabase[req.params.id]);
    res.redirect("/");
});

//req.params.id contains shortURL
app.post("/urls/:id/update", (req, res) => {
    //console.log(urlDatabase[req.params.id]);
    urlDatabase[req.params.id] = req.body.variable;
    res.redirect("/");
});

//login endpoint add cookie
// app.post("/login",(req, res) => {
// res.cookie('name', req.body.name);
// console.log(req.body.name);
// res.redirect("/");
// });

//logout endpoint delete cookie
// app.post("/logout",(req, res) => {
// res.clearCookie('name', req.body.name);
// //console.log(req.body.name);
// res.redirect("/");
// });

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});
