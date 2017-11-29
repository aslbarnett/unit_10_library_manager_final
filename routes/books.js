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
    let reg = new RegExp('^\\d{4}$');
    if (req.body.first_published !== '' && reg.test(req.body.first_published) === false) {
        res.render('books/new', { title: 'New Book', message: 'Please enter a 4 digit year e.g. 1997 or 1963' });

    } else {
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