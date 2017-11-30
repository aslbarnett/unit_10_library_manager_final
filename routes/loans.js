const express = require('express');
const router = express.Router();
const Loan = require('../models').Loan;
const Book = require('../models').Book;
const Patron = require('../models').Patron;
const helper = require('../helper');


// GET all loans
router.get('/', (req, res, next) => {
    Loan.findAll({ include: [{model: Book}, {model: Patron}] }).then(loans => {
        res.render('loans/all', { loans, title: 'Loans', table: 'loan' });
    }).catch(err => {
        res.sendStatus(500);
    });
});

// GET overdue loans
router.get('/overdue', (req, res, next) => {
    Loan.findAll({ order: [['loaned_on', 'DESC']] }).then(loans => {
        res.render('loans/all', { loans, title: 'Overdue Loans', table: 'loan' });
    }).catch(err => {
        res.sendStatus(500);
    });
});

// GET checked out loans
router.get('/checked', (req, res, next) => {
    Loan.findAll({ order: [['loaned_on', 'DESC']] }).then(loans => {
        res.render('loans/all', { loans, title: 'Checked Out Loans', table: 'loan' });
    }).catch(err => {
        res.sendStatus(500);
    });
});

// GET new loan page
router.get('/new', (req, res, next) => {
    const allBooks = Book.findAll({ order: [['title', 'DESC']], attributes: ['title', 'id'] });
    const allPatrons = Patron.findAll({ order: [['last_name', 'DESC']], attributes: ['first_name', 'last_name', 'id'] });
    const todayDate = helper.formatDate(new Date());
    const futureDate = helper.formatFutureDate(new Date(), 7);
    Promise.all([allBooks, allPatrons]).then(info => {
        res.render('loans/new', { title: 'New Loan', books: info[0], patrons: info[1], todayDate, futureDate });
    });
});

// POST new loan
router.post('/new', (req, res, next) => {
    Loan.create(req.body).then(loan => {
        res.redirect('/loans');
    }).catch(err => {
        if (err.name = 'SequelizeValidationError') {
            res.render('loans/new', {
                loan: Loan.build(req.body),
                title: 'New Loan',
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