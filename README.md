# TinyApp

TinyApp is a full stack web application built with [Node](https://nodejs.org) and [Express](https://expressjs.com) that allows users to shorten long URLs à la [Bit.ly](https://bit.ly). Save some bytes!

## Final Product
[View all screenshots](https://github.com/kaichesterni/tiny-app/tree/master/screenshots)

### Let's shorten a link
![shorten new link](https://github.com/kaichesterni/tiny-app/raw/master/screenshots/newlink.png)

### Then let's take a look at all of our shortened links
![view all shortened links](https://github.com/kaichesterni/tiny-app/raw/master/screenshots/tinylinks.png)

## Dependencies

* [Node.js](https://nodejs.org)
* [Express](https://expressjs.com)
* [EJS](http://ejs.co/)
* [Bcrypt](https://www.npmjs.com/package/bcrypt)
* [Body-parser](https://www.npmjs.com/package/body-parser-json)
* [Cookie-parser (in original versions)](https://www.npmjs.com/package/cookie-parser)
* [Cookie-session](https://www.npmjs.com/package/cookie-session)

## Features

* Shorten links (users only) - shortened links look like `tinyapp.ca/u/4klWTG`
* User restrictions - users can register from the `tinyapp.ca/register` page, log in from the `tinyapp.ca/login` page, and log out by clicking the `Logout` button
  * Only users can create new links
  * Only the creator of a link can edit or delete it
  * Anyone can use shortened links
* Encrypted cookies and passwords - user ID is encrypted and stored in cookies using [cookie-session](https://www.npmjs.com/package/cookie-session), while passwords are encrypted and stored in the server memory using [bcrypt](https://www.npmjs.com/package/bcrypt)
  * As of the most current version of TinyApp, all URLs and user information are stored in JavaScript objects instead of a database. This means that **every time the server is restarted, all stored information is cleared**
  * There is hardcoded sample user and URL information in `express_server.js` for demonstration. Note that `encrypt(string)` is a function that hashes strings
  
  ```js
  let urlDatabase = {
    "b2xVn2": ["http://www.lighthouselabs.ca", "123@tinyapp.com"],
    "9sm5xK": ["http://www.google.com", "123@tinyapp.com"]
  };
  ```
  ```js
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
  ```
  * In a potential future update, a database or just a JSON file may be used to store information

## Getting Started

* Install all dependencies by running `npm install` in command line
* Start the development web server by running `node express_server.js` in command line
