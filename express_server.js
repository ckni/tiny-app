/* jshint esversion: 6 */

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// hardcoded sample database
let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// generate a key
function generateRandomString() {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let string = "";

  for (let i = 0; i < 6; i ++) {
    string += possible[Math.floor(Math.random() * possible.length)];
  }

  if (urlDatabase[string]) {
    string = generateRandomString();
  } else {
    return string;
  }
}

// new URL page
app.get("/", (req, res) => {
  res.render("urls_new");
});

// add new link to database
app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  let linkVerify = `${longURL[0]}${longURL[1]}${longURL[2]}${longURL[3]}`;
  if (linkVerify !== "http") {
    res.send("Invalid URL. Your URL must begin with http:// or https://");
  } else {
    urlDatabase[generateRandomString()] = longURL;
    res.send("Your URL has successfully been added to our database!");
  }
});

// index page
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// database in JSON format
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// redirection
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// start listening on port
app.listen(PORT, () => {
  console.log("TinyApp v1.0.0 alpha");
  console.log(`TinyApp is now listening on port ${PORT}`);
});
