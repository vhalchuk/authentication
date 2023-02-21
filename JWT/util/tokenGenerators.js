const jwt = require('jsonwebtoken');

class TokenGenerator {
    constructor(secret, options) {
        this.secret = secret;
        this.options = options;
    }

    sign(payload = {}) {
        return jwt.sign(payload, this.secret, this.options);
    }

    verify(token) {
        return new Promise((res, rej) => jwt.verify(token, this.secret, (err, payload) => {
            if (err) return rej(err);

            return res(payload);
        }));
    }

    decode(token) {
        return jwt.decode(token)
    }
}

const accessTokenGenerator = new TokenGenerator('ACCESS_TOKEN_SECRET', { expiresIn: '15s' });
const refreshTokenGenerator = new TokenGenerator('REFRESH_TOKEN_SECRET', { expiresIn: '30d' });

module.exports = {
    accessTokenGenerator,
    refreshTokenGenerator,
};
