const mongoose = require('mongoose');

const PlatformDataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true
    },
    handles: {
        leetcode: { type: String, default: '' },
        codeforces: { type: String, default: '' },
        codechef: { type: String, default: '' }
    },
    stats: {
        type: Object,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('platformData', PlatformDataSchema);
