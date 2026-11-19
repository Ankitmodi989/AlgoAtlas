const express = require('express');
const Wishlist = require('../models/wishlist.model');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.user._id });
        return res.json({ ok: true, wishlist: wishlist?.items || [] });
    } catch (err) {
        return res.status(500).json({ ok: false, message: err.message });
    }
});

router.post('/toggle', async (req, res) => {
    try {
        const { algoId } = req.body;
        if (!algoId) {
            return res.status(400).json({ ok: false, message: 'algoId is required' });
        }

        const wishlist = await Wishlist.findOneAndUpdate(
            { userId: req.user._id },
            { $setOnInsert: { userId: req.user._id } },
            { new: true, upsert: true }
        );

        const index = wishlist.items.indexOf(algoId);
        const isFavorite = index === -1;

        if (isFavorite) {
            wishlist.items.push(algoId);
        } else {
            wishlist.items.splice(index, 1);
        }

        await wishlist.save();
        return res.json({
            ok: true,
            wishlist: wishlist.items,
            isFavorite,
            message: isFavorite ? 'Added to wishlist' : 'Removed from wishlist'
        });
    } catch (err) {
        return res.status(500).json({ ok: false, message: err.message });
    }
});

router.put('/', async (req, res) => {
    try {
        const { wishlist } = req.body;
        if (!Array.isArray(wishlist)) {
            return res.status(400).json({ ok: false, message: 'wishlist must be an array' });
        }

        const result = await Wishlist.findOneAndUpdate(
            { userId: req.user._id },
            { userId: req.user._id, items: wishlist },
            { new: true, upsert: true }
        );

        return res.json({ ok: true, wishlist: result.items });
    } catch (err) {
        return res.status(500).json({ ok: false, message: err.message });
    }
});

module.exports = router;
