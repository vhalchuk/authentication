const router = require('express').Router();
const storage = require("../util/storage");

let sessionId = 0;

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser =  storage.users.get(email);

        if (existingUser) {
            return res.status(409).send('Email already in use');
        }

        const user = { name, email, password };
        const session = {
            id: ++sessionId,
            user: { name, email },
        }

        storage.users.set(email, user);
        storage.sessions.set(session.id, session);

        return res
            .cookie('session', session, { httpOnly: true, secure: true, sameSite: 'strict' })
            .redirect('/');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
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

        const session = {
            id: ++sessionId,
            user: {
                name: existingUser.name,
                email: existingUser.email
            },
        }

        storage.sessions.set(session.id, session);

        return res
            .cookie('session', session, { httpOnly: true, secure: true, sameSite: 'strict' })
            .redirect('/');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }
});

router.get('/logout', (req, res) => {
    const { session } = req.cookies;

    if (!session) {
        return res.redirect(req.headers.referer || '/');
    }
    const storageSession = storage.sessions.get(session.id);

    if (storageSession) {
        storage.sessions.delete(storageSession.id);
    }

    return res
        .clearCookie('session')
        .redirect('/');
});

module.exports = router;
