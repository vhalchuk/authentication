const router = require('express').Router();
const storage = require('../util/storage');
const uuid = require('uuid');
const authenticateUser = require("../util/authenticateUser");

const cookieOptions = { httpOnly: true, secure: true, sameSite: 'strict' };

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    const existingUser =  storage.users.get(email);

    if (existingUser) {
        return res.status(409).send('Email already in use');
    }

    const user = { name, email, password };
    const sessionId = uuid.v4();

    storage.users.set(email, user);
    storage.sessions.set(sessionId, { user });

    return res
        .cookie('session', sessionId, cookieOptions)
        .redirect('/');
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const existingUser =  storage.users.get(email);

    if (!existingUser) {
        return res.status(404).send('Could not find such user');
    }

    if (password !== existingUser.password) {
        return res.status(400).send('Wrong password');
    }

    const sessionId = uuid.v4();

    storage.sessions.set(sessionId, { user: existingUser });

    return res
        .cookie('session', sessionId, cookieOptions)
        .redirect('/');
});

router.get('/logout', authenticateUser, (req, res) => {
    if (!req.user) return res.redirect('/');

    storage.sessions.delete(req.cookies.session);

    return res
        .clearCookie('session')
        .redirect('/');
});

module.exports = router;
