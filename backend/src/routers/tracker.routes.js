const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/task.model');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();
router.use(authMiddleware);

function taskFilter(id, userId) {
    if (mongoose.Types.ObjectId.isValid(id)) {
        return { userId, $or: [{ _id: id }, { customId: id }] };
    }
    return { userId, customId: id };
}

function taskData(item, userId, customId) {
    return {
        userId,
        customId,
        title: item.title,
        tag: item.tag || 'Array',
        difficulty: item.difficulty || 'Easy',
        status: item.status || 'To Do',
        note: item.note || '',
        link: item.link || '',
        createdAt: item.createdAt || Date.now()
    };
}

router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
        return res.json({ ok: true, tasks: tasks.map(task => task.toJSON()) });
    } catch (err) {
        return res.status(500).json({ ok: false, message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.body.title?.trim()) {
            return res.status(400).json({ ok: false, message: 'Title is required' });
        }

        const task = await Task.create(
            taskData({ ...req.body, title: req.body.title.trim() }, req.user._id, req.body.id)
        );
        return res.status(201).json({ ok: true, task: task.toJSON() });
    } catch (err) {
        return res.status(500).json({ ok: false, message: err.message });
    }
});

router.post('/sync', async (req, res) => {
    try {
        if (!Array.isArray(req.body.tasks)) {
            return res.status(400).json({ ok: false, message: 'tasks must be an array' });
        }

        for (const item of req.body.tasks) {
            if (!item.title) continue;

            const customId = item.id || item.customId;
            const filter = customId
                ? { userId: req.user._id, $or: [{ customId }, { title: item.title }] }
                : { userId: req.user._id, title: item.title };

            await Task.findOneAndUpdate(
                filter,
                { $set: taskData(item, req.user._id, customId) },
                { upsert: true }
            );
        }

        const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
        return res.json({ ok: true, tasks: tasks.map(task => task.toJSON()) });
    } catch (err) {
        return res.status(500).json({ ok: false, message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updates = {};
        ['title', 'tag', 'difficulty', 'status', 'note', 'link'].forEach(field => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        let task = await Task.findOneAndUpdate(
            taskFilter(req.params.id, req.user._id),
            updates,
            { new: true }
        );

        if (!task && req.body.title) {
            task = await Task.create(taskData(req.body, req.user._id, req.params.id));
        }

        if (!task) {
            return res.status(404).json({ ok: false, message: 'Task not found' });
        }

        return res.json({ ok: true, task: task.toJSON() });
    } catch (err) {
        return res.status(500).json({ ok: false, message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Task.findOneAndDelete(
            taskFilter(req.params.id, req.user._id)
        );
        return res.json({
            ok: true,
            message: deleted ? 'Task deleted successfully' : 'Task not found'
        });
    } catch (err) {
        return res.status(500).json({ ok: false, message: err.message });
    }
});

module.exports = router;
