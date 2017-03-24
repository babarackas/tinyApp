var express = require("express");
var app = express();
app.use(express.static('public'));
var cookieSession = require('cookie-session');

app.use(cookieSession({
  name: 'session',
  keys: ["pass123"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

const bcrypt = require('bcrypt');
const password = "purple-monkey-dinosaur"; // you will probably this from req.params
const hashed_password = bcrypt.hashSync(password, 10);

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


//var cookieKey = 'user_id'

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

// Function to filter URLDatabase for permitted sites
function urlsForUser(id) {
  let filteredURLs = {};
  for (var key in urlDatabase) {
    console.log("current database value",urlDatabase[key].userID);
    console.log("id", id)
    if (urlDatabase[key].userID == id){
      filteredURLs[key] = urlDatabase[key].longURL;
    }
  }
  console.log("function urlsForUser", filteredURLs);
  return filteredURLs;
};


//route to homepage if logged in --- can use object users
app.get("/", (req, res) => {
  let userID = req.session.user_id;
  //console.log("userID", userID);
  let user = users[userID];
  //console.log("user", user);
  let filtered = urlsForUser(userID);
//console.log("filtered by user",filtered);
  // if logged go to index page, if not logged in go to register
  if (user) {
    let templateVars = {
      urls: filtered,
      user_id: req.params.user_id,
      user: user
    };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/new", (req, res) => {
  let userID = req.session.user_id;
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
  let userID = req.session.user_id;
  let user = users[userID];
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: user
  };
  //console.log(urlDatabase[req.params.id].longURL);
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

//endpoint for registration
app.get('/register', (req, res) => {
  res.render('register');
});

//after inputting info into registration
app.post("/register", (req, res) => {

  let formData = {
    email: req.body.email,
    password: req.body.password
  };

  if (!formData.email || !formData.password || emailExists(formData.email)) {
    res.status(400).send("Please enter valid email and password");

  } else {
    let idRandom = generateRandomString();
    let hashedPassword = bcrypt.hashSync(formData.password, 10);
    let newUser = {
      id: idRandom,
      email: formData.email,
      password: hashedPassword
    };
    users[idRandom] = newUser;
    req.session.user_id = newUser.id;
    //res.cookie(cookieKey, newUser.id);
    res.redirect("/");
    //console.log(newUser.email);
  }
});

app.post("/urls", (req, res) => {
  var random = generateRandomString();
  urlDatabase[random] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  }

  var newURL = "/urls/" + random;
  res.redirect(newURL);
});

//to delete a website entry
app.post("/urls/:id/delete", (req, res) => {
  delete(urlDatabase[req.params.id]);
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login", { user: undefined });
});

//login endpoint add cookie
app.post("/login", (req, res) => {
  let loginForm = {
    email: req.body.email,
    password: req.body.password
  };
  //check to see if email or pw is empty send to 400
  if (!loginForm.email || !loginForm.password) {
    res.sendStatus(400);
    return;
  }
  var user = getUserByEmail(loginForm.email);

  if (!user) {
    res.redirect("/register");
    return;
  }
  //user with matching email but incorrect password /400 error
  let passwordsMatch = bcrypt.compareSync(loginForm.password, user.password);
  if (!passwordsMatch) {
    res.sendStatus(400);
  }
  //user has matching email and password/ redirects to home
  else {
    req.session.user_id = user.id;

    //res.cookie(cookieKey, user_id);
    res.redirect("/");
  }
});

//logout endpoint delete cookie
app.post("/logout", (req, res) => {
  req.session.user_id = undefined;
  //res.clearCookie(cookieKey, undefined);
  res.redirect("/");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});