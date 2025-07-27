import {api} from './api';

export interface Task {
    id: string;
    title: string;
    priority: 'low' | 'medium' | 'high';
    column: 'inbox' | 'today' | 'week' | 'upcoming';
}

export interface CreateTaskRequest {
    boardId: string;
    title: string;
    priority: 'low' | 'medium' | 'high';
    column: 'inbox' | 'today' | 'week' | 'upcoming';
}

export const createTask = async (data: CreateTaskRequest) => {
    const res = await api.post('/tasks', data);
    return res.data;
};

export const getTasksByBoard = async (boardId: string) => {
    const res = await api.get(`/tasks/${boardId}`);
    return res.data;
};

export const deleteTaskApi = async (taskId: string) => {
    const res = await api.delete(`/tasks/${taskId}`);
    return res.data;
};

export const toggleTaskApi = async (taskId: string, done: boolean) => {
    const res = await api.patch(`/tasks/${taskId}`, {done});
    return res.data;
};

export const moveTaskApi = async ({
                                      taskId,
                                      newColumn,
                                      newOrder,
                                  }: {
    taskId: string;
    newColumn: string;
    newOrder: number;
}) => {
    const res = await api.patch(`/tasks/${taskId}`, {column: newColumn, order: newOrder});
    return res.data;
};

export const reorderTasksApi = async (updates: { id: string; order: number }[]) => {
    const res = await api.patch('/tasks/reorder', {updates});
    return res.data;
};