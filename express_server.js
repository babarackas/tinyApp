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
//random string generator
function generateRandomString() {
  var text = " ";
  var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 6; i++ )
      text += charset.charAt(Math.floor(Math.random() * charset.length));
      return text;
    }

var random = generateRandomString();

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  //let longURL need to use this later
  //console.log(req.params.id);
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});


// app.get("/", (req, res) => {
//   console.log(urlDatabase);
//   var test = "HELLO PIP";
//   res.render("urls_index", {
//     testing: urlDatabase
//   });
// });

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});