const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const Loan = require('../models').Loan;
const Patron = require('../models').Patron;


/* ***------------------***----------------------***
    <GET> all books
***---------------------***-------------------*** */

router.get('/', (req, res, next) => {
    Book.findAll({ order: [['title', 'DESC']] }).then(books => {
        res.render('books/all', { books, title: 'Books', table: 'book' });
    }).catch(err => {
        res.sendStatus(500);
    });
});

/* ***------------------***----------------------***
    <GET> overdue books
***---------------------***-------------------*** */

router.get('/overdue', (req, res, next) => {
    Book.findAll({ order: [['title', 'DESC']] }).then(books => {
        res.render('books/all', { books, title: 'Overdue Books', table: 'book' });
    }).catch(err => {
        res.sendStatus(500);
    });
});

/* ***------------------***----------------------***
    <GET> checked out books
***---------------------***-------------------*** */

router.get('/checked', (req, res, next) => {
    Book.findAll({ order: [['title', 'DESC']], include: { model: Loan, where: { returned_on: null } } }).then(books => {
        res.render('books/all', { books, title: 'Checked Out Books', table: 'book' });
    }).catch(err => {
        res.sendStatus(500);
    });
});

/* ***------------------***----------------------***
    <GET> new book page
***---------------------***-------------------*** */

router.get('/new', (req, res, next) => {
    res.render('books/new', { title: 'New Book' });
});

/* ***------------------***----------------------***
    <POST> new book
***---------------------***-------------------*** */

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

/* ***------------------***----------------------***
    <GET> individual book
***---------------------***-------------------*** */

router.get('/:id', (req, res, next) => {
    const getBookId = Book.findById(req.params.id);
    const getLoansForBook = Loan.findAll({ where: { book_id: req.params.id }, include: { model: Patron } });
    Promise.all([getBookId, getLoansForBook]).then(info => {
        console.log(info[0]);
        console.log(info[1]);
        if (info[0]) {
            res.render('books/detail', { book: info[0], loans: info[1], title: info[0].title });
        } else {
            res.sendStatus(404);
        }
    }).catch(err => {
        res.sendStatus(500);
    });
});

module.exports = router;
