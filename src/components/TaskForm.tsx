import React, { useState, useEffect } from 'react';
import type { Task } from '../types.js';

interface TaskFormProps {
  onAddTask: (title: string) => Promise<void>;
  editingTask: Task | null;
  onUpdateTask: (id: string, title: string) => Promise<void>;
  onCancelEdit: () => void;
  isLoading: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onAddTask,
  editingTask,
  onUpdateTask,
  onCancelEdit,
  isLoading,
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
    } else {
      setTitle('');
    }
  }, [editingTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || isLoading) return;

    if (editingTask) {
      await onUpdateTask(editingTask.id, trimmed);
    } else {
      await onAddTask(trimmed);
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="Enter student task (e.g. Complete Lab 3, Study AWS blocks)..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isLoading}
        style={styles.input}
      />
      <button
        type="submit"
        disabled={isLoading || !title.trim()}
        style={{
          ...styles.button,
          backgroundColor: editingTask ? '#2563eb' : '#4f46e5',
        }}
      >
        {isLoading ? 'Saving...' : editingTask ? 'Update Task' : 'Add Task'}
      </button>
      {editingTask && (
        <button
          type="button"
          onClick={onCancelEdit}
          disabled={isLoading}
          style={styles.cancelButton}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

const styles: Record<string, React.CSSProperties> = {
  form: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  input: {
    flex: 1,
    minWidth: '240px',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s',
  },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    border: 'none',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s, opacity 0.2s',
  },
  cancelButton: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    backgroundColor: '#f9fafb',
    color: '#4b5563',
    fontWeight: 500,
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
};
