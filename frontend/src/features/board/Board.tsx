import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasksByBoard, moveTaskApi, type Task } from "@/api/taskApi";
import { useState, useMemo } from "react";
import { DndContext, DragOverlay, rectIntersection, type DragEndEvent } from "@dnd-kit/core";
import BoardColumn from "./BoardColumn";
import TaskCard from "./TaskCard";
import { useAuthStore } from "@/store/authStore";

const columns = [
    { id: "inbox", title: "Inbox" },
    { id: "today", title: "Today" },
    { id: "week", title: "This Week" },
    { id: "upcoming", title: "Upcoming" },
];

export default function Board() {
    const queryClient = useQueryClient();
    const [activeId, setActiveId] = useState<string | null>(null);
    const boardId = useAuthStore((state) => state.boardId);

    if (!boardId) {
        return <p className="text-center text-gray-500 mt-6">No boards available</p>;
    }

    const {
        data: tasks = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["tasks", boardId],
        queryFn: () => getTasksByBoard(boardId),
        enabled: !!boardId,
    });

    const moveTaskMutation = useMutation({
        mutationFn: moveTaskApi,
        onMutate: async ({ taskId, newColumn }) => {
            await queryClient.cancelQueries({ queryKey: ["tasks", boardId] });
            const previousTasks = queryClient.getQueryData<Task[]>(["tasks", boardId]);

            queryClient.setQueryData<Task[]>(["tasks", boardId], (old = []) =>
                old.map((t) => (t.id === taskId ? { ...t, column: newColumn } : t))
            );

            return { previousTasks };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(["tasks", boardId], context.previousTasks);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", boardId] });
        },
    });

    const activeTask = useMemo(() => tasks.find((t) => t.id === activeId), [activeId, tasks]);

    const handleDragStart = (event: any) => setActiveId(event.active.id as string);
    const handleDragCancel = () => setActiveId(null);
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeTask = tasks.find((t) => t.id === active.id);
        if (!activeTask || activeTask.column === over.id) return;

        moveTaskMutation.mutate({ taskId: activeTask.id, newColumn: over.id as string });
        setActiveId(null);
    };

    if (isLoading) return <p className="text-center mt-6">Loading tasks...</p>;
    if (isError) return <p className="text-center text-red-500">Failed to load tasks</p>;

    return (
        <DndContext
            collisionDetection={rectIntersection}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            {/* ✅ Scrollable container */}
            <div className="w-full h-full bg-muted px-4 py-6 overflow-x-auto">
                <div className="flex gap-6 min-w-max">
                    {columns.map((col) => (
                        <BoardColumn
                            key={col.id}
                            columnId={col.id as any}
                            title={col.title}
                            tasks={tasks.filter((t) => t.column === col.id)}
                        />
                    ))}
                </div>

                {/* ✅ Empty State */}
                {tasks.length === 0 && (
                    <div className="mt-10 text-center text-gray-400 text-lg">
                        No tasks yet. Click <strong>+ Add Task</strong> to create your first one.
                    </div>
                )}
            </div>

            {/* ✅ Drag Overlay */}
            <DragOverlay>
                {activeTask ? (
                    <div className="pointer-events-none opacity-90 scale-105 shadow-lg">
                        <TaskCard task={activeTask} dragging />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
