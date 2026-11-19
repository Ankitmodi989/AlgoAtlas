const mongoose = require('mongoose');
require('dotenv').config()

const connectDB = async() =>{
    const uri = (process.env.MONGODB_URI || '').replace(/;+\s*$/, '').trim();
    const connect = await mongoose.connect(uri);
    return connect;
};

module.exports  = connectDB;
