import {useTaskStore} from '../../store/useTaskStore';
import TaskCard from './TaskCard';
import type {ColumnType} from '../../types/task';
import {useMemo} from 'react';
import {useDroppable} from "@dnd-kit/core";

interface Props {
    columnId: ColumnType;
    title: string;
}

export default function BoardColumn({columnId, title}: Props) {
    const {setNodeRef} = useDroppable({id: columnId});

    // Subscribe only to `tasks` to trigger updates when store changes
    const allTasks = useTaskStore((state) => state.tasks);

    // Filter inside useMemo (cheap for small arrays)
    const tasks = useMemo(() => allTasks.filter((t) => t.column === columnId), [allTasks, columnId]);

    return (
        <div
            ref={setNodeRef}
            className="w-64 bg-muted rounded-xl p-2 flex flex-col gap-2 min-h-[400px]"
        >
            <h2 className="font-bold text-lg mb-2">{title}</h2>
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task}/>
            ))}
        </div>
    );
}