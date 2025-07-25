export type ColumnType = 'inbox' | 'today' | 'week' | 'upcoming';

export interface Task {
    id: string;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    column: ColumnType;
}