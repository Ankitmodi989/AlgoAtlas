const generateToken = require('./generateToken');

const sendToken = (res, userId) => {
    const token = generateToken(userId);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
};

module.exports = sendToken;