const express = require('express');
const jwt = require('jsonwebtoken');

const regd_users = express.Router();

let users = require("./users");

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

        const accessToken = jwt.sign(
            { username },
            "fingerprint_customer",
            { expiresIn: "1h" }
        );

        req.session.authorization = {
            token: accessToken,
            username
        };

        return res.status(200).json({ token: accessToken });
    }

    return res.status(401).json({ message: "Invalid credentials" });
});

// REVIEW (protected)
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const review = req.body.review;

    const token = req.session.authorization?.token;

    if (!token) {
        return res.status(403).json({ message: "Not logged in" });
    }

    let user;
    try {
        user = jwt.verify(token, "fingerprint_customer");
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }

    if (!require("./booksdb.js")[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    let books = require("./booksdb.js");
    books[isbn].reviews[user.username] = review || "";

    return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
    });
});

module.exports = {
    authenticated: regd_users,
    users,
    isValid
};
