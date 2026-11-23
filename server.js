
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Connect frontend
app.use(express.static(path.join(__dirname, 'public')));

// Book data
let books = [
    {
        id: 1,
        title: "Wings of Fire",
        author: "A.P.J. Abdul Kalam",
        price: 250
    },
    {
        id: 2,
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 300
    },
    {
        id: 3,
        title: "Atomic Habits",
        author: "James Clear",
        price: 400
    }
];

// Validate book details
function validateBook(req, res, next) {
    const { title, author, price } = req.body;

    if (
        typeof title !== 'string' || !title.trim() ||
        typeof author !== 'string' || !author.trim() ||
        price === '' || price === null ||
        price === undefined ||
        !Number.isFinite(Number(price)) ||
        Number(price) <= 0
    ) {
        return res.status(400).json({
            message: "Please enter valid title, author and price"
        });
    }

    req.body.title = title.trim();
    req.body.author = author.trim();
    req.body.price = Number(price);

    next();
}

// GET - Retrieve all books
app.get('/books', (req, res) => {
    res.json(books);
});

// GET - Retrieve a particular book
app.get('/books/:id', (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.json(book);
});

// POST - Add a new book
app.post('/books', validateBook, (req, res) => {

    const newBook = {
        id: books.length
            ? Math.max(...books.map(b => b.id)) + 1
            : 1,
        title: req.body.title,
        author: req.body.author,
        price: req.body.price
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully!",
        book: newBook
    });
});

// PUT - Update an existing book
app.put('/books/:id', validateBook, (req, res) => {

    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    book.title = req.body.title;
    book.author = req.body.author;
    book.price = req.body.price;

    res.json({
        message: "Book updated successfully!",
        book: book
    });
});

// DELETE - Delete a book
app.delete('/books/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books.splice(index, 1);

    res.json({
        message: "Book deleted successfully!"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
