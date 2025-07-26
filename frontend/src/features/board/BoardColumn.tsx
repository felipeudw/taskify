import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {useTaskStore} from '../../store/useTaskStore';
import TaskCard from './TaskCard';
import type {ColumnType} from '../../types/task';
import {useMemo} from "react";
import {useDroppable} from "@dnd-kit/core";

interface Props {
    columnId: ColumnType;
    title: string;
}

export default function BoardColumn({columnId, title}: Props) {
    const allTasks = useTaskStore((state) => state.tasks);

    // Memoize filtered tasks
    const tasks = useMemo(
        () => allTasks.filter((t) => t.column === columnId),
        [allTasks, columnId]
    );

    // Memoize item IDs for SortableContext
    const itemIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

    const {setNodeRef} = useDroppable({id: columnId});

    return (
        <div
            ref={setNodeRef}
            className="w-64 bg-muted rounded-xl p-2 flex flex-col gap-2 min-h-[400px]"
        >
            <h2 className="font-bold text-lg mb-2">{title}</h2>
            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task}/>
                ))}
            </SortableContext>
        </div>
    );
}
