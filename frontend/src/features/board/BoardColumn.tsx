import { useMemo } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useTaskStore } from "../../store/useTaskStore";
import TaskCard from "./TaskCard";
import type { ColumnType } from "../../types/task";
import { cn } from "../../lib/utils";

interface Props {
    columnId: ColumnType;
    title: string;
}

export default function BoardColumn({ columnId, title }: Props) {
    const allTasks = useTaskStore((state) => state.tasks);

    const tasks = useMemo(() => allTasks.filter((t) => t.column === columnId), [allTasks, columnId]);
    const itemIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

    const { setNodeRef, isOver } = useDroppable({ id: columnId });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "relative bg-card rounded-xl w-72 min-h-[500px] shadow-md flex flex-col border border-border transition-all",
                isOver && "ring-2 ring-primary/50 bg-accent/30"
            )}
        >
            {/* Column Header */}
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-4 pt-4 pb-2 border-b border-border">
                {title}
            </h2>

            {/* Sortable items */}
            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                <div className="flex-1 flex flex-col gap-3 p-4">
                    {tasks.length > 0 ? (
                        tasks.map((task) => <TaskCard key={task.id} task={task} />)
                    ) : (
                        // ✅ Make placeholder fill entire area for hit detection
                        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground opacity-50 border border-dashed border-border rounded-md pointer-events-none">
                            Drop tasks here
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}
