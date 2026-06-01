const axios = require("axios");

const BASE_URL = "http://localhost:5000";

const getAllBooks = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/`);
        console.log("TASK 10 - ALL BOOKS");
        console.log(res.data);
    } catch (err) {
        console.log(err.message);
    }
};

// Promise style - ISBN
const getBookByISBN = (isbn) => {
    return axios.get(`${BASE_URL}/isbn/${isbn}`)
        .then(res => {
            console.log("TASK 11 - ISBN SEARCH");
            console.log(res.data);
        })
        .catch(err => console.log(err.message));
};

// Promise style - Author
const getBooksByAuthor = (author) => {
    return axios.get(`${BASE_URL}/author/${author}`)
        .then(res => {
            console.log("TASK 12 - AUTHOR SEARCH");
            console.log(res.data);
        })
        .catch(err => console.log(err.message));
};

// Promise style - Title
const getBooksByTitle = (title) => {
    return axios.get(`${BASE_URL}/title/${title}`)
        .then(res => {
            console.log("TASK 13 - TITLE SEARCH");
            console.log(res.data);
        })
        .catch(err => console.log(err.message));
};

// RUN ALL TESTS
const runAll = async () => {
    await getAllBooks();

    await getBookByISBN(1);
    await getBooksByAuthor("Jane Austen");
    await getBooksByTitle("Pride and Prejudice");
};

runAll();
