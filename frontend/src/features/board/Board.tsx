import {DndContext, closestCorners, type DragEndEvent} from '@dnd-kit/core';
import BoardColumn from './BoardColumn';
import {useTaskStore} from '../../store/useTaskStore';
import type {ColumnType} from "@/types/task.ts";

const columns: Array<{ id: ColumnType, title: string }> = [
    {id: 'inbox', title: 'Inbox'},
    {id: 'today', title: 'Today'},
    {id: 'week', title: 'This Week'},
    {id: 'upcoming', title: 'Upcoming'},
];

export default function Board() {
    const moveTask = useTaskStore((state) => state.moveTask);

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        if (!over || active.id === over.id) return;

        const newColumn = over.id as ColumnType; // Droppable ID → ColumnType
        moveTask(active.id as string, newColumn);
    };

    return (
        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="flex gap-4">
                {columns.map((col) => (
                    <BoardColumn key={col.id} columnId={col.id as ColumnType} title={col.title}/>
                ))}
            </div>
        </DndContext>
    );
}