const storage = require('./storage');

module.exports = (req, res, next) => {
    const session = req.cookies.session;

    if (session?.user && storage.sessions.has(session.id)) {
        req.user = session.user;
    } else {
        res.clearCookie('session');
    }

    next();
}
