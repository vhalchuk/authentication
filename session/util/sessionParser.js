const storage = require('./storage');

module.exports = (req, res, next) => {
    const session = req.cookies.session;

    if (session && storage.sessions.has(session.id)) {
        req.session = session;
    } else {
        res.clearCookie('session');
    }

    next();
}
