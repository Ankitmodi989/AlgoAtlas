const generateToken = require('./generateToken');

const sendToken = (res, userId) => {
    const token = generateToken(userId);
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return token;
};

module.exports = sendToken;