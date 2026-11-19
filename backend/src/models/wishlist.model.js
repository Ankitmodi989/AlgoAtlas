const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true
    },
    items: {
        type: [String],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('wishlist', WishlistSchema);
