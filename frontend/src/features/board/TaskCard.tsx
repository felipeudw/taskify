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
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["tasks", task.boardId]}),
    });

    const toggleMutation = useMutation({
        mutationFn: () => toggleTaskApi(task.id, !task.done),
        onMutate: async () => {
            await queryClient.cancelQueries({queryKey: ["tasks", task.boardId]});
            const previousTasks = queryClient.getQueryData<Task[]>(["tasks", task.boardId]);
            queryClient.setQueryData(["tasks", task.boardId], (old: Task[] = []) =>
                old.map((t) => (t.id === task.id ? {...t, done: !task.done} : t))
            );
            return {previousTasks};
        },
        onError: (_err, _vars, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(["tasks", task.boardId], context.previousTasks);
            }
        },
        onSettled: () => queryClient.invalidateQueries({queryKey: ["tasks", task.boardId]}),
    });

    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: task.id});

    const style = {transform: CSS.Transform.toString(transform), transition};

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
                "relative group bg-background border rounded-lg p-3 flex flex-col transition-shadow hover:shadow-lg hover:bg-muted/30",
                dragging && "opacity-50",
                `border-r-8 ${priorityColor}`
            )}
        >
            {/* Header: Handle + Title */}
            <div className="flex items-start gap-3">
                {!dragging && (
                    <button
                        {...listeners}
                        {...attributes}
                        className="cursor-grab text-muted-foreground hover:text-foreground mt-1"
                        title="Drag to reorder"
                    >
                        <GripVertical size={18} />
                    </button>
                )}

                <div className="flex-1 min-w-0">
                    <h3
                        className={cn(
                            "text-[15px] font-normal text-gray-800 dark:text-gray-200 leading-relaxed break-words",
                            task.done && "line-through text-muted-foreground"
                        )}
                    >
                        {task.title}
                    </h3>
                    {task.dueDate && (
                        <p className="text-xs text-muted-foreground mt-0.5">{task.dueDate}</p>
                    )}
                </div>
            </div>

            {/* Footer (hover only) */}
            <div className="flex justify-between items-center mt-2 px-1 h-8 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all border-t pt-1">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleMutation.mutate();
                    }}
                    disabled={toggleMutation.isLoading}
                    className="flex items-center gap-1 text-muted-foreground hover:text-green-500 text-xs"
                >
                    {task.done ? (
                        <>
                            <CheckCircle size={14} />
                            <span>Undo</span>
                        </>
                    ) : (
                        <>
                            <Circle size={14} />
                            <span>Done</span>
                        </>
                    )}
                </button>

                <EditTaskModal
                    taskId={task.id}
                    initialTitle={task.title}
                    initialPriority={task.priority}
                    initialColumn={task.column}
                >
                    <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-muted-foreground hover:text-blue-500 text-xs"
                    >
                        <Pencil size={14} />
                        <span>Edit</span>
                    </button>
                </EditTaskModal>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteMutation.mutate();
                    }}
                    disabled={deleteMutation.isLoading}
                    className="flex items-center gap-1 text-red-500 hover:text-red-600 text-xs"
                >
                    <Trash2 size={14} />
                    <span>Delete</span>
                </button>
            </div>
        </div>

    );
}
