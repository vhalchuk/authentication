const cookieOptions = { httpOnly: true, secure: true, sameSite: 'strict' };

const setTokensCookies = (res, accessToken, refreshToken) => {
    return res
        .cookie('accessToken', accessToken, cookieOptions)
        .cookie('refreshToken', refreshToken, cookieOptions);
};

const clearCookies = (res) => {
    return res.clearCookie('accessToken').clearCookie('refreshToken');
};

module.exports = {
    setTokensCookies,
    clearCookies,
}
