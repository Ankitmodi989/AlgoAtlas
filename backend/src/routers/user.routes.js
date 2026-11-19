const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Task = require('../models/task.model');
const authMiddleware = require('../middlewares/auth.middleware');

// All user routes require authentication
router.use(authMiddleware);

// ==========================================
// WISHLIST / FAVORITES ROUTES
// ==========================================

// Get user's wishlist
router.get('/wishlist', async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('wishlist');
        return res.status(200).json({
            ok: true,
            wishlist: user?.wishlist || []
        });
    } catch (err) {
        console.error('Error fetching wishlist:', err);
        return res.status(500).json({ ok: false, message: 'Failed to fetch wishlist' });
    }
});

// Toggle an algorithm in wishlist
router.post('/wishlist/toggle', async (req, res) => {
    try {
        const { algoId } = req.body;
        if (!algoId) {
            return res.status(400).json({ ok: false, message: 'algoId is required' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ ok: false, message: 'User not found' });
        }

        if (!Array.isArray(user.wishlist)) {
            user.wishlist = [];
        }

        const index = user.wishlist.indexOf(algoId);
        let isFavorite = false;

        if (index > -1) {
            user.wishlist.splice(index, 1);
            isFavorite = false;
        } else {
            user.wishlist.push(algoId);
            isFavorite = true;
        }

        await user.save();

        return res.status(200).json({
            ok: true,
            message: isFavorite ? 'Added to wishlist' : 'Removed from wishlist',
            wishlist: user.wishlist,
            isFavorite
        });
    } catch (err) {
        console.error('Error toggling wishlist:', err);
        return res.status(500).json({ ok: false, message: 'Failed to update wishlist' });
    }
});

// Replace / update full wishlist
router.put('/wishlist', async (req, res) => {
    try {
        const { wishlist } = req.body;
        if (!Array.isArray(wishlist)) {
            return res.status(400).json({ ok: false, message: 'wishlist must be an array' });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { wishlist } },
            { new: true }
        ).select('wishlist');

        return res.status(200).json({
            ok: true,
            message: 'Wishlist updated successfully',
            wishlist: user?.wishlist || []
        });
    } catch (err) {
        console.error('Error updating wishlist:', err);
        return res.status(500).json({ ok: false, message: 'Failed to update wishlist' });
    }
});

// ==========================================
// DSA PRACTICE TRACKER ROUTES
// ==========================================

// Helper to build task search filter
function getTaskFilter(taskId, userId) {
    if (mongoose.Types.ObjectId.isValid(taskId)) {
        return {
            userId,
            $or: [{ _id: taskId }, { customId: taskId }]
        };
    }
    return {
        userId,
        customId: taskId
    };
}

// Get all tasks for current user
router.get('/tracker', async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json({
            ok: true,
            tasks: tasks.map(t => t.toJSON())
        });
    } catch (err) {
        console.error('Error fetching tracker tasks:', err);
        return res.status(500).json({ ok: false, message: 'Failed to fetch tracker tasks' });
    }
});

// Create a new task
router.post('/tracker', async (req, res) => {
    try {
        const { title, tag, difficulty, status, note, link, id } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ ok: false, message: 'Title is required' });
        }

        const newTask = await Task.create({
            userId: req.user._id,
            title: title.trim(),
            tag: tag || 'Array',
            difficulty: difficulty || 'Easy',
            status: status || 'To Do',
            note: note || '',
            link: link || '',
            customId: id || undefined,
            createdAt: req.body.createdAt || Date.now()
        });

        return res.status(201).json({
            ok: true,
            message: 'Task created successfully',
            task: newTask.toJSON()
        });
    } catch (err) {
        console.error('Error creating task:', err);
        return res.status(500).json({ ok: false, message: err.message || 'Failed to create task' });
    }
});

// Update an existing task
router.put('/tracker/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const updateData = {};
        const allowedFields = ['title', 'tag', 'difficulty', 'status', 'note', 'link'];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        const filter = getTaskFilter(taskId, req.user._id);

        let task = await Task.findOneAndUpdate(
            filter,
            { $set: updateData },
            { new: true }
        );

        if (!task) {
            // If task wasn't in DB yet (e.g. from local sample/storage), create it
            if (req.body.title) {
                task = await Task.create({
                    userId: req.user._id,
                    customId: taskId,
                    title: req.body.title,
                    tag: req.body.tag || 'Array',
                    difficulty: req.body.difficulty || 'Easy',
                    status: req.body.status || 'To Do',
                    note: req.body.note || '',
                    link: req.body.link || '',
                    createdAt: req.body.createdAt || Date.now()
                });
            } else {
                return res.status(404).json({ ok: false, message: 'Task not found' });
            }
        }

        return res.status(200).json({
            ok: true,
            message: 'Task updated successfully',
            task: task.toJSON()
        });
    } catch (err) {
        console.error('Error updating task:', err);
        return res.status(500).json({ ok: false, message: 'Failed to update task' });
    }
});

// Delete a task
router.delete('/tracker/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const filter = getTaskFilter(taskId, req.user._id);

        const deleted = await Task.findOneAndDelete(filter);

        return res.status(200).json({
            ok: true,
            message: deleted ? 'Task deleted successfully' : 'Task not found or already deleted'
        });
    } catch (err) {
        console.error('Error deleting task:', err);
        return res.status(500).json({ ok: false, message: 'Failed to delete task' });
    }
});

// Sync / bulk upsert tasks (e.g. migrating local tasks to database)
router.post('/tracker/sync', async (req, res) => {
    try {
        const { tasks } = req.body;
        if (!Array.isArray(tasks)) {
            return res.status(400).json({ ok: false, message: 'tasks must be an array' });
        }

        for (const item of tasks) {
            if (!item.title) continue;
            const customId = item.id || item.customId;
            const filter = customId
                ? { userId: req.user._id, $or: [{ customId }, { title: item.title }] }
                : { userId: req.user._id, title: item.title };

            await Task.findOneAndUpdate(
                filter,
                {
                    $setOnInsert: {
                        userId: req.user._id,
                        customId: customId,
                        createdAt: item.createdAt || Date.now()
                    },
                    $set: {
                        title: item.title,
                        tag: item.tag || 'Array',
                        difficulty: item.difficulty || 'Easy',
                        status: item.status || 'To Do',
                        note: item.note || '',
                        link: item.link || ''
                    }
                },
                { upsert: true, new: true }
            );
        }

        const allTasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });

        return res.status(200).json({
            ok: true,
            message: 'Tasks synced successfully with database',
            tasks: allTasks.map(t => t.toJSON())
        });
    } catch (err) {
        console.error('Error syncing tracker tasks:', err);
        return res.status(500).json({ ok: false, message: 'Failed to sync tasks' });
    }
});

module.exports = router;
