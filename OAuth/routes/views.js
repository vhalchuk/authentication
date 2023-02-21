const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

router.get('/profile', (req, res) => {
    if (!req.user) return res.redirect('/login');

    res.render('profile', { user: req.user });
});

module.exports = router;
