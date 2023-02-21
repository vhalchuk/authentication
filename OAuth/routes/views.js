const authenticateUser = require("../util/authenticateUser");
const router = require('express').Router();

router.get('/', authenticateUser, (req, res) => {
    res.render('index', { user: req.user });
});

router.get('/profile', authenticateUser, (req, res) => {
    if (!req.user) return res.redirect('/');

    res.render('profile', { user: req.user });
});

module.exports = router;
