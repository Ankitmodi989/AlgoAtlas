const mongoose = require('mongoose');
// ok this is the schema for the platform data model, which will be used to store the user's handles and stats for different competitive programming platforms. The schema includes a reference to the user model, ensuring that each user can only have one set of platform data. The handles field is an object that contains the user's handles for LeetCode, Codeforces, and CodeChef, with default values set to empty strings. The stats field is an object that can store any additional statistics related to the user's performance on these platforms. The schema also includes timestamps to track when each document is created and last updated.
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
