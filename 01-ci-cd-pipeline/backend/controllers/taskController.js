const Task = require('../models/Task');
const logger = require('../utils/logger');

// GET /api/tasks
const getTasks = async (req, res, next) => {
  try {
    const {
      completed,
      priority,
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 50,
    } = req.query;

    const filter = {};
    if (completed !== undefined) filter.completed = completed === 'true';
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions = {};
    const allowedSortFields = ['createdAt', 'updatedAt', 'title', 'priority', 'dueDate'];
    if (allowedSortFields.includes(sortBy)) {
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sortOptions).skip(skip).limit(limitNum).lean({ virtuals: true }),
      Task.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/tasks/stats
const getStats = async (req, res, next) => {
  try {
    const [total, completed, overdue, byPriority, byCategory] = await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ completed: true }),
      Task.countDocuments({ completed: false, dueDate: { $lt: new Date() } }),
      Task.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
      Task.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    ]);

    res.json({
      success: true,
      data: {
        total,
        completed,
        pending: total - completed,
        overdue,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        byPriority: Object.fromEntries(byPriority.map((p) => [p._id, p.count])),
        byCategory: Object.fromEntries(byCategory.map((c) => [c._id, c.count])),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/tasks/:id
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).lean({ virtuals: true });
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, category, dueDate, tags } = req.body;
    const task = new Task({ title, description, priority, category, dueDate, tags });
    await task.save();
    logger.info(`Task created: ${task._id}`);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const { title, description, completed, priority, category, dueDate, tags } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (completed !== undefined) updates.completed = completed;
    if (priority !== undefined) updates.priority = priority;
    if (category !== undefined) updates.category = category;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (tags !== undefined) updates.tags = tags;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).lean({ virtuals: true });

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    logger.info(`Task updated: ${task._id}`);
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/tasks/:id/toggle
const toggleTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    task.completed = !task.completed;
    await task.save();
    res.json({ success: true, data: task.toJSON() });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    logger.info(`Task deleted: ${req.params.id}`);
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tasks (bulk delete completed)
const deleteCompletedTasks = async (req, res, next) => {
  try {
    const result = await Task.deleteMany({ completed: true });
    res.json({ success: true, message: `Deleted ${result.deletedCount} completed tasks` });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTasks,
  getStats,
  getTaskById,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  deleteCompletedTasks,
};
