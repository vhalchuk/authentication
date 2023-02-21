const storage = require("../util/storage");

const authenticateUser = (req, res, next) => {
    if (!req.cookies.sessionId) return next();

    const user = storage.sessions.get(req.cookies.sessionId);

    if (!user) {
        storage.sessions.delete(req.cookies.sessionId);
        res.clearCookie('sessionId');
        return next();
    }

    req.user = user;
    next();
}

module.exports = authenticateUser;
