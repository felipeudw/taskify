import {type ReactNode, useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useTaskStore} from '../../store/useTaskStore';
import type {ColumnType} from '../../types/task';

export default function AddTaskModal({children}: { children: ReactNode }) {
    const addTask = useTaskStore((s) => s.addTask);
    const [open, setOpen] = useState(false);

    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [column, setColumn] = useState<ColumnType>('inbox');

    const handleAdd = () => {
        if (!title.trim()) return;
        addTask(title, column, priority);
        setTitle('');
        setPriority('medium');
        setColumn('inbox');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>Create a task and assign it to a column.</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3 py-4">
                    <Input
                        placeholder="Task title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as any)}
                            className="border rounded p-2 flex-1"
                        >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                        </select>
                        <select
                            value={column}
                            onChange={(e) => setColumn(e.target.value as ColumnType)}
                            className="border rounded p-2 flex-1"
                        >
                            <option value="inbox">Inbox</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="upcoming">Upcoming</option>
                        </select>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleAdd}>Add Task</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
