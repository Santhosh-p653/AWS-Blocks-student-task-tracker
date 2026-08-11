import { Scope, ApiNamespace, KVStore } from '@aws-blocks/blocks';
import type { Task } from '../src/types.js';

const scope = new Scope('student-task-manager');
const store = new KVStore<Task>(scope, 'tasks');

export const api = new ApiNamespace(scope, 'api', () => ({
  async getTasks(): Promise<Task[]> {
    const tasks: Task[] = [];
    for await (const entry of store.scan()) {
      if (entry.value) {
        tasks.push(entry.value);
      }
    }
    return tasks.sort((a, b) => b.createdAt - a.createdAt);
  },

  async addTask(title: string): Promise<Task> {
    const id = crypto.randomUUID();
    const task: Task = {
      id,
      title: title.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    await store.put(id, task);
    return task;
  },

  async updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task> {
    const existing = await store.get(id);
    if (!existing) {
      throw new Error(`Task with id '${id}' not found`);
    }
    const updated: Task = {
      ...existing,
      ...updates,
    };
    await store.put(id, updated);
    return updated;
  },

  async deleteTask(id: string): Promise<{ success: boolean }> {
    await store.delete(id);
    return { success: true };
  },
}));
