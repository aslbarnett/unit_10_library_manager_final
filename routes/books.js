const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const Loan = require('../models').Loan;
const Patron = require('../models').Patron;
const helper = require('../helper');


/* ***------------------***----------------------***
    <GET> all books
***---------------------***-------------------*** */

router.get('/', (req, res, next) => {
    let info = {
        limit: 5,
        offset: 0,
        where: {},
        order: [[ 'id', 'ASC' ]]
    };

    if (req.query.pageNumber) {
        info.offset = (req.query.pageNumber - 1) * info.limit;
    } else if (req.query.searchBook) {
        let noCaseSearch = req.query.searchBook.toLowerCase();
        info.where = {
            $or: [
                {
                    title: {
                        $like: `%${noCaseSearch}%`
                    }
                },
                {
                    author: {
                        $like: `%${noCaseSearch}%`
                    }
                },
                {
                    genre: {
                        $like: `%${noCaseSearch}%`
                    }
                }
            ]
        };
    }
    Book.findAndCountAll(info)
        .then(books => {
            let pages = Math.ceil(books.count / info.limit);
            res.render('books/all', { type: 'all', books: books.rows, title: 'Books', table: 'book', count: books.count, pages });
        }).catch(err => {
            res.sendStatus(500);
    });

});

/* ***------------------***----------------------***
    <GET> overdue books
***---------------------***-------------------*** */

router.get('/overdue', (req, res, next) => {
    let info = {
        limit: 5,
        offset: 0,
        where: {},
        order: [[ 'id', 'ASC' ]],
        include: {model: Loan, where: { returned_on: null, return_by: { lt: new Date() }}}
    };

    if (req.query.pageNumber) {
        info.offset = (req.query.pageNumber - 1) * info.limit;
    } else if (req.query.searchBook) {
        let noCaseSearch = req.query.searchBook.toLowerCase();
        info.where = {
            $or: [
                {
                    title: {
                        $like: `%${noCaseSearch}%`
                    }
                },
                {
                    author: {
                        $like: `%${noCaseSearch}%`
                    }
                },
                {
                    genre: {
                        $like: `%${noCaseSearch}%`
                    }
                }
            ]
        };
    }

    Book.findAndCountAll(info)
        .then(books => {
            let pages = Math.ceil(books.count / info.limit);
            res.render('books/all', { type: 'overdue', books: books.rows, title: 'Overdue Books', table: 'book', count: books.count, pages });
        }).catch(err => {
        res.sendStatus(500);
    });
});

/* ***------------------***----------------------***
    <GET> checked out books
***---------------------***-------------------*** */

router.get('/checked', (req, res, next) => {
    let info = {
        limit: 5,
        offset: 0,
        where: {},
        order: [[ 'id', 'ASC' ]],
        include: { model: Loan, where: { returned_on: null } }
    };

    if (req.query.pageNumber) {
        info.offset = (req.query.pageNumber - 1) * info.limit;
    } else if (req.query.searchBook) {
        let noCaseSearch = req.query.searchBook.toLowerCase();
        info.where = {
            $or: [
                {
                    title: {
                        $like: `%${noCaseSearch}%`
                    }
                },
                {
                    author: {
                        $like: `%${noCaseSearch}%`
                    }
                },
                {
                    genre: {
                        $like: `%${noCaseSearch}%`
                    }
                }
            ]
        };
    }

    Book.findAndCountAll(info)
        .then(books => {
            let pages = Math.ceil(books.count / info.limit);
            res.render('books/all', { type: 'checked', books: books.rows, title: 'Checked Out Books', table: 'book', count: books.count, pages });
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

router.get('/book/:id', (req, res, next) => {
    const getBook = Book.findById(req.params.id);
    const getLoansForBook = Loan.findAll({ where: { book_id: req.params.id }, include: { model: Patron } });
    Promise.all([getBook, getLoansForBook]).then(info => {
        if (info[0]) {
            res.render('books/detail', { book: info[0], loans: info[1], title: info[0].title });
        } else {
            res.sendStatus(404);
        }
    }).catch(err => {
        res.sendStatus(500);
    });
});

/* ***------------------***----------------------***
    <PUT> update individual book
***---------------------***-------------------*** */

router.post('/book/:id', (req, res, next) => {
    Book.findById(req.params.id).then(book => {
        if (book) {
            return book.update(req.body);
        } else {
            res.sendStatus(404);
        }
    }).then(book => {
        res.redirect('/books');
    }).catch(err => {
        if (err.name === 'SequelizeValidationError') {
            let book = Book.build(req.body);
            book.id = req.params.id;

            res.render('books/detail', {
                book,
                title: book.title,
                error: err.errors
            });
        } else {
            throw err;
        }
    }).catch(err => {
        res.sendStatus(500);
    });
});


module.exports = router;



















