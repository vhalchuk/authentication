const router = require('express').Router();

router.get('/', (req, res) => {
    const user = req.cookies?.session?.user;

    res.render('index', { user });
});

router.get('/login', (req, res) => {
    const user = req.cookies?.session?.user;

    if (user) {
        return res.redirect(req.headers.referer || '/');
    }

    res.render('login');
});

router.get('/register', (req, res) => {
    const user = req.cookies?.session?.user;

    if (user) {
        return res.redirect(req.headers.referer || '/');
    }

    res.render('register');
});

router.get('/profile', (req, res) => {
    const user = req.cookies?.session?.user;

    if (!user) {
        return res.redirect('/login');
    }

    res.render('profile', { user });
});

module.exports = router;
