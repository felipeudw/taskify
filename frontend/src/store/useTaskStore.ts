import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import type {Task, ColumnType} from '../types/task';
import {nanoid} from 'nanoid';

interface TaskStore {
    tasks: Task[];
    addTask: (title: string, column: ColumnType, priority: 'low' | 'medium' | 'high', dueDate?: string) => void;
    moveTask: (taskId: string, newColumn: ColumnType, beforeTaskId?: string) => void;
    deleteTask: (taskId: string) => void;
    getTasksByColumn: (column: ColumnType) => Task[];
    toggleDone: (taskId: string) => void;
    reorderTask: (fromIndex: number, toIndex: number, columnId: ColumnType) => void;
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
            moveTask: (taskId, newColumn, beforeTaskId?) =>
                set((state) => {
                    const updatedTasks = state.tasks.map((t) =>
                        t.id === taskId ? { ...t, column: newColumn } : t
                    );

                    // ✅ If beforeTaskId is provided, reorder after moving
                    if (beforeTaskId) {
                        const targetIndex = updatedTasks.findIndex((t) => t.id === beforeTaskId);
                        const movingIndex = updatedTasks.findIndex((t) => t.id === taskId);
                        const [movedTask] = updatedTasks.splice(movingIndex, 1);
                        updatedTasks.splice(targetIndex, 0, movedTask);
                    }

                    return { tasks: updatedTasks };
                }),
            deleteTask: (taskId) =>
                set((state) => ({
                    tasks: state.tasks.filter((t) => t.id !== taskId),
                })),
            getTasksByColumn: (column) => get().tasks.filter((t) => t.column === column),
            toggleDone: (taskId) =>
                set((state) => ({
                    tasks: state.tasks.map((t) =>
                        t.id === taskId ? {...t, done: !t.done} : t
                    ),
                })),
            reorderTask: (fromIndex, toIndex, columnId) =>
                set((state) => {
                    const tasksInColumn = state.tasks.filter((t) => t.column === columnId);
                    const updatedColumnTasks = [...tasksInColumn];
                    const [movedTask] = updatedColumnTasks.splice(fromIndex, 1);
                    updatedColumnTasks.splice(toIndex, 0, movedTask);

                    const remainingTasks = state.tasks.filter((t) => t.column !== columnId);
                    return { tasks: [...remainingTasks, ...updatedColumnTasks] };
                }),
        }),
        {name: 'taskify-store'}
    )
);
