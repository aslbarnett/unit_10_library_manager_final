const express = require('express');
const router = express.Router();
const Loan = require('../models').loan;
const Book = require('../models').book;
const Patron = require('../models').patron;


// GET all loans
router.get('/', (req, res, next) => {
    Loan.findAll({ order: [['loaned_on', 'DESC']] }).then(loans => {
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
    const allBooks = Book.findAll({ order: [['title', 'DESC']] });
    Promise.all([allBooks]).then(info => {
        res.render('loans/new', { title: 'New Loan', books: info[0] });
    });
});

module.exports = router;