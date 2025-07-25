import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import type {Task, ColumnType} from '../types/task';
import {nanoid} from 'nanoid';

interface TaskStore {
    tasks: Task[];
    addTask: (title: string, column: ColumnType, priority: 'low' | 'medium' | 'high', dueDate?: string) => void;
    moveTask: (taskId: string, newColumn: ColumnType) => void;
    deleteTask: (taskId: string) => void;
    getTasksByColumn: (column: ColumnType) => Task[];
}

export const useTaskStore = create<TaskStore>()(
    persist(
        (set, get) => ({
            tasks: [
                {id: nanoid(), title: 'Design UI Mockups', priority: 'high', column: 'today'},
                {id: nanoid(), title: 'Prepare Meeting Notes', priority: 'medium', column: 'week'},
                {id: nanoid(), title: 'Update Docs', priority: 'low', column: 'inbox'},
            ],
            addTask: (title, column, priority, dueDate) =>
                set((state) => ({
                    tasks: [...state.tasks, {id: nanoid(), title, priority, column, dueDate}],
                })),
            moveTask: (taskId, newColumn) =>
                set((state) => ({
                    tasks: state.tasks.map((t) => (t.id === taskId ? {...t, column: newColumn} : t)),
                })),
            deleteTask: (taskId) =>
                set((state) => ({
                    tasks: state.tasks.filter((t) => t.id !== taskId),
                })),
            getTasksByColumn: (column) => get().tasks.filter((t) => t.column === column),
        }),
        {name: 'taskify-store'}
    )
);
