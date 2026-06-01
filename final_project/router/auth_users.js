const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    let validusers = users.filter((user) => {
        return user.username === username;
    });

    return validusers.length > 0;
}

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return user.username === username &&
               user.password === password;
    });

    return validusers.length > 0;
}

regd_users.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({
            message: "Error logging in"
        });
    }

    if (authenticatedUser(username, password)) {

        let accessToken = jwt.sign(
            { data: password },
            "access",
            { expiresIn: 60 * 60 }
        );

        req.session.authorization = {
            accessToken,
            username
        };

        return res.status(200).send("User successfully logged in");
    }

    return res.status(208).json({
        message: "Invalid Login. Check username and password"
    });
});

regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    const review = req.query.review;

    const username = req.session.authorization.username;

    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
