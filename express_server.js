/* jshint esversion: 6 */

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// hardcoded sample url database
let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// hardcoded sample user database
let usrDatabase = {
  "123@tinyapp.com": {
    email: "123@tinyapp.com"
  },
  "234@tinyapp.com": {
    email: "234@tinyapp.com"
  }
};

encrypt("123", "123@tinyapp.com");
encrypt("234", "234@tinyapp.com");

// generate a key or ID
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

// encrypt and store password
function encrypt(password, email) {
  usrDatabase[email].password = bcrypt.hashSync(password, 10);
}

// new URL page
app.get("/", (req, res) => {
  const templateVars = { email: "guest" };
  if (req.cookies.email) {
    templateVars.email = req.cookies.email;
  }
  res.render("urls_new", templateVars);
});

// login page
app.get("/login", (req, res) => {
  res.render("login");
});

// login endpoint
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (usrDatabase[email]) {
    bcrypt.compare(password, usrDatabase[email].password, (err, match) => {
      if (match) {
        res.cookie("email", email);
      }
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});

// logout endpoint
app.post("/logout", (req, res) => {
  res.clearCookie("email");
  res.redirect("/");
});

// register page
app.get("/register", (req, res) => {
  res.render("register");
});

// register endpoint
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email == "" || password == "") {
    res.status(400).send("Empty email or password");
  }
  if (!usrDatabase[email]) {
    usrDatabase[email] = {
      email: email
    };
    encrypt(password, email);
    console.log(usrDatabase);
    res.cookie("email", email);
    res.redirect("/");
  } else {
    res.status(400).send("Email already registered");
  }
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
    email: "guest"
  };
  if (req.cookies.email) {
    templateVars.email = req.cookies.email;
  }
  res.render("urls_success", templateVars);
});

// database page
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    email: "guest"
  };
  if (req.cookies.email) {
    templateVars.email = req.cookies.email;
  }
  res.render("urls_index", templateVars);
});

// go to edit URL page
app.get("/urls/:id/edit", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    url: req.params.id,
    email: "guest"
  };
  if (req.cookies.email) {
    templateVars.email = req.cookies.email;
  }
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
  let linkVerify = `${longURL[0]}${longURL[1]}${longURL[2]}${longURL[3]}`;
  if (linkVerify !== "http") {
    longURL = "http://" + longURL;
  }
  res.redirect(longURL);
});

// start listening on port
app.listen(PORT, () => {
  console.log(`TinyApp is now listening on port ${PORT}`);
});
