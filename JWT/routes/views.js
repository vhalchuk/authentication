const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

router.get('/login', (req, res) => {
    if (req.user) return res.redirect('/');

    res.render('login');
});

router.get('/register', (req, res) => {
    if (req.user) return res.redirect('/');

    res.render('register');
});

router.get('/profile', (req, res) => {
    if (!req.user) return res.redirect('/login');

    res.render('profile', { user: req.user });
});

module.exports = router;
