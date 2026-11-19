const express = require('express');
const userRouter = require('./routers/user.routes.js')
const auth = require('./routers/auth.router.js');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', auth);
app.use('/api/user', userRouter);

app.use((err,req,res,next)=>{
    console.log(err);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong';
    res.status(statusCode).json({message});
});

module.exports = app;