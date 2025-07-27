import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {cn} from "@/lib/utils";

const DONE_FILTERS = ["all", "done", "undone"] as const;
type DoneFilter = typeof DONE_FILTERS[number];

const PRIORITY_FILTERS = ["all", "low", "medium", "high"] as const;
type PriorityFilter = typeof PRIORITY_FILTERS[number];

export interface TaskToolbarProps {
    onFilterChange: (doneFilter: DoneFilter, priorityFilter: PriorityFilter) => void;
}

export default function TaskToolbar({onFilterChange}: TaskToolbarProps) {
    const [doneFilter, setDoneFilter] = useState<DoneFilter>("all");
    const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");

    const handleDoneChange = (filter: DoneFilter) => {
        setDoneFilter(filter);
        onFilterChange(filter, priorityFilter);
    };

    const handlePriorityChange = (filter: PriorityFilter) => {
        setPriorityFilter(filter);
        onFilterChange(doneFilter, filter);
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            {/* Done Filter Buttons */}
            <div className="flex gap-2">
                {DONE_FILTERS.map((filter) => (
                    <Button
                        key={filter}
                        variant={doneFilter === filter ? "default" : "outline"}
                        size="sm"
                        className={cn("capitalize")}
                        onClick={() => handleDoneChange(filter)}
                    >
                        {filter}
                    </Button>
                ))}
            </div>

            {/* Priority Select */}
            <Select value={priorityFilter} onValueChange={(val) => handlePriorityChange(val as PriorityFilter)}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Priority"/>
                </SelectTrigger>
                <SelectContent>
                    {PRIORITY_FILTERS.map((filter) => (
                        <SelectItem key={filter} value={filter} className="capitalize">
                            {filter === "all" ? "All Priorities" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
