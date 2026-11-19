const auth = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Wishlist = require('../models/wishlist.model');
const PlatformData = require('../models/platformData.model');
const sendToken = require('../utils/sendToken');
const authMiddleware = require('../middlewares/auth.middleware');
const { getAggregatedLiveStats } = require('../utils/fetchPlatformStats');

async function getUserData(userId) {
    const user = await User.findById(userId).select('-password').lean();
    if (!user) return null;

    const wishlist = await Wishlist.findOne({ userId }).lean();
    const platform = await PlatformData.findOne({ userId }).lean();

    return {
        ...user,
        handles: platform?.handles || {},
        platformData: platform?.stats || null,
        wishlist: wishlist?.items || []
    };
}

auth.post('/signup', async (req, res) => {
    const { name, email, password, handles } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all details' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: passwordHash });

        await PlatformData.create({ userId: user._id, handles: handles || {} });
        await Wishlist.create({ userId: user._id });

        const token = sendToken(res, user._id);
        return res.status(201).json({
            message: 'User registered successfully',
            user: await getUserData(user._id),
            token
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

auth.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter valid details' });
    }

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = sendToken(res, user._id);
        return res.status(200).json({
            message: 'Login successful',
            user: await getUserData(user._id),
            token
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

auth.get('/me', authMiddleware, async (req, res) => {
    try {
        return res.status(200).json({ user: await getUserData(req.user._id) });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

auth.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { handles, platformData } = req.body;
        const update = {};

        if (handles) update.handles = handles;
        if (platformData) update.stats = platformData;

        await PlatformData.findOneAndUpdate(
            { userId: req.user._id },
            { $set: update, $setOnInsert: { userId: req.user._id } },
            { upsert: true }
        );

        return res.status(200).json({
            message: 'Profile updated successfully',
            user: await getUserData(req.user._id)
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

auth.get('/live-stats', authMiddleware, async (req, res) => {
    try {
        const platform = await PlatformData.findOne({ userId: req.user._id }).lean();
        const handles = {
            leetcode: req.query.leetcode || platform?.handles?.leetcode || '',
            codeforces: req.query.codeforces || platform?.handles?.codeforces || '',
            codechef: req.query.codechef || platform?.handles?.codechef || ''
        };

        const stats = await getAggregatedLiveStats(handles);
        const lcHistory = stats.leetcode?.history || [];
        const cfHistory = stats.codeforces?.history || [];
        const ccHistory = stats.codechef?.history || [];

        const historyMonths = new Map();
        lcHistory.forEach(item => historyMonths.set(item.month, { month: item.month, lc: item.lc }));
        cfHistory.forEach(item => {
            const value = historyMonths.get(item.month) || { month: item.month };
            historyMonths.set(item.month, { ...value, cf: item.cf });
        });
        ccHistory.forEach(item => {
            const value = historyMonths.get(item.month) || { month: item.month };
            historyMonths.set(item.month, { ...value, cc: item.cc });
        });

        const data = {
            ...stats,
            ratingHistory: Array.from(historyMonths.values()),
            lastSynced: new Date().toISOString()
        };

        const previous = await PlatformData.findOne({ userId: req.user._id }).lean();
        if (stats.leetcode && (stats.leetcode.totalSolved || 0) <= 0 && (previous?.stats?.leetcode?.totalSolved || 0) > 0) {
            stats.leetcode.totalSolved = previous.stats.leetcode.totalSolved;
            data.leetcode = stats.leetcode;
        }

        await PlatformData.findOneAndUpdate(
            { userId: req.user._id },
            { $set: { stats: data, handles }, $setOnInsert: { userId: req.user._id } },
            { upsert: true }
        );

        return res.status(200).json({ ok: true, stats: data });
    } catch (err) {
        console.error('Live stats error:', err.message);
        return res.status(500).json({ message: 'Failed to fetch live stats' });
    }
});

auth.get('/logout', (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('token', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/'
    });

    return res.status(200).json({ message: 'Logout successful' });
});

module.exports = auth;
