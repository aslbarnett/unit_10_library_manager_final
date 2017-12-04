const express = require('express');
const router = express.Router();
const Loan = require('../models').Loan;
const Book = require('../models').Book;
const Patron = require('../models').Patron;
const helper = require('../helper');


/* ***------------------***----------------------***
    <GET> all loans
***---------------------***-------------------*** */

router.get('/', (req, res, next) => {
    let info = {
        limit: 5,
        offset: 0,
        where: {},
        order: [[ 'id', 'ASC' ]],
        include: [{model: Book}, {model: Patron}]
    };

    if (req.query.pageNumber) {
        info.offset = (req.query.pageNumber - 1) * info.limit;
    }

    Loan.findAndCountAll(info)
        .then(loans => {
            let pages = Math.ceil(loans.count / info.limit);
            res.render('loans/all', { loans: loans.rows, title: 'Loans', table: 'loan', count: loans.count, pages });
        }).catch(err => {
        res.sendStatus(500);
    });
});

/* ***------------------***----------------------***
    <GET> overdue loans
***---------------------***-------------------*** */

router.get('/overdue', (req, res, next) => {
    let info = {
        limit: 5,
        offset: 0,
        where: {returned_on: null, return_by: { lt: new Date() }},
        order: [[ 'id', 'ASC' ]],
        include: [{model: Book}, {model: Patron}]
    };

    if (req.query.pageNumber) {
        info.offset = (req.query.pageNumber - 1) * info.limit;
    }

    Loan.findAndCountAll(info)
        .then(loans => {
            let pages = Math.ceil(loans.count / info.limit);
            res.render('loans/all', { loans: loans.rows, title: 'Overdue Loans', table: 'loan', count: loans.count, pages });
        }).catch(err => {
        res.sendStatus(500);
    });
});

/* ***------------------***----------------------***
    <GET> checked out loans
***---------------------***-------------------*** */

router.get('/checked', (req, res, next) => {
    let info = {
        limit: 5,
        offset: 0,
        where: {returned_on: null},
        order: [[ 'id', 'ASC' ]],
        include: [{model: Book}, {model: Patron}]
    };

    if (req.query.pageNumber) {
        info.offset = (req.query.pageNumber - 1) * info.limit;
    }

    Loan.findAndCountAll(info)
        .then(loans => {
            let pages = Math.ceil(loans.count / info.limit);
            res.render('loans/all', { loans: loans.rows, title: 'Overdue Loans', table: 'loan', count: loans.count, pages });
        }).catch(err => {
        res.sendStatus(500);
    });
});

/* ***------------------***----------------------***
    <GET> new loan page
***---------------------***-------------------*** */

router.get('/new', (req, res, next) => {
    const allBooks = Book.findAll({ order: [['title', 'DESC']], attributes: ['title', 'id']});
    const allPatrons = Patron.findAll({ order: [['last_name', 'DESC']], attributes: ['first_name', 'last_name', 'id'] });
    const todayDate = helper.formatDate(new Date());
    const futureDate = helper.formatFutureDate(new Date(), 7);
    Promise.all([allBooks, allPatrons]).then(info => {
        res.render('loans/new', { title: 'New Loan', books: info[0], patrons: info[1], todayDate, futureDate });
    });
});

/* ***------------------***----------------------***
    <POST> new loan
***---------------------***-------------------*** */

router.post('/new', (req, res, next) => {
    Loan.create(req.body).then(loan => {
        res.redirect('/loans');
    }).catch(err => {
        const allBooks = Book.findAll({ order: [['title', 'DESC']], attributes: ['title', 'id']});
        const allPatrons = Patron.findAll({ order: [['last_name', 'DESC']], attributes: ['first_name', 'last_name', 'id'] });
        const todayDate = helper.formatDate(new Date());
        const futureDate = helper.formatFutureDate(new Date(), 7);
        Promise.all([allBooks, allPatrons]).then(info => {
            if (err.name = 'SequelizeValidationError') {
                res.render('loans/new', {
                    books: info[0],
                    patrons: info[1],
                    todayDate,
                    futureDate,
                    title: 'New Loan',
                    error: err.errors
                });
            } else {
                throw err;
            }
        });
    }).catch(err => {
        res.sendStatus(500);
    });
});

/* ***------------------***----------------------***
    <GET> return book page
***---------------------***-------------------*** */

router.get('/return/:id', (req, res, next) => {
    Loan.findOne({
        where: { book_id: req.params.id }, include: [{ model: Book }, {model: Patron}]
    }).then(loan => {
        res.render('loans/return', { title: 'Return Book', loan, date: helper.formatDate(new Date()) });
    }).catch(err => {
        res.sendStatus(500);
    });
});


/* ***------------------***----------------------***
    <PUT> update return book status
***---------------------***-------------------*** */

router.post('/return/:id', (req, res, next) => {
    let reg = new RegExp('^\\d{4}\\-\\d{1,2}\\-\\d{1,2}$');
    if (req.body.returned_on !== '' && reg.test(req.body.returned_on) === true) {
        Loan.findOne({
            where: { book_id: req.params.id }
        }).then(loan => {
            if (loan) {
                return loan.update(req.body);
            } else {
                res.sendStatus(404);
            }
        }).then(loan => {
            res.redirect('/loans');
        }).catch(loan => {
            if (err.name === 'SequelizeValidationError') {
                res.render('home');
            } else {
                throw err;
            }
        }).catch(err => {
            res.sendStatus(500);
        });
    } else {
        Loan.findOne({
            where: { book_id: req.params.id }, include: [{ model: Book }, {model: Patron}]
        }).then(loan => {
            res.render('loans/return', { title: 'Return Book', loan, date: helper.formatDate(new Date()), message: 'The returned on date is required in the format YYYY-MM-DD.' });
        }).catch(err => {
            res.sendStatus(500);
        });
    }
});

module.exports = router;













