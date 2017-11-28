const express = require('express');
const router = express.Router();
const Book = require('../models').book;

// GET all books
router.get('/', (req, res, next) => {
    Book.findAll({ order: [['title', 'DESC']] }).then(books => {
        res.render('books/all', { books, title: 'Books', table: 'book' });
    }).catch(err => {
        res.sendStatus(500);
    });
});

// GET overdue books
router.get('/overdue', (req, res, next) => {
    Book.findAll({ order: [['title', 'DESC']] }).then(books => {
        res.render('books/all', { books, title: 'Overdue Books', table: 'book' });
    }).catch(err => {
        res.sendStatus(500);
    });
});

// GET checked out books
router.get('/checked', (req, res, next) => {
    Book.findAll({ order: [['title', 'DESC']] }).then(books => {
        res.render('books/all', { books, title: 'Checked Out Books', table: 'book' });
    }).catch(err => {
        res.sendStatus(500);
    });
});

// GET new book page
router.get('/new', (req, res, next) => {
    res.render('books/new', { title: 'New Book' });
});

// POST new book
router.post('/new', (req, res, next) => {
    if (req.body.title && req.body.author && req.body.genre) {
        Book.create(req.body).then(book => {
            res.redirect('/books');
        }).catch(err => {
            if (err.name = 'SequelizeValidationError') {
                res.render('books/new', {
                    book: Book.build(req.body),
                    title: 'New Book',
                    error: err.errors
                });
            } else {
                throw err;
            }
        }).catch(err => {
            res.sendStatus(500);
        });
    } else {
        res.render('books/new', { title: 'New Book', message: 'Title, Author and Genre fields are required.' });
    }
});

// GET individual book
router.get('/:id', (req, res, next) => {
    Book.findById(req.params.id).then(book => {
        if (book) {
            res.render('books/detail', { book, title: book.title });
        } else {
            res.sendStatus(404);
        }
    }).catch(err => {
        res.sendStatus(500);
    });
});

module.exports = router;