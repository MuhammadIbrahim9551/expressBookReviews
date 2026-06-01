const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

// IMPORTANT: shared user store (same reference)
let users = require("./auth_users.js").users || [];

// FIX: proper validation
const isValid = (username) => {
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    return users.some(user =>
        user.username === username &&
        user.password === password
    );
};

// LOGIN
regd_users.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Login failed" });
    }

    if (authenticatedUser(username, password)) {

        let accessToken = jwt.sign(
            { username },
            "fingerprint_customer",
            { expiresIn: "1h" }
        );

        req.session.authorization = {
            token: accessToken,
            username: username
        };

        return res.status(200).json({ token: accessToken });
    }

    return res.status(401).json({ message: "Invalid credentials" });
});

// ADD / UPDATE REVIEW
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(403).json({ message: "User not logged in" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
