/* jshint esversion: 6 */

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ["-412m463dd0N-"],
  maxAge: 24 * 60 * 60 * 1000
}));

// hardcoded sample URL database
let urlDatabase = {
  "b2xVn2": ["http://www.lighthouselabs.ca", "123@tinyapp.com"],
  "9sm5xK": ["http://www.google.com", "123@tinyapp.com"]
};

// encrypt string
function encrypt(string) {
  return bcrypt.hashSync(string, 10);
}

// hardcoded sample user database
let usrDatabase = {
  "123@tinyapp.com": {
    email: "123@tinyapp.com",
    password: encrypt("123")
  },
  "234@tinyapp.com": {
    email: "234@tinyapp.com",
    password: encrypt("234")
  }
};

// generate a short URL
function generateURL() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const possible = letters + letters.toUpperCase() + "0123456789";
  let string = "";

  for (let i = 0; i < 6; i ++) {
    string += possible[Math.floor(Math.random() * possible.length)];
  }

  // check if URL already exists
  if (urlDatabase[string]) {
    string = generateURL();
  } else {
    return string;
  }
}

// check if logged in
function login(req) {
  if (req.session.email) {
    return req.session.email;
  }
  return "guest";
}

// check if "http://" is missing
function hasHTTP(URL) {
  if (URL.length > 4) {
    return `${URL[0]}${URL[1]}${URL[2]}${URL[3]}` === "http";
  }
  return false;
}

// home page
app.get("/", (req, res) => {
  if (login(req) === "guest") {
    res.redirect("/login");
  } else {
    res.redirect("/urls/new");
  }
});

// new link page
app.get("/urls/new", (req, res) => {
  const email = login(req);
  if (email === "guest") {
    res.redirect("/login");
  } else {
    const templateVars = { email: email };
    res.render("urls_new", templateVars);
  }
});

// login page
app.get("/login", (req, res) => {
  if (login(req) !== "guest") {
    res.redirect("/urls");
  } else {
    res.render("login");
  }
});

// login endpoint
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (usrDatabase[email]) {
    bcrypt.compare(password, usrDatabase[email].password, (err, match) => {
      if (match) {
        req.session.email = email;
      }
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});

// logout endpoint
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// register page
app.get("/register", (req, res) => {
  if (login(req) !== "guest") {
    res.redirect("/urls");
  } else {
    res.render("register");
  }
});

// register endpoint
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email == "" || password == "") {
    res.status(400).redirect("/error?code=400&message=empty_email_or_password_field");
  }

  if (!usrDatabase[email]) {
    usrDatabase[email] = {
      email: email,
      password: encrypt(password)
    };
    req.session.email = email;
    res.redirect("/");
  } else {
    res.status(400).redirect("/error?code=400&message=email_already_registered");
  }
});

// add/edit link to database
app.post("/urls", (req, res) => {
  const email = login(req);
  let key = req.query.key;
  if (!key) {
    key = generateURL();
  }

  function store() {
    urlDatabase[key] = [req.body.longURL, email];
    res.redirect("/urls/" + key);
  }

  if (urlDatabase[key]) {
    if (urlDatabase[key][1] !== email) {
      res.status(401).redirect("/error?code=401&message=you_are_not_allowed_to_do_that");
    } else {
      store();
    }
  } else if (email === "guest") {
    res.redirect("/login");
  } else {
    store();
  }
});

// view link page
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  if (urlDatabase[id]) {
    const templateVars = {
      url: urlDatabase[id][0],
      id: id,
      email: login(req)
    };
    res.render("urls_view", templateVars);
  } else {
    res.status(404).redirect("/we_could_not_find_that");
  }
});

// TinyLinks page
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    email: login(req)
  };
  res.render("urls_index", templateVars);
});

// go to edit URL page
app.get("/urls/:id/edit", (req, res) => {
  const id = req.params.id;
  if (urlDatabase[id]) {
    let templateVars = {
      urls: urlDatabase,
      url: id,
      email: login(req)
    };
    res.render("urls_show", templateVars);
  } else {
    res.status(401).redirect("/error?code=401&message=you_are_not_allowed_to_do_that");
  }
});

// delete URL page
app.post("/urls/:id/delete", (req, res) => {
  const email = login(req);
  if (email === urlDatabase[req.params.id][1]) {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  } else {
    res.status(401).redirect("/error?code=401&message=you_are_not_allowed_to_do_that");
  }
});

// database in JSON format
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// redirection
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL][0];
  if (longURL) {
    if (!hasHTTP(longURL)) {
      longURL = "http://" + longURL;
    }
    res.redirect(longURL);
  } else {
    res.status(404).redirect("/that_does_not_exist");
  }
});

// custom error page
app.get("/error", (req, res) => {
  const templateVars = {
    message: req.query.message.split("_").join(" "),
    code: req.query.code
  };
  res.render("error", templateVars);
});

// custom 404 page
app.get("*", (req, res) => {
  res.render("404");
});

// start listening on port
app.listen(PORT, () => {
  console.log(`TinyApp is now listening on port ${PORT}`);
});
