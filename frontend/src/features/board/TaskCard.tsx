import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {GripVertical, Trash2, CheckCircle, Circle, Pencil} from "lucide-react";
import {cn} from "../../lib/utils";
import {priorityBorderColors} from "../../constants/ui";
import type {Task} from "@/api/taskApi";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteTaskApi, toggleTaskApi} from "@/api/taskApi";
import EditTaskModal from "./EditTaskModal";

interface TaskCardProps {
    task: Task;
    dragging?: boolean;
}

export default function TaskCard({task, dragging = false}: TaskCardProps) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: () => deleteTaskApi(task.id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["tasks", task.boardId]});
        },
    });

    const toggleMutation = useMutation({
        mutationFn: () => toggleTaskApi(task.id, !task.done),
        onMutate: async () => {
            await queryClient.cancelQueries({queryKey: ['tasks', task.boardId]});

            const previousTasks = queryClient.getQueryData<Task[]>(['tasks', task.boardId]);

            queryClient.setQueryData(['tasks', task.boardId], (old: Task[] = []) =>
                old.map((t) => (t.id === task.id ? {...t, done: !task.done} : t))
            );

            return {previousTasks};
        },
        onError: (_err, _vars, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(['tasks', task.boardId], context.previousTasks);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ['tasks', task.boardId]});
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
                "relative group bg-background border rounded-lg p-4 flex flex-col justify-between transition-shadow hover:shadow-md",
                dragging && "opacity-50",
                `border-r-8 ${priorityColor}`
            )}
        >
            {/* Drag handle */}
            <div className="absolute top-2 left-2">
                {!dragging && (
                    <button
                        {...listeners}
                        {...attributes}
                        className="cursor-grab text-muted-foreground hover:text-foreground"
                    >
                        <GripVertical size={16}/>
                    </button>
                )}
            </div>

            {/* Main content: Title */}
            <div className="flex-1 text-sm px-2 pt-1">
                <h3
                    className={cn(
                        "font-medium text-foreground text-base break-words",
                        task.done && "line-through text-muted-foreground"
                    )}
                >
                    {task.title}
                </h3>
                {task.dueDate && (
                    <p className="text-xs text-muted-foreground mt-1">{task.dueDate}</p>
                )}
            </div>

            {/* Footer: Actions (hidden by default, shown on hover) */}
            <div
                className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity mt-3 border-t pt-2"
            >
                {/* Done toggle */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleMutation.mutate();
                    }}
                    disabled={toggleMutation.isLoading}
                    className="flex items-center gap-1 text-muted-foreground hover:text-green-500"
                >
                    {task.done ? (
                        <>
                            <CheckCircle size={16}/>
                            <span className="text-xs">Undo</span>
                        </>
                    ) : (
                        <>
                            <Circle size={16}/>
                            <span className="text-xs">Done</span>
                        </>
                    )}
                </button>

                {/* Edit Task */}
                <EditTaskModal
                    taskId={task.id}
                    initialTitle={task.title}
                    initialPriority={task.priority}
                    initialColumn={task.column}
                >
                    <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-muted-foreground hover:text-blue-500"
                    >
                        <Pencil size={16}/>
                        <span className="text-xs">Edit</span>
                    </button>
                </EditTaskModal>

                {/* Delete */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteMutation.mutate();
                    }}
                    disabled={deleteMutation.isLoading}
                    className="flex items-center gap-1 text-red-500 hover:text-red-600"
                >
                    <Trash2 size={16}/>
                    <span className="text-xs">Delete</span>
                </button>
            </div>
        </div>
    );
}
