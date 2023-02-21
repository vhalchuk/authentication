const storage = require("../util/storage");

const authenticateUser = (req, res, next) => {
    if (!req.cookies.session) return next();

    const user = storage.sessions.get(req.cookies.session);

    if (!user) {
        storage.sessions.delete(req.cookies.session);
        res.clearCookie('session');
        return next();
    }

    req.user = user;
    next();
}

module.exports = authenticateUser;
