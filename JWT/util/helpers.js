const cookieOptions = { httpOnly: true, secure: true, sameSite: 'strict' };

const setTokensCookies = (res, accessToken, refreshToken) => {
    return res
        .cookie('accessToken', accessToken, cookieOptions)
        .cookie('refreshToken', refreshToken, cookieOptions);
};

module.exports = {
    setTokensCookies,
}
