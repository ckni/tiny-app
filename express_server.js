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
  "b2xVn2": ["http://www.lighthouselabs.ca", "123@tinyapp.com"],
  "9sm5xK": ["http://www.google.com", "123@tinyapp.com"]
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

// check if "http://" is missing
function missingProtocol(url) {
  if (url.length > 4) {
    let firstFour = `${url[0]}${url[1]}${url[2]}${url[3]}`;
    return firstFour !== "http";
  } else {
    return true;
  }
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
  const email = req.cookies.email;
  let key = req.query.key;
  if (!email) {
    res.redirect("/login");
  } else if (urlDatabase[key]) {
    if (urlDatabase[key][1] !== email) {
      res.status(401).redirect("/");
    } else if (!key) {
      key = generateRandomString();
      urlDatabase[key] = [req.body.longURL, email];
      res.redirect(`/urls/added/${key}?url=${req.body.longURL}`);
    } else {
      urlDatabase[key] = [req.body.longURL, email];
      res.redirect(`/urls/added/${key}?url=${req.body.longURL}`);
    }
    res.status(401).redirect("/");
  } else {
    if (!key) {
      key = generateRandomString();
    }
    urlDatabase[key] = [req.body.longURL, email];
    res.redirect(`/urls/added/${key}?url=${req.body.longURL}`);
  }
  res.status(401).redirect("/");
});

// success page
app.get("/urls/added/:key", (req, res) => {
  const url = req.query.url;
  const id = req.params.key;
  if (!urlDatabase[id] || urlDatabase[id][0] !== url) {
    res.status(404).redirect("/whatYouTrynaDoLol");
  } else {
    const templateVars = {
      url: url,
      id: id,
      email: "guest"
    };
    if (req.cookies.email) {
      templateVars.email = req.cookies.email;
    }
    res.render("urls_success", templateVars);
  }
});

// TinyLinks page
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
  const id = req.params.id;
  if (urlDatabase[id]) {
    let templateVars = {
      urls: urlDatabase,
      url: id,
      email: "guest"
    };
    if (req.cookies.email) {
      templateVars.email = req.cookies.email;
    }
    res.render("urls_show", templateVars);
  } else {
    res.status(404).redirect("/whyDidYouDoThat");
  }
});

// delete URL page
app.post("/urls/:id/delete", (req, res) => {
  const email = req.cookies.email;
  if (email) {
    if (email === urlDatabase[req.params.id][1]) {
      delete urlDatabase[req.params.id];
      res.redirect("/urls");
    }
    res.status(401).redirect("/whyWouldYouEvenTryThat");
  } else {
    res.status(401).redirect("/whyYouCheekyLittle");
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
    if (missingProtocol(longURL)) {
      longURL = "http://" + longURL;
    }
    res.redirect(longURL);
  } else {
    res.status(404).redirect("/Wut");
  }
});

// custom 404 page
app.get("*", (req, res) => {
  res.render("404");
});

// start listening on port
app.listen(PORT, () => {
  console.log(`TinyApp is now listening on port ${PORT}`);
});
