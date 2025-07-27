import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {GripVertical, Trash2, CheckCircle, Circle} from "lucide-react";
import {cn} from "../../lib/utils";
import {priorityBorderColors} from "../../constants/ui";
import type {Task} from "@/api/taskApi";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteTaskApi, toggleTaskApi} from "@/api/taskApi";

interface TaskCardProps {
    task: Task;
    dragging?: boolean;
}

export default function TaskCard({task, dragging = false}: TaskCardProps) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: () => deleteTaskApi(task.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", task.boardId] });
        },
    });

    const toggleMutation = useMutation({
        mutationFn: () => toggleTaskApi(task.id, !task.done),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['tasks', task.boardId] });

            const previousTasks = queryClient.getQueryData<Task[]>(['tasks', task.boardId]);

            // Optimistic update
            queryClient.setQueryData(['tasks', task.boardId], (old: Task[] = []) =>
                old.map((t) => (t.id === task.id ? { ...t, done: !task.done } : t))
            );

            return { previousTasks };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(['tasks', task.boardId], context.previousTasks);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', task.boardId] });
        },
    });

    const {attributes, listeners, setNodeRef, transform, transition} =
        useSortable({id: task.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const priorityColor =
        task.priority === "high"
            ? priorityBorderColors.high
            : task.priority === "medium"
                ? priorityBorderColors.medium
                : priorityBorderColors.low;

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
                        <GripVertical size={16}/>
                    </button>
                )}

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleMutation.mutate();
                    }}
                    disabled={toggleMutation.isLoading}
                    className="transition-colors"
                >
                    {task.done ? (
                        <CheckCircle
                            size={18}
                            className="text-green-500 dark:text-green-400"
                        />
                    ) : (
                        <Circle
                            size={18}
                            className="text-muted-foreground hover:text-green-500"
                        />
                    )}
                </button>
            </div>

            {/* Task Title */}
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

            {/* Delete Button */}
            {!dragging && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteMutation.mutate();
                    }}
                    disabled={deleteMutation.isLoading}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                >
                    <Trash2 size={18}/>
                </button>
            )}
        </div>
    );
}
