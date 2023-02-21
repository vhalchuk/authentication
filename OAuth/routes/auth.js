const router = require('express').Router();
const axios = require('axios');
const uuid = require('uuid');
const storage = require('../util/storage');

router.get('/login/google', (req, res) => {
    if (req.user) return res.redirect('/');

    const urlSearchParams = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: 'http://localhost:3000/auth/callback/google',
        scope: 'https://www.googleapis.com/auth/userinfo.profile',
        response_type: 'code'
    });
    const authorizationUrl = `https://accounts.google.com/o/oauth2/v2/auth?${urlSearchParams.toString()}`;
    res.redirect(authorizationUrl);
});

router.get('/callback/google', async (req, res) => {
    const code = req.query.code;

    const tokenRequestData = new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: 'http://localhost:3000/auth/callback/google',
        grant_type: 'authorization_code'
    });

    try {
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', tokenRequestData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const accessToken = tokenResponse.data.access_token;

        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const { id: userId, ...userData } = userInfoResponse.data;

        const existingUser = storage.users.get(userId);

        if (!existingUser) {
            storage.users.set(userId, userData);
        }

        const sessionId = uuid.v4();

        storage.sessions.set(sessionId, { user: existingUser || userData });

        res
            .cookie('session', sessionId, { httpOnly: true, secure: true, sameSite: 'strict' })
            .redirect('/');
    } catch (error) {
        res.status(500).send('An error occurred');
    }
});

router.get('/logout', (req, res) => {
    if (!req.user) return res.redirect('/');

    storage.sessions.delete(req.cookies.session);

    res
        .clearCookie('session')
        .redirect('/');
});

module.exports = router;
