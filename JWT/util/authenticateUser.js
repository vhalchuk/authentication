const TokenExpiredError = require('jsonwebtoken/lib/TokenExpiredError');
const storage = require('../util/storage');
const { accessTokenGenerator, refreshTokenGenerator } = require('./tokenGenerators')
const { setTokensCookies } = require('./helpers');

const authenticateUser = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) return next();

    try {
        const accessTokenPayload = await accessTokenGenerator.verify(accessToken);
        req.user = accessTokenPayload.user;
        return next();
    } catch (error) {
        if (!(error instanceof TokenExpiredError)) {
            // any unexpected error
            return next();
        }

        // verify refresh token, because access token has expired
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return next();
        }

        try {
            await refreshTokenGenerator.verify(refreshToken);
        } catch (error) {
            return next();
        }

        // issue new access and refresh tokens
        const accessTokenPayload = accessTokenGenerator.decode(accessToken);

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

module.exports = authenticateUser;
