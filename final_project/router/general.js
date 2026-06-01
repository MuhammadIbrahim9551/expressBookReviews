const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;

console.log("🔥 GENERAL.JS LOADED FROM:", __dirname);

const public_users = express.Router();
public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Invalid input" });
    }

    let userExists = users.find(u => u.username === username);

    if (userExists) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });

    return res.status(200).json({
        message: "User successfully registered. Now you can login"
    });
});

// Get all books
public_users.get('/', function (req, res) {

    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(books[isbn]);
});
// Get books by author
public_users.get('/author/:author', function (req, res) {

    const author = req.params.author.toLowerCase();

    let result = Object.values(books).filter(
        book => book.author.toLowerCase() === author
    );

    return res.status(200).json(result);
});

// Get books by title
public_users.get('/title/:title', function (req, res) {

    const title = req.params.title.toLowerCase();

    let result = Object.values(books).filter(
        book => book.title.toLowerCase() === title
    );

    return res.status(200).json(result);
});

// Get reviews
public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
