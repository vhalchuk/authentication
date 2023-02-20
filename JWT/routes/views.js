const router = require('express').Router();
const authenticateToken = require('../util/authenticate-token');

router.get('/', authenticateToken({ strict: false }), (req, res) => {
    res.render('index', { user: req.user });
});

router.get('/login', (req, res) => {
    const user = req.session?.user;

    if (user) {
        return res.redirect(req.headers.referer || '/');
    }

    res.render('login');
});

router.get('/register', (req, res) => {
    const user = req.session?.user;

    if (user) {
        return res.redirect(req.headers.referer || '/');
    }

    res.render('register');
});

router.get('/profile', authenticateToken(), (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }

    res.render('profile', { user: req.user });
});

module.exports = router;
