const express = require('express');
const router = express.Router();
const Patron = require('../models').patron;


// GET all patrons
router.get('/', (req, res, next) => {
    Patron.findAll({ order: [['last_name', 'DESC']] }).then(patrons => {
        res.render('patrons/all', { patrons, title: 'Patrons', table: 'patron' });
    }).catch(err => {
        res.sendStatus(500);
    });
});

// GET new patron page
router.get('/new', (req, res, next) => {
    res.render('patrons/new', { title: 'New Patron' });
});

// POST new patron page
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

module.exports = router;