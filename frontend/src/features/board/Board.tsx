import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {getTasksByBoard, moveTaskApi, reorderTasksApi, type Task} from "@/api/taskApi";
import {useState, useMemo} from "react";
import {DndContext, DragOverlay, rectIntersection, type DragEndEvent} from "@dnd-kit/core";
import BoardColumn from "./BoardColumn";
import TaskCard from "./TaskCard";
import {useAuthStore} from "@/store/authStore";

const columns = [
    {id: "inbox", title: "Inbox"},
    {id: "today", title: "Today"},
    {id: "week", title: "This Week"},
    {id: "upcoming", title: "Upcoming"},
];

export default function Board() {
    const queryClient = useQueryClient();
    const [activeId, setActiveId] = useState<string | null>(null);
    const boardId = useAuthStore((state) => state.boardId);

    // ✅ Always call hooks in the same order
    const {
        data: tasks = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["tasks", boardId],
        queryFn: () => getTasksByBoard(boardId!), // `!` safe because enabled: !!boardId
        enabled: !!boardId,
    });

    const moveTaskMutation = useMutation({
        mutationFn: moveTaskApi,
        onSettled: () => queryClient.invalidateQueries({queryKey: ["tasks", boardId]}),
    });

    const reorderMutation = useMutation({
        mutationFn: reorderTasksApi,
        onSettled: () => queryClient.invalidateQueries({queryKey: ["tasks", boardId]}),
    });

    const activeTask = useMemo(() => tasks.find((t) => t.id === activeId), [activeId, tasks]);

    const handleDragStart = (event: any) => setActiveId(event.active.id as string);
    const handleDragCancel = () => setActiveId(null);

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        if (!over) return;

        const activeTask = tasks.find((t) => t.id === active.id);
        const overTask = tasks.find((t) => t.id === over.id);
        const targetColumn = overTask ? overTask.column : over.id; // ✅ If no task, use columnId

        if (!activeTask) {
            setActiveId(null);
            return;
        }

        if (activeTask.column === targetColumn) {
            // ✅ Same column reorder
            if (overTask) {
                const columnTasks = tasks.filter((t) => t.column === activeTask.column);
                const oldIndex = columnTasks.findIndex((t) => t.id === active.id);
                const newIndex = columnTasks.findIndex((t) => t.id === over.id);

                if (oldIndex !== newIndex) {
                    const reordered = reorderArray(columnTasks, oldIndex, newIndex);
                    const updates = reordered.map((t, index) => ({id: t.id, order: index}));

                    queryClient.setQueryData<Task[]>(["tasks", boardId], (old = []) => {
                        const others = old.filter((t) => t.column !== activeTask.column);
                        return [...others, ...reordered];
                    });

                    reorderMutation.mutate(updates);
                }
            }
        } else {
            // ✅ Move to another column (including empty column)
            const targetColumnTasks = tasks.filter((t) => t.column === targetColumn);
            const newOrder = targetColumnTasks.length; // ✅ If empty, this is 0

            // ✅ Optimistic update
            queryClient.setQueryData<Task[]>(["tasks", boardId], (old = []) =>
                old.map((t) =>
                    t.id === activeTask.id
                        ? {...t, column: targetColumn, order: newOrder}
                        : t
                )
            );

            moveTaskMutation.mutate({taskId: activeTask.id, newColumn: targetColumn, newOrder});
        }

        setActiveId(null);
    };

    const reorderArray = (arr: Task[], from: number, to: number): Task[] => {
        const copy = [...arr];
        const [moved] = copy.splice(from, 1);
        copy.splice(to, 0, moved);
        return copy.map((task, index) => ({...task, order: index}));
    };

    // ✅ Safe render after hooks
    if (!boardId) return <p className="text-center mt-6">No boards available</p>;
    if (isLoading) return <p className="text-center mt-6">Loading tasks...</p>;
    if (isError) return <p className="text-center text-red-500">Failed to load tasks</p>;

    return (
        <DndContext
            collisionDetection={rectIntersection}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <div className="w-full h-full bg-muted px-4 py-6 overflow-x-auto">
                <div className="flex gap-6 min-w-max">
                    {columns.map((col) => (
                        <BoardColumn
                            key={col.id}
                            columnId={col.id}
                            title={col.title}
                            tasks={tasks.filter((t) => t.column === col.id).sort((a, b) => a.order - b.order)}
                        />
                    ))}
                </div>

                {tasks.length === 0 && (
                    <div className="mt-10 text-center text-gray-400 text-lg">
                        No tasks yet. Click <strong>+ Add Task</strong> to create your first one.
                    </div>
                )}
            </div>

            {/* ✅ Safe DragOverlay fallback */}
            <DragOverlay>
                {activeTask ? (
                    <div className="pointer-events-none opacity-90 scale-105 shadow-lg">
                        <TaskCard task={activeTask} dragging/>
                    </div>
                ) : (
                    <div/>
                )}
            </DragOverlay>
        </DndContext>
    );
}
