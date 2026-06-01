const express = require('express');
const jwt = require('jsonwebtoken');

const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(u => u.username === username);
};

const authenticatedUser = (username, password) => {
    return users.some(u => u.username === username && u.password === password);
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
            username
        };

        return res.json({ token: accessToken });
    }

    return res.status(401).json({ message: "Invalid credentials" });
});

module.exports.authenticated = regd_users;
module.exports.users = users;
module.exports.isValid = isValid;
