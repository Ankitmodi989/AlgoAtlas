const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
            index: true
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true
        },
        tag: {
            type: String,
            default: 'Array',
            trim: true
        },
        difficulty: {
            type: String,
            enum: ['Easy', 'Medium', 'Hard'],
            default: 'Easy'
        },
        status: {
            type: String,
            enum: ['To Do', 'In Progress', 'Done'],
            default: 'To Do'
        },
        note: {
            type: String,
            default: '',
            trim: true
        },
        link: {
            type: String,
            default: '',
            trim: true
        },
        customId: {
            type: String,
            index: true
        },
        createdAt: {
            type: Number,
            default: () => Date.now()
        }
    },
    {
        timestamps: true
    }
);

// Map _id or customId to `id` for seamless frontend compatibility
TaskSchema.methods.toJSON = function () {
    const obj = this.toObject();
    obj.id = obj.customId || obj._id.toString();
    return obj;
};

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
