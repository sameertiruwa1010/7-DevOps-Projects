import React from 'react';
import { TaskStats } from '../types/Task';
import './StatsBar.css';

interface StatsBarProps {
  stats: TaskStats | null;
  loading: boolean;
}

const StatsBar: React.FC<StatsBarProps> = ({ stats, loading }) => {
  if (loading || !stats) return null;

  const items = [
    { label: 'Total', value: stats.total, color: 'var(--text-secondary)' },
    { label: 'Pending', value: stats.pending, color: 'var(--warning)' },
    { label: 'Completed', value: stats.completed, color: 'var(--success)' },
    { label: 'Overdue', value: stats.overdue, color: 'var(--danger)' },
  ];

  return (
    <div className="stats-bar">
      <div className="stats-items">
        {items.map((item) => (
          <div key={item.label} className="stats-item">
            <span className="stats-value" style={{ color: item.color }}>
              {item.value}
            </span>
            <span className="stats-label">{item.label}</span>
          </div>
        ))}
      </div>

      {stats.total > 0 && (
        <div className="stats-progress-wrap">
          <div className="stats-progress-bar">
            <div
              className="stats-progress-fill"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
          <span className="stats-progress-label">{stats.completionRate}%</span>
        </div>
      )}
    </div>
  );
};

export default StatsBar;
