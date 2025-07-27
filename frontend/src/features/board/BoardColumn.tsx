import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import { cn } from "../../lib/utils";
import type { Task } from "@/api/taskApi";

interface Props {
    columnId: string;
    title: string;
    tasks: Task[];
}

export default function BoardColumn({ columnId, title, tasks }: Props) {
    const { setNodeRef, isOver } = useDroppable({ id: columnId });

    return (
        <div
            ref={setNodeRef}
            role="region"
            aria-label={`${title} column`}
            className={cn(
                "relative bg-card rounded-xl min-h-[500px] shadow-md flex flex-col border border-border transition-all duration-200 ease-in-out",
                "w-[20rem]",
                isOver && "ring-2 ring-primary/50 bg-accent/30"
            )}
        >
            {/* Column Header */}
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-4 pt-4 pb-2 border-b border-border">
                {title}
            </h2>

            {/* Sortable Items */}
            <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <div className="flex-1 flex flex-col gap-3 p-4">
                    {tasks.length > 0 ? (
                        tasks.map((task) => <TaskCard key={task.id} task={task} />)
                    ) : (
                        <div
                            className="flex-1 flex items-center justify-center text-sm text-muted-foreground opacity-50 border border-dashed border-border rounded-md pointer-events-none"
                        >
                            Drop tasks here
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}
