import React, { useState } from 'react';
import { CreateTaskPayload, Task, Priority, Category } from '../types/Task';
import './TaskForm.css';

interface Props {
  initialValues?: Task;
  onSubmit: (payload: CreateTaskPayload) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
}

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];
const CATEGORIES: Category[] = ['general', 'work', 'personal', 'shopping', 'health'];

const TaskForm: React.FC<Props> = ({ initialValues, onSubmit, onCancel, isEditing }) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [priority, setPriority] = useState<Priority>(initialValues?.priority || 'medium');
  const [category, setCategory] = useState<Category>(initialValues?.category || 'general');
  const [dueDate, setDueDate] = useState(
    initialValues?.dueDate ? initialValues.dueDate.split('T')[0] : ''
  );
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialValues?.tags || []);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (title.length > 200) errs.title = 'Title too long (max 200 chars)';
    if (description.length > 2000) errs.description = 'Description too long (max 2000 chars)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        dueDate: dueDate || null,
        tags,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      {/* Title */}
      <div className="form-field">
        <label className="form-label" htmlFor="task-title">
          Title <span className="form-required">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          className={`form-input ${errors.title ? 'input-error' : ''}`}
          value={title}
          onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: '' })); }}
          placeholder="What needs to be done?"
          maxLength={200}
          autoFocus
        />
        {errors.title && <p className="form-error">{errors.title}</p>}
        <p className="form-hint">{title.length}/200</p>
      </div>

      {/* Description */}
      <div className="form-field">
        <label className="form-label" htmlFor="task-desc">Description</label>
        <textarea
          id="task-desc"
          className={`form-textarea ${errors.description ? 'input-error' : ''}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details…"
          rows={3}
          maxLength={2000}
        />
        {errors.description && <p className="form-error">{errors.description}</p>}
      </div>

      {/* Priority & Category */}
      <div className="form-row">
        <div className="form-field">
          <label className="form-label">Priority</label>
          <div className="form-chip-group">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                className={`form-chip priority-chip priority-${p} ${priority === p ? 'selected' : ''}`}
                onClick={() => setPriority(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="task-category">Category</label>
          <select
            id="task-category"
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div className="form-field">
        <label className="form-label" htmlFor="task-due">Due Date</label>
        <input
          id="task-due"
          type="date"
          className="form-input"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Tags */}
      <div className="form-field">
        <label className="form-label" htmlFor="task-tags">Tags</label>
        <div className="form-tags-input-wrap">
          {tags.map((tag) => (
            <span key={tag} className="form-tag">
              #{tag}
              <button
                type="button"
                className="form-tag-remove"
                onClick={() => removeTag(tag)}
                aria-label={`Remove tag ${tag}`}
              >✕</button>
            </span>
          ))}
          {tags.length < 10 && (
            <input
              id="task-tags"
              type="text"
              className="form-tag-input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={addTag}
              placeholder={tags.length === 0 ? 'Add tags…' : ''}
            />
          )}
        </div>
        <p className="form-hint">Press Enter or comma to add a tag ({tags.length}/10)</p>
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button type="button" className="tm-btn tm-btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className="tm-btn tm-btn-primary"
          disabled={submitting || !title.trim()}
        >
          {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
