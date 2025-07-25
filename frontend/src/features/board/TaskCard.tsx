import {useDraggable} from '@dnd-kit/core';
import type {Task} from '../../types/task';
import {X} from 'lucide-react';
import {useTaskStore} from '../../store/useTaskStore';

export default function TaskCard({task}: { task: Task }) {
    const deleteTask = useTaskStore((s) => s.deleteTask);
    const {attributes, listeners, setNodeRef, transform} = useDraggable({id: task.id});

    const style = transform ? {transform: `translate(${transform.x}px, ${transform.y}px)`} : undefined;
    const color =
        task.priority === 'high'
            ? 'bg-red-500'
            : task.priority === 'medium'
                ? 'bg-yellow-500'
                : 'bg-green-500';

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            className="bg-background border rounded-lg p-2 flex justify-between items-center cursor-grab"
        >
            <div>
                <h3 className="font-medium">{task.title}</h3>
                {task.dueDate && <p className="text-xs text-gray-500">{task.dueDate}</p>}
            </div>
            <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${color}`}></span>
                <button
                    onClick={(e) => {
                        deleteTask(task.id);
                    }}
                >
                    <X size={16}/>
                </button>
            </div>
        </div>
    );
}
