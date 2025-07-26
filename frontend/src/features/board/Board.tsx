import {useState, useMemo} from 'react';
import {
    DndContext,
    DragOverlay,
    type DragEndEvent, rectIntersection,
} from '@dnd-kit/core';
import BoardColumn from './BoardColumn';
import TaskCard from './TaskCard';
import {useTaskStore} from '../../store/useTaskStore';
import type {Task} from '../../types/task';

const columns = [
    {id: 'inbox', title: 'Inbox'},
    {id: 'today', title: 'Today'},
    {id: 'week', title: 'This Week'},
    {id: 'upcoming', title: 'Upcoming'},
];

export default function Board() {
    // ✅ Select tasks and actions once
    const tasks = useTaskStore((s) => s.tasks);
    const moveTask = useTaskStore((s) => s.moveTask);
    const reorderTask = useTaskStore((s) => s.reorderTask);

    const [activeId, setActiveId] = useState<string | null>(null);

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;
        if (activeId === overId) return;

        const activeTask = tasks.find((t) => t.id === activeId);
        if (!activeTask) return;

        const overTask = tasks.find((t) => t.id === overId);

        if (overTask) {
            // ✅ Dropped over another task
            if (activeTask.column === overTask.column) {
                // ✅ Reorder inside the same column
                const columnTasks = tasks.filter((t) => t.column === activeTask.column);
                const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
                const newIndex = columnTasks.findIndex((t) => t.id === overId);
                reorderTask(oldIndex, newIndex, activeTask.column);
            } else {
                // ✅ Move to another column (drop before overTask)
                moveTask(activeId, overTask.column, overTask.id);
            }
        } else {
            // ✅ Dropped on an empty column (or outside items)
            if (activeTask.column !== overId) {
                moveTask(activeId, overId as any);
            }
        }
    };

    const handleDragCancel = () => setActiveId(null);

    const activeTask: Task | undefined = useMemo(
        () => (activeId ? tasks.find((t) => t.id === activeId) : undefined),
        [activeId, tasks]
    );

    return (
        <DndContext
            collisionDetection={rectIntersection}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <div className="flex gap-4">
                {columns.map((col) => (
                    <BoardColumn key={col.id} columnId={col.id as any} title={col.title}/>
                ))}
            </div>

            {/* ✅ Drag overlay for smooth preview */}
            <DragOverlay>
                {activeTask ? (
                    <div className="pointer-events-none opacity-90 scale-105 shadow-lg">
                        <TaskCard task={activeTask} dragging/>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
