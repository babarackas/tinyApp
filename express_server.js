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
    "b2xVn2": {
      longURL: "http://www.lighthouselabs.ca",
      userID: "userRandomID"
    },

    "9sm5xK": {
      longURL: "http://www.google.com",
      userID: "userRandom2"
    }
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

    var cookieKey = 'user_id'

    //random string generator of 6 numbers and letters
    function generateRandomString() {
      var text = "";
      var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < 6; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));
      return text;
    }

    function getUserByEmail(userEmail) {
      let user;
      for (var key in users) {
        user = users[key];
        if (user.email == userEmail) {
          return user;
        }
      }
    }

    // Function to verify email
    function emailExists(emailIn) {
      for (key in users) {
        if (users[key].email == emailIn) {
          return true;
        }
      }
      return false;
    };
    // Function to verify password
    function pwExists(pwIn) {
      for (key in users) {
        if (users[key].password == pwIn) {
          return true;
        }
      }
      return false;
    };


    //route to homepage if logged in --- can use object users
    app.get("/", (req, res) => {
      let userID = req.cookies[cookieKey];
      let user = users[userID];
      // if logged go to index page, if not logged in go to register
      if (user) {
        let templateVars = {
          urls: urlDatabase,
          user: user
        };
        res.render("urls_index", templateVars);
      } else {
        res.redirect("/login");
      }
    });

    app.get("/urls/new", (req, res) => {
      let userID = req.cookies[cookieKey];
      let user = users[userID];
      if (user) {
        let templateVars = {
          urls: urlDatabase,
          user: user
        };
        res.render("urls_new", templateVars);
      } else {
        res.redirect("/login");
      }
    });

    app.get("/urls/:id", (req, res) => {
      let userID = req.cookies[cookieKey];
      let user = users[userID];
      let templateVars = {
        urls: urlDatabase,
        shortURL: req.params.id,
        longURL: urlDatabase[req.params.id],
        urls: urlDatabase,
        user: user
      };
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
      };

      //error registation handling
      //responding with a previously used email
      if (!newUser.email || !newUser.password || emailExists(newUser.email)) {
        console.log("Status code 400");
        res.sendStatus(400);

      } else {
        users[idRandom] = newUser;
        res.cookie(cookieKey, newUser.id);
        res.redirect("/");
        //console.log(newUser.email);
      }
    });

    app.post("/urls", (req, res) => {
      var random = generateRandomString();
      urlDatabase[random] = req.body.longURL;
      var newURL = "/urls/" + random;
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


    app.get("/login", (req, res) => {
      res.render("login", { user: undefined });
    });

    //login endpoint add cookie
    app.post("/login", (req, res) => {
      let userLogin = {
        email: req.body.email,
        password: req.body.password
      };
      //check to see if email or pw is empty send to 400
      if (!userLogin.email || !userLogin.password) {
        console.log("Status code 400");
        res.sendStatus(400);
        return;
      }
      var user = getUserByEmail(userLogin.email);
      //user does not exist in database. direct to regirter
      if (!user) {
        res.redirect("/register");
        return;
      }
      //user with matching email but incorrect password /400 error
      if (userLogin.password != user.password) {
        res.sendStatus(400);
      }
      //user has matching email and password/ redirects to home
      else {
        //login and give cookie
        res.cookie(cookieKey, user.id);
        res.redirect("/");
      }
    });

    //logout endpoint delete cookie
    app.post("/logout", (req, res) => {
      res.clearCookie(cookieKey, req.body.name);
      //console.log(req.body.name);
      res.redirect("/");
    });


    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}!`);
    });
