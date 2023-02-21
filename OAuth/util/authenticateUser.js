const storage = require("../util/storage");

const authenticateUser = (req, res, next) => {
    if (!req.cookies.session) return next();

    const session = storage.sessions.get(req.cookies.session);

    if (!session) return next();

    req.user = session.user;
    next();
}

module.exports = authenticateUser;
