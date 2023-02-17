const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

router.get('/login', (req, res) => {
    if(req.user){
        res.redirect(req.headers.referer || '/');
    }

    res.render('login');
});

router.get('/register', (req, res) => {
    if(req.user){
        res.redirect(req.headers.referer || '/');
    }

    res.render('register');
});

router.get('/profile', (req, res) => {
    if(!req.user){
        res.redirect('/auth/login');
    }

    res.render('profile', { user: req.user });
});

module.exports = router;
