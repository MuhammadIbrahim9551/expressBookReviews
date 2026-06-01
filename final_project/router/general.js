console.log("🔥 GENERAL.JS LOADED");

const express = require('express');
let books = require("./booksdb.js");
let usersModule = require("./auth_users.js");

let users = usersModule.users;

const public_users = express.Router();

// REGISTER
public_users.post("/register", (req, res) => {

    const { username, password } = req.body;

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

// GET ALL BOOKS
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});

// GET BY ISBN
public_users.get('/isbn/:isbn', (req, res) => {

    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(books[isbn]);
});

// GET BY AUTHOR
public_users.get('/author/:author', (req, res) => {

    const author = req.params.author.toLowerCase();

    const result = Object.values(books).filter(
        book => book.author.toLowerCase() === author
    );

    return res.status(200).json(result);
});

// GET BY TITLE
public_users.get('/title/:title', (req, res) => {

    const title = req.params.title.toLowerCase();

    const result = Object.values(books).filter(
        book => book.title.toLowerCase() === title
    );

    return res.status(200).json(result);
});

// GET REVIEWS
public_users.get('/review/:isbn', (req, res) => {

    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
