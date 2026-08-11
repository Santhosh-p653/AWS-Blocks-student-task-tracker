import React, { useEffect, useState } from 'react';
import { api } from 'aws-blocks';
import type { Task } from './types.js';
import { TaskForm } from './components/TaskForm.js';
import { TaskList } from './components/TaskList.js';

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setError(null);
      const list = await api.getTasks();
      setTasks(list || []);
    } catch (err: any) {
      console.error('Failed to fetch tasks:', err);
      setError(err?.message || 'Failed to connect to AWS Blocks backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (title: string) => {
    setActionLoading(true);
    try {
      setError(null);
      const newTask = await api.addTask(title);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err: any) {
      console.error('Failed to add task:', err);
      setError(err?.message || 'Failed to add task.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateTask = async (id: string, title: string) => {
    setActionLoading(true);
    try {
      setError(null);
      const updated = await api.updateTask(id, { title });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setEditingTask(null);
    } catch (err: any) {
      console.error('Failed to update task:', err);
      setError(err?.message || 'Failed to update task.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    setActionLoading(true);
    try {
      setError(null);
      const updated = await api.updateTask(id, { completed });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err: any) {
      console.error('Failed to toggle task:', err);
      setError(err?.message || 'Failed to update task status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    setActionLoading(true);
    try {
      setError(null);
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (editingTask?.id === id) {
        setEditingTask(null);
      }
    } catch (err: any) {
      console.error('Failed to delete task:', err);
      setError(err?.message || 'Failed to delete task.');
    } finally {
      setActionLoading(false);
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.badge}>AWS Blocks + React</div>
        <h1 style={styles.heading}>📚 Student Task Manager</h1>
        <p style={styles.subtitle}>
          Track your assignments, homework, and study goals with persistent cloud storage.
        </p>

        {tasks.length > 0 && (
          <div style={styles.statsBar}>
            <div style={styles.statItem}>
              Total: <strong>{tasks.length}</strong>
            </div>
            <div style={styles.statItem}>
              Completed: <strong>{completedCount}</strong> / {tasks.length}
            </div>
            <div style={styles.statItem}>
              Pending: <strong>{tasks.length - completedCount}</strong>
            </div>
          </div>
        )}
      </header>

      {error && (
        <div style={styles.errorBanner}>
          <span>⚠️ {error}</span>
          <button onClick={fetchTasks} style={styles.retryBtn}>
            Retry
          </button>
        </div>
      )}

      <main style={styles.main}>
        <TaskForm
          onAddTask={handleAddTask}
          editingTask={editingTask}
          onUpdateTask={handleUpdateTask}
          onCancelEdit={() => setEditingTask(null)}
          isLoading={actionLoading}
        />

        {loading ? (
          <div style={styles.loadingState}>
            <p>Loading tasks from AWS Blocks...</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onEditTask={(task) => setEditingTask(task)}
            onDeleteTask={handleDeleteTask}
            isLoading={actionLoading}
          />
        )}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '2.5rem 1rem',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-block',
    padding: '0.3rem 0.8rem',
    borderRadius: '9999px',
    backgroundColor: '#ede9fe',
    color: '#6d28d9',
    fontSize: '0.8rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
    letterSpacing: '0.025em',
  },
  heading: {
    fontSize: '2.25rem',
    fontWeight: 800,
    color: '#1e1b4b',
    marginBottom: '0.5rem',
    letterSpacing: '-0.025em',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '1rem',
    maxWidth: '500px',
    margin: '0 auto',
  },
  statsBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    marginTop: '1.25rem',
    padding: '0.75rem 1rem',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  statItem: {
    fontSize: '0.9rem',
    color: '#4b5563',
  },
  main: {
    width: '100%',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.875rem 1.25rem',
    borderRadius: '8px',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    marginBottom: '1.5rem',
    fontSize: '0.925rem',
  },
  retryBtn: {
    padding: '0.25rem 0.6rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    fontWeight: 600,
    cursor: 'pointer',
  },
  loadingState: {
    textAlign: 'center',
    padding: '3rem',
    color: '#6b7280',
    fontSize: '1.05rem',
  },
};
