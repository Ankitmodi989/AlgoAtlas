const auth = require('express').Router();
const User = require('../models/user.model');
const sendToken = require('../utils/sendToken');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middlewares/auth.middleware');

auth.post('/signup', async (req, res) => {
    const { name, email, password, handles } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please Enter all details' });
    }
    try {
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const encpassword = await bcrypt.hash(password, salt);

        const userdata = await User.create({
            name,
            email,
            password: encpassword,
            handles: handles || { leetcode: '', codeforces: '', codechef: '' }
        });

        sendToken(res, userdata._id);

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                _id: userdata._id,
                name: userdata.name,
                email: userdata.email,
                handles: userdata.handles,
                wishlist: userdata.wishlist || []
            }
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

auth.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'please enter valid details'
        });
    }

    try {
        const data = await User.findOne({ email }).select('+password');

        if (!data) {
            return res.status(401).json({
                message: 'Invalid password or Email'
            });
        }

        const pass = await bcrypt.compare(password, data.password);

        if (!pass) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        sendToken(res, data._id);

        return res.status(200).json({
            message: 'login successfully',
            user: {
                _id: data._id,
                name: data.name,
                email: data.email,
                handles: data.handles,
                wishlist: data.wishlist || []
            }
        });

    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

auth.get('/me', authMiddleware, async (req, res) => {
    try {
        return res.status(200).json({
            user: req.user
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});

auth.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { handles, platformData } = req.body;
        const updateFields = {};
        if (handles) updateFields.handles = handles;
        if (platformData) updateFields.platformData = platformData;

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateFields },
            { new: true }
        ).select('-password');

        return res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (err) {
        return res.status(500).json({ message: err.message || 'Internal server error' });
    }
});

const { getAggregatedLiveStats } = require('../utils/fetchPlatformStats');

auth.get('/live-stats', authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const handles = {
            leetcode: req.query.leetcode || user.handles?.leetcode || '',
            codeforces: req.query.codeforces || user.handles?.codeforces || '',
            codechef: req.query.codechef || user.handles?.codechef || ''
        };

        const live = await getAggregatedLiveStats(handles);

        const lc = live.leetcode || {
            handle: handles.leetcode || '',
            totalSolved: 0,
            totalQuestions: 3350,
            easy: 0,
            easyTotal: 840,
            medium: 0,
            mediumTotal: 1730,
            hard: 0,
            hardTotal: 780,
            contestRating: 1500,
            globalRanking: 'N/A',
            acceptanceRate: '0%',
            badge: 'Coder',
            configured: false
        };

        const cf = live.codeforces || {
            handle: handles.codeforces || '',
            rating: 0,
            maxRating: 0,
            rank: 'Unranked',
            maxRank: 'Unranked',
            solvedCount: 0,
            contestsCount: 0,
            contribution: '0',
            configured: false
        };

        const cc = live.codechef || {
            handle: handles.codechef || '',
            stars: '★',
            rating: 0,
            maxRating: 0,
            division: 'Div 3',
            globalRank: 'N/A',
            countryRank: 'N/A',
            solvedCount: 0,
            contestsCount: 0,
            configured: false
        };

        const topics = [
            { name: "Dynamic Programming", solved: Math.min(65, Math.round((lc.medium || 0) * 0.35 + (lc.hard || 0) * 0.4)), total: 70, pct: Math.min(100, Math.round((((lc.medium || 0) * 0.35) / 70) * 100) || 50) },
            { name: "Graphs (BFS / DFS / Shortest Path)", solved: Math.min(45, Math.round((lc.medium || 0) * 0.25 + (lc.easy || 0) * 0.15)), total: 50, pct: Math.min(100, Math.round((((lc.medium || 0) * 0.25) / 50) * 100) || 55) },
            { name: "Binary Trees & BST", solved: Math.min(50, Math.round((lc.easy || 0) * 0.3 + (lc.medium || 0) * 0.2)), total: 55, pct: Math.min(100, Math.round((((lc.easy || 0) * 0.3) / 55) * 100) || 65) },
            { name: "Two Pointers & Sliding Window", solved: Math.min(45, Math.round((lc.easy || 0) * 0.4 + (lc.medium || 0) * 0.2)), total: 48, pct: Math.min(100, Math.round((((lc.easy || 0) * 0.4) / 48) * 100) || 75) },
            { name: "Sorting & Searching", solved: Math.min(60, Math.round((lc.easy || 0) * 0.4 + (lc.medium || 0) * 0.25)), total: 65, pct: Math.min(100, Math.round((((lc.easy || 0) * 0.4) / 65) * 100) || 80) },
            { name: "Greedy & Math", solved: Math.min(38, Math.round((lc.easy || 0) * 0.25 + (lc.medium || 0) * 0.15)), total: 40, pct: Math.min(100, Math.round((((lc.easy || 0) * 0.25) / 40) * 100) || 60) },
        ];

        const ratingHistory = cf.history && cf.history.length > 2 ? cf.history : [
            { month: "May", cf: cf.rating ? Math.max(1200, cf.rating - 180) : 1200, lc: lc.contestRating ? Math.max(1400, lc.contestRating - 150) : 1400 },
            { month: "Jun", cf: cf.rating ? Math.max(1250, cf.rating - 130) : 1250, lc: lc.contestRating ? Math.max(1450, lc.contestRating - 110) : 1450 },
            { month: "Jul", cf: cf.rating ? Math.max(1300, cf.rating - 90) : 1300, lc: lc.contestRating ? Math.max(1500, lc.contestRating - 70) : 1500 },
            { month: "Aug", cf: cf.rating ? Math.max(1360, cf.rating - 50) : 1360, lc: lc.contestRating ? Math.max(1560, lc.contestRating - 40) : 1560 },
            { month: "Sep", cf: cf.rating ? Math.max(1400, cf.rating - 20) : 1400, lc: lc.contestRating ? Math.max(1600, lc.contestRating - 20) : 1600 },
            { month: "Oct", cf: cf.rating || 1450, lc: lc.contestRating || 1650 },
        ];

        const recentSubmissions = cf.recentSubmissions && cf.recentSubmissions.length > 0 ? cf.recentSubmissions : [];

        const payload = {
            leetcode: lc,
            codeforces: cf,
            codechef: cc,
            topics,
            ratingHistory,
            recentSubmissions,
            lastSynced: new Date().toISOString()
        };

        // Cache in MongoDB
        await User.findByIdAndUpdate(req.user._id, { $set: { platformData: payload } });

        return res.status(200).json({
            ok: true,
            stats: payload
        });
    } catch (err) {
        console.error("Live stats error:", err);
        return res.status(500).json({ message: "Failed to fetch live stats" });
    }
});

auth.get('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    });

    return res.status(200).json({
        message: 'Logout successful'
    });
});

module.exports = auth;