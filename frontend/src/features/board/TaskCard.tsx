import type {Task} from '../../types/task';
import {GripVertical, Trash2, CheckCircle, Circle} from 'lucide-react';
import {useTaskStore} from '../../store/useTaskStore';
import {cn} from '../../lib/utils';
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';

interface TaskCardProps {
    task: Task;
    dragging?: boolean;
}

export default function TaskCard({task, dragging = false}: TaskCardProps) {
    const deleteTask = useTaskStore((s) => s.deleteTask);
    const toggleDone = useTaskStore((s) => s.toggleDone);

    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({
        id: task.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const priorityColor =
        task.priority === 'high'
            ? 'border-red-500/50'
            : task.priority === 'medium'
                ? 'border-amber-500/50'
                : 'border-emerald-500/50';


    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'relative group bg-background border rounded-lg p-3 flex items-center justify-between transition hover:shadow-md',
                dragging && 'opacity-50',
                `border-r-8 ${priorityColor}` // Cool priority bar
            )}
        >
            {/* Left: Drag handle + Done */}
            <div className="flex items-center gap-2">
                {!dragging && (
                    <button
                        {...listeners}
                        {...attributes}
                        className="cursor-grab text-gray-400 hover:text-gray-600"
                    >
                        <GripVertical size={16}/>
                    </button>
                )}

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleDone(task.id);
                    }}
                    className="transition-opacity"
                >
                    {task.done ? (
                        <CheckCircle size={18} className="text-green-600"/>
                    ) : (
                        <Circle size={18} className="text-gray-400 hover:text-green-500"/>
                    )}
                </button>
            </div>

            {/* Task Title */}
            <div className="flex-1 px-3 text-sm break-words">
                <h3 className={cn(
                    'font-medium text-gray-900 dark:text-gray-100', // ✅ softer for dark mode
                    task.done && 'line-through text-gray-400 dark:text-gray-500'
                )}>
                    {task.title}
                </h3>
                {task.dueDate && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">{task.dueDate}</p>
                )}
            </div>

            {/* Delete Button */}
            {!dragging && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                >
                    <Trash2 size={18}/>
                </button>
            )}
        </div>
    );
}