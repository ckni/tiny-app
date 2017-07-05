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
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const possible = letters + letters.toUpperCase() + "0123456789";
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

// add/edit link to database
app.post("/urls", (req, res) => {
  let key = req.query.key;
  if (!key) {
    key = generateRandomString();
  }
  urlDatabase[key] = req.body.longURL;
  res.redirect(`/urls/added/${key}?url=${req.body.longURL}`);
});

// success page
app.get("/urls/added/:key", (req, res) => {
  const templateVars = {
    url: req.query.url,
    id: req.params.key,
  };
  res.render("urls_success", templateVars);
});

// database page
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// go to edit URL page
app.get("/urls/:id/edit", (req, res) => {
  let templateVars = { urls: urlDatabase, url: req.params.id };
  res.render("urls_show", templateVars);
});

// delete URL page
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

// database in JSON format
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// redirection
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  let linkVerify = `${longURL[0]}${longURL[1]}${longURL[2]}${longURL[3]}`;
  if (linkVerify !== "http") {
    longURL = "http://" + longURL;
  }
  res.redirect(longURL);
});

// start listening on port
app.listen(PORT, () => {
  console.log(`TinyApp v1.0.0 is now listening on port ${PORT}`);
});
