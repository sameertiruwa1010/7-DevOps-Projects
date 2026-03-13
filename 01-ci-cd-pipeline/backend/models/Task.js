const mongoose = require('mongoose');

const PRIORITIES = ['low', 'medium', 'high'];
const CATEGORIES = ['general', 'work', 'personal', 'shopping', 'health'];

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: { values: PRIORITIES, message: 'Priority must be low, medium, or high' },
      default: 'medium',
    },
    category: {
      type: String,
      enum: { values: CATEGORIES, message: `Category must be one of: ${CATEGORIES.join(', ')}` },
      default: 'general',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => v.length <= 10,
        message: 'Cannot have more than 10 tags',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: is overdue
taskSchema.virtual('isOverdue').get(function () {
  if (!this.dueDate || this.completed) return false;
  return new Date() > this.dueDate;
});

// Pre-save: set completedAt when task is completed
taskSchema.pre('save', function (next) {
  if (this.isModified('completed')) {
    this.completedAt = this.completed ? new Date() : null;
  }
  next();
});

// Pre-findOneAndUpdate: set completedAt
taskSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.completed === true) {
    update.completedAt = new Date();
  } else if (update.completed === false) {
    update.completedAt = null;
  }
  next();
});

// Indexes for performance
taskSchema.index({ completed: 1, createdAt: -1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ category: 1 });
taskSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Task', taskSchema);
