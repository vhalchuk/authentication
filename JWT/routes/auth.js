const router = require('express').Router();
const storage = require('../util/storage');
const { accessTokenGenerator, refreshTokenGenerator } = require('../util/tokenGenerators');
const { setTokensCookies, clearCookies } = require('../util/helpers');

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser =  storage.users.get(email);

        if (existingUser) {
            return res.status(409).send('Email already in use');
        }

        const user = { name, email, password };
        const accessToken = accessTokenGenerator.sign({ user: { name, email } });
        const refreshToken = refreshTokenGenerator.sign();

        storage.users.set(email, user);
        storage.refreshTokens.set(email, new Set([refreshToken]));

        setTokensCookies(res, accessToken, refreshToken);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser =  storage.users.get(email);

        if (!existingUser) {
            return res.status(404).send('Could not find such user');
        }

        if (password !== existingUser.password) {
            return res.status(400).send('Wrong password');
        }

        const user = Object.assign({}, existingUser);
        delete user.password;

        const accessToken = accessTokenGenerator.sign({ user });
        const refreshToken = refreshTokenGenerator.sign();

        storage.refreshTokens.get(existingUser.email).add(refreshToken);

        setTokensCookies(res, accessToken, refreshToken);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.get('/logout', (req, res) => {
    if (!req.user) return res.redirect('/');

    storage.refreshTokens
        .get(req.user.email)
        .delete(req.cookies.refreshToken);

    clearCookies(res);
    res.redirect('/');
});

module.exports = router;
