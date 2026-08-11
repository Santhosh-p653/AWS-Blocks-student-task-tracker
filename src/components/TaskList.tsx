import React from 'react';
import type { Task } from '../types.js';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string, completed: boolean) => Promise<void>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => Promise<void>;
  isLoading: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  isLoading,
}) => {
  if (tasks.length === 0) {
    return (
      <div style={styles.emptyState}>
        <span style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}>📝</span>
        <p style={{ color: '#6b7280', fontSize: '1rem', fontWeight: 500 }}>No tasks found</p>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Add your first task above to get started!</p>
      </div>
    );
  }

  return (
    <div style={styles.listContainer}>
      {tasks.map((task) => (
        <div
          key={task.id}
          style={{
            ...styles.card,
            borderLeft: task.completed ? '4px solid #10b981' : '4px solid #6366f1',
            opacity: task.completed ? 0.85 : 1,
          }}
        >
          <div style={styles.taskLeft}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id, !task.completed)}
              disabled={isLoading}
              style={styles.checkbox}
            />
            <div style={styles.textContainer}>
              <span
                style={{
                  ...styles.title,
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? '#6b7280' : '#111827',
                }}
              >
                {task.title}
              </span>
              <span style={styles.timestamp}>
                {new Date(task.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          <div style={styles.actions}>
            <button
              onClick={() => onEditTask(task)}
              disabled={isLoading}
              style={styles.editBtn}
              title="Edit Task"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => onDeleteTask(task.id)}
              disabled={isLoading}
              style={styles.deleteBtn}
              title="Delete Task"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '1rem 1.25rem',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    transition: 'all 0.2s ease',
  },
  taskLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flex: 1,
  },
  checkbox: {
    width: '1.25rem',
    height: '1.25rem',
    cursor: 'pointer',
    accentColor: '#10b981',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  title: {
    fontSize: '1.05rem',
    fontWeight: 500,
    lineHeight: 1.4,
    wordBreak: 'break-word',
  },
  timestamp: {
    fontSize: '0.75rem',
    color: '#9ca3af',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  editBtn: {
    padding: '0.4rem 0.75rem',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    color: '#374151',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  deleteBtn: {
    padding: '0.4rem 0.75rem',
    borderRadius: '6px',
    border: '1px solid #fee2e2',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
};
