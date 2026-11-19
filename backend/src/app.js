require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express = require('express');
const auth = require('./routers/auth.router.js');
const wishlistRouter = require('./routers/wishlist.routes.js');
const trackerRouter = require('./routers/tracker.routes.js');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');

const defaultAllowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
];
const configuredOrigins = [process.env.CLIENT_URL, process.env.FRONTEND_URL]
    .filter(Boolean)
    .flatMap(origins => origins.split(','))
    .map(origin => origin.trim())
    .filter(Boolean);
const allowedOrigins = new Set([...defaultAllowedOrigins, ...configuredOrigins]);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', auth);
app.use('/api/user/wishlist', wishlistRouter);
app.use('/api/user/tracker', trackerRouter);

app.use((err,req,res,next)=>{
    console.log(err);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong';
    res.status(statusCode).json({message});
});

module.exports = app;