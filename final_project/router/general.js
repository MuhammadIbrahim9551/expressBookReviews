const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {

        if (!isValid(username)) {

            users.push({
                username: username,
                password: password
            });

            return res.status(200).json({
                message: "User successfully registered. Now you can login"
            });
        }

        return res.status(404).json({
            message: "User already exists!"
        });
    }

    return res.status(404).json({
        message: "Unable to register user."
    });
});

// Get all books
public_users.get('/', function (req, res) {

    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    return res.status(200).json(books[isbn]);
});

// Get books by author
public_users.get('/author/:author', function (req, res) {

    const author = req.params.author;

    let filteredBooks = Object.entries(books).filter(
        ([isbn, book]) => book.author === author
    );

    return res.status(200).json(filteredBooks);
});

// Get books by title
public_users.get('/title/:title', function (req, res) {

    const title = req.params.title;

    let filteredBooks = Object.entries(books).filter(
        ([isbn, book]) => book.title === title
    );

    return res.status(200).json(filteredBooks);
});

// Get reviews
public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    return res.status(200).json(
        books[isbn].reviews
    );
});

module.exports.general = public_users;
