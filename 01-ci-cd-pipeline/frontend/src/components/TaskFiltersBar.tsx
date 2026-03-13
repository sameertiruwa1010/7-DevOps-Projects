import React, { useState, useRef, useEffect } from 'react';
import { TaskFilters, Priority, Category } from '../types/Task';
import './TaskFiltersBar.css';

interface Props {
  filters: TaskFilters;
  onFilterChange: (f: TaskFilters) => void;
  total: number;
}

const PRIORITIES: Priority[] = ['low', 'medium', 'high'];
const CATEGORIES: Category[] = ['general', 'work', 'personal', 'shopping', 'health'];

const TaskFiltersBar: React.FC<Props> = ({ filters, onFilterChange, total }) => {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      onFilterChange({ ...filters, search: value || undefined });
    }, 350);
  };

  useEffect(() => () => clearTimeout(searchTimer.current), []);

  const setFilter = (key: keyof TaskFilters, value: any) => {
    const updated = { ...filters };
    if (updated[key] === value || !value) {
      delete updated[key];
    } else {
      (updated as any)[key] = value;
    }
    onFilterChange(updated);
  };

  const clearAll = () => {
    setSearchValue('');
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(filters).some((k) => filters[k as keyof TaskFilters]);
  const activeCount = Object.keys(filters).filter((k) => filters[k as keyof TaskFilters]).length;

  return (
    <div className="filters-bar">
      <div className="filters-row">
        {/* Search */}
        <div className="filter-search-wrap">
          <span className="filter-search-icon" aria-hidden>⌕</span>
          <input
            type="search"
            className="filter-search"
            placeholder="Search tasks…"
            value={searchValue}
            onChange={handleSearch}
            aria-label="Search tasks"
          />
        </div>

        {/* Status filter */}
        <div className="filter-group">
          {(['all', 'pending', 'done'] as const).map((s) => {
            const value = s === 'pending' ? 'false' : s === 'done' ? 'true' : undefined;
            const active = s === 'all' ? !filters.completed : filters.completed === value;
            return (
              <button
                key={s}
                className={`filter-chip ${active ? 'active' : ''}`}
                onClick={() => setFilter('completed', value)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Priority filter */}
        <div className="filter-group">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              className={`filter-chip filter-chip-priority priority-${p} ${filters.priority === p ? 'active' : ''}`}
              onClick={() => setFilter('priority', p)}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Clear */}
        {hasActiveFilters && (
          <button className="filter-clear" onClick={clearAll}>
            Clear {activeCount > 0 && `(${activeCount})`}
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="filter-count">
        {total} {total === 1 ? 'task' : 'tasks'}
        {hasActiveFilters && ' found'}
      </p>
    </div>
  );
};

export default TaskFiltersBar;
