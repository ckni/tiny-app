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

* Shorten links (users only) - shortened links look like `/u/4klWTG`
* User restrictions - users can register from the `/register` page, log in from the `/login` page, and log out by clicking the `Logout` button
  * Only users can create new links
  * Only the creator of a link can edit or delete it
  * Anyone can use shortened links
* Encrypted cookies and passwords - user ID is encrypted and stored in cookies using [cookie-session](https://www.npmjs.com/package/cookie-session), while passwords are encrypted and stored in the server memory using [bcrypt](https://www.npmjs.com/package/bcrypt)
  * As of the most current version of TinyApp, all URLs and user information are stored in JavaScript objects instead of a database. This means that **every time the server is restarted, all stored information is cleared**
  * In a potential future update, a database or just a JSON file may be used to store information
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

## Getting Started

* Install all dependencies by running `npm install` in command line
* Start the development web server by running `node express_server.js` in command line

### Hi There
Thank you for checking out my project. You may or may not have noticed that the commit for this addition to the README.md file is about 5-6 years newer than everything else. You see, that's because I need to test if I have my SSH keys set up correctly.

I set up 2FA for GitHub, and I [REDACTED] it up and got locked out of my account, so the only form of verification I have left is my SSH keys. I also switched to a new computer, and had not yet set up SSH keys on it. So I've copied over the keys manually from the old to the new computer, and am now testing to check if it works.

I'll be filing a request to recover my GitHub account -- there's an option to upload your most recently used SSH authentication info along with verifying your email address in order to reset the 2FA. But first, testing to see if the SSH keys even work.

Moral of the story, don't accidentally delete your 2FA stuff and lock yourself out of your accounts. It's kind of a hassle :)
