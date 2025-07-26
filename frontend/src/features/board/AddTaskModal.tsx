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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useTaskStore} from '../../store/useTaskStore';
import type {ColumnType} from '../../types/task';
import { priorityColors } from '../../constants/ui'

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
                        <Select value={priority} onValueChange={(value) => setPriority(value as any)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full ${priorityColors.low}`} />
                                        Low Priority
                                    </div>
                                </SelectItem>
                                <SelectItem value="medium">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full ${priorityColors.medium}`} />
                                        Normal Priority
                                    </div>
                                </SelectItem>
                                <SelectItem value="high">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full ${priorityColors.high}`} />
                                        High Priority
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={column} onValueChange={(value) => setColumn(value as ColumnType)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Column"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="inbox">Inbox</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="week">This Week</SelectItem>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleAdd}>Add Task</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
