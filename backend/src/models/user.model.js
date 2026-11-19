const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false,
        lowercase: false,
        uppercase: false,
        trim: true,
        minlength: 2,
        maxlength: 20,
        default: "Anonymous",
        match: /^[A-Za-z\s]+$/,
        index: true,
        sparse: false,
        validate: {
            validator: function (value) {
                return value.length >= 2;
            },
            message: "Name must be at least 2 characters long"
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 5,
        maxlength: 100,
        sparse: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email"
        ],
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: "Invalid email format"
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "password must be at least 8 characters"],
        maxlength: [128, "password cannot exceed 128"],
        trim: true,
        validate: {
            validator: function (v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/.test(v);
            },
            message:
                "Password must contain uppercase,lowercase,number and special character"

        },
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    handles: {
        leetcode: { type: String, default: '' },
        codeforces: { type: String, default: '' },
        codechef: { type: String, default: '' }
    },
    platformData: {
        type: Object,
        default: null
    },
    wishlist: {
        type: [String],
        default: []
    }
},
    {
        timestamps: true
    });

const user = mongoose.model('user',UserSchema);

module.exports = user;