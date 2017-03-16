var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

//allow us to access POST request parameters,
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//random string generator of 6 numbers and letters
function generateRandomString() {
  var text = "";
  var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 6; i++ )
      text += charset.charAt(Math.floor(Math.random() * charset.length));
      return text;
    }

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
//used for making the index page
app.get("/urls", (req, res) => {
 let templateVars = { urls: urlDatabase };
 res.render("urls_index", templateVars);
});

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


app.post("/urls", (req, res) => {
var random = generateRandomString();
 urlDatabase[random] = req.body.longURL;
 var newURL = "/urls/" + random;
 console.log(req.body.longURL);
 console.log(urlDatabase[random]);
 res.redirect(newURL);
});

//to delete an entry
app.post("/urls/:id/delete",(req, res) => {
  console.log(urlDatabase[req.params.id]);
delete(urlDatabase[req.params.id]);
res.redirect("/urls");
});

//req.params.id contains shortURL
app.post("/urls/:id/update",(req, res) => {
  //console.log(urlDatabase[req.params.id]);
urlDatabase[req.params.id] = req.body.variable;
res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});