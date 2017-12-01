const express = require('express');
const router = express.Router();
const Patron = require('../models').Patron;
const Book = require('../models').Book;
const Loan = require('../models').Loan;


/* ***------------------***----------------------***
    <GET> all patrons
***---------------------***-------------------*** */

router.get('/', (req, res, next) => {
    Patron.findAll({ order: [['last_name', 'DESC']] }).then(patrons => {
        res.render('patrons/all', { patrons, title: 'Patrons', table: 'patron' });
    }).catch(err => {
        res.sendStatus(500);
    });
});

/* ***------------------***----------------------***
    <GET> new patron page
***---------------------***-------------------*** */

router.get('/new', (req, res, next) => {
    res.render('patrons/new', { title: 'New Patron' });
});

/* ***------------------***----------------------***
    <POST> new patron
***---------------------***-------------------*** */

router.post('/new', (req, res, next) => {
    Patron.create(req.body).then(patron => {
        res.redirect('/patrons');
    }).catch(err => {
        if (err.name = 'SequelizeValidationError') {
            res.render('patrons/new', {
                patron: Patron.build(req.body),
                title: 'New Patron',
                error: err.errors
            });
        } else {
            throw err;
        }
    }).catch(err => {
        res.sendStatus(500);
    });
});

/* ***------------------***----------------------***
    <GET> individual loan
***---------------------***-------------------*** */

router.get('/:id', (req, res, next) => {
    const getPatron = Patron.findById(req.params.id);
    const getLoansForPatron = Loan.findAll({ where: { patron_id: req.params.id }, include: { model: Book } });
    Promise.all([getPatron, getLoansForPatron]).then(info => {
        if (info[0]) {
            res.render('patrons/detail', { title: `Patron: ${info[0].dataValues.first_name} ${info[0].dataValues.last_name}`, patron: info[0], loans: info[1] });
        } else {
            res.sendStatus(404);
        }
    }).catch(err => {
        res.sendStatus(500);
    });
});

/* ***------------------***----------------------***
    <POST> individual loan
***---------------------***-------------------*** */

module.exports = router;











