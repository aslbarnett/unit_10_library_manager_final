const express = require('express');
const router = express.Router();

// GET home page
router.get('/', (req, res, next) => {
    res.redirect('/home');
});


// GET home page
router.get('/home', (req, res, next) => {
    res.render('home', { title: 'Library Manager' });
});

module.exports = router;
