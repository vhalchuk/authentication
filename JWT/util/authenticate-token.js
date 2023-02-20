const TokenExpiredError = require("jsonwebtoken/lib/TokenExpiredError");
const storage = require('../util/storage');
const { accessTokenGenerator, refreshTokenGenerator } = require('../util/token-generator')
const { setTokensCookies, clearCookies } = require('./helpers');

const handleReject = (strict, res, next) => {
    if (strict) {
        return res.redirect('/login');
    }
    return next();
}

const authenticateToken = ({ strict = true } = {}) => async (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return handleReject(strict, res, next);
    }

    const accessTokenPayload = accessTokenGenerator.decode(accessToken);

    try {
        const accessTokenPayload = await accessTokenGenerator.verify(accessToken);
        req.user = accessTokenPayload.user;
        return next();
    } catch (error) {
        if (!(error instanceof TokenExpiredError)) {
            return handleReject(strict, res, next);
        }

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return handleReject(strict, res, next);
        }

        try {
            await refreshTokenGenerator.verify(refreshToken);
            const { user } = accessTokenPayload;

            const userRefreshTokens = storage.refreshTokens.get(user.email);

            if (!userRefreshTokens.has(refreshToken)) {
                userRefreshTokens.clear();
                clearCookies(res);
                return handleReject(strict, res, next);
            }
        } catch (error) {
            clearCookies(res);
            return handleReject(strict, res, next);
        }

        delete accessTokenPayload.iat;
        delete accessTokenPayload.exp;

        const newAccessToken = accessTokenGenerator.sign(accessTokenPayload);
        const newRefreshToken = refreshTokenGenerator.sign();

        const userRefreshTokens = storage.refreshTokens.get(accessTokenPayload.user.email);

        userRefreshTokens.delete(refreshToken);
        userRefreshTokens.add(newRefreshToken);

        setTokensCookies(res, newAccessToken, newRefreshToken);

        req.user = accessTokenPayload.user;
        return next();
    }
};

module.exports = authenticateToken;
