import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, CheckCircle, Circle } from "lucide-react";
import { useTaskStore } from "../../store/useTaskStore";
import type { Task } from "../../types/task";
import { cn } from "../../lib/utils";

interface TaskCardProps {
    task: Task;
    dragging?: boolean;
}

export default function TaskCard({ task, dragging = false }: TaskCardProps) {
    const deleteTask = useTaskStore((s) => s.deleteTask);
    const toggleDone = useTaskStore((s) => s.toggleDone);

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: task.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // ✅ Priority color as a subtle right border
    const priorityColor =
        task.priority === "high"
            ? "border-red-500/60 dark:border-red-400/70"
            : task.priority === "medium"
                ? "border-amber-500/60 dark:border-amber-400/70"
                : "border-emerald-500/60 dark:border-emerald-400/70";

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "relative group bg-background border rounded-lg p-4 flex items-center transition-colors hover:shadow-md",
                dragging && "opacity-50",
                `border-r-8 ${priorityColor}`
            )}
        >
            {/* Left: Drag handle + Done toggle */}
            <div className="flex items-center gap-3">
                {!dragging && (
                    <button
                        {...listeners}
                        {...attributes}
                        className="cursor-grab text-muted-foreground hover:text-foreground"
                    >
                        <GripVertical size={16} />
                    </button>
                )}

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleDone(task.id);
                    }}
                    className="transition-colors"
                >
                    {task.done ? (
                        <CheckCircle size={18} className="text-green-500 dark:text-green-400" />
                    ) : (
                        <Circle size={18} className="text-muted-foreground hover:text-green-500" />
                    )}
                </button>
            </div>

            {/* Task Title & Due Date */}
            <div className="flex-1 px-3 text-sm break-words">
                <h3
                    className={cn(
                        "font-medium text-foreground",
                        task.done && "line-through text-muted-foreground"
                    )}
                >
                    {task.title}
                </h3>
                {task.dueDate && (
                    <p className="text-xs text-muted-foreground">{task.dueDate}</p>
                )}
            </div>

            {/* Delete Button (only on hover) */}
            {!dragging && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                >
                    <Trash2 size={18} />
                </button>
            )}
        </div>
    );
}
