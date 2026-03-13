const express = require('express');
const { body, param, query } = require('express-validator');
const { validate } = require('../middleware/validate');
const {
  getTasks,
  getStats,
  getTaskById,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  deleteCompletedTasks,
} = require('../controllers/taskController');

const router = express.Router();

const PRIORITIES = ['low', 'medium', 'high'];
const CATEGORIES = ['general', 'work', 'personal', 'shopping', 'health'];

// Validation rules
const createValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('priority').optional().isIn(PRIORITIES).withMessage(`Priority must be: ${PRIORITIES.join(', ')}`),
  body('category').optional().isIn(CATEGORIES).withMessage(`Category must be: ${CATEGORIES.join(', ')}`),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid date format'),
  body('tags').optional().isArray({ max: 10 }).withMessage('Tags must be an array with max 10 items'),
];

const updateValidation = [
  param('id').isMongoId().withMessage('Invalid task ID'),
  body('title').optional().trim().notEmpty().isLength({ max: 200 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('completed').optional().isBoolean().withMessage('completed must be boolean'),
  body('priority').optional().isIn(PRIORITIES),
  body('category').optional().isIn(CATEGORIES),
  body('dueDate').optional({ nullable: true }).isISO8601(),
  body('tags').optional().isArray({ max: 10 }),
];

const idValidation = [param('id').isMongoId().withMessage('Invalid task ID')];

const queryValidation = [
  query('completed').optional().isBoolean(),
  query('priority').optional().isIn(PRIORITIES),
  query('category').optional().isIn(CATEGORIES),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

// Routes
router.get('/stats', getStats);
router.get('/', queryValidation, validate, getTasks);
router.get('/:id', idValidation, validate, getTaskById);
router.post('/', createValidation, validate, createTask);
router.put('/:id', updateValidation, validate, updateTask);
router.patch('/:id/toggle', idValidation, validate, toggleTask);
router.delete('/completed', deleteCompletedTasks);
router.delete('/:id', idValidation, validate, deleteTask);

module.exports = router;
