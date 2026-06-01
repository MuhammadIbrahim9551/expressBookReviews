console.log("🔥 GENERAL.JS LOADED FROM:", __filename);

const express = require('express');
let books = require("./booksdb.js");
let usersModule = require("./auth_users.js");

let users = require("./users");

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

function getAllBooks(callback) {
    setTimeout(() => {
        callback(null, books);
    }, 1000);
}

public_users.get('/async/books', (req, res) => {
    getAllBooks((err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
});

function searchByISBN(isbn) {
    return new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ message: "Book not found" });
        }
    });
}

public_users.get('/async/isbn/:isbn', (req, res) => {
    searchByISBN(req.params.isbn)
        .then(data => res.json(data))
        .catch(err => res.status(404).json(err));
});

function searchByAuthor(author) {
    return Object.values(books).filter(
        book => book.author.toLowerCase() === author.toLowerCase()
    );
}

public_users.get('/async/author/:author', (req, res) => {
    return res.json(searchByAuthor(req.params.author));
});

function searchByTitle(title) {
    return Object.values(books).filter(
        book => book.title.toLowerCase() === title.toLowerCase()
    );
}

public_users.get('/async/title/:title', (req, res) => {
    return res.json(searchByTitle(req.params.title));
});

module.exports.general = public_users;
