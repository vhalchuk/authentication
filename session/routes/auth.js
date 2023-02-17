const router = require('express').Router();
const storage = require("../storage");

let sessionId = 0;

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser =  storage.users.find((user) => user.email === email);

        if (existingUser) {
            return res.status(409).send('Email already in use');
        }

        const user = { name, email, password };
        const session = {
            id: ++sessionId,
            user: { name, email },
        }

        storage.users.push(user);
        storage.sessions.push(session);

        return res
            .cookie('session', session)
            .redirect('/');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser =  storage.users.find((user) => user.email === email);

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

        storage.sessions.push(session);

        return res
            .cookie('session', session)
            .redirect('/');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }
});

router.get('/logout', (req, res) => {
    const { session } = req.cookies;

    if (!session) {
        return res.status(401).json('You are not logged in!');
    }
    const storageSession = storage.sessions.find((s) => s.id === session.id);

    if (storageSession) {
        const storageSessionIndex = storage.sessions.indexOf(storageSession);

        storage.sessions = storage.sessions.splice(storageSessionIndex, 1);
    }

    return res
        .clearCookie('session')
        .redirect('/');
});

module.exports = router;
