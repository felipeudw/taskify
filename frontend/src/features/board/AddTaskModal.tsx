import {type ReactNode, useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {createTask} from '@/api/taskApi';
import {priorityColors} from '@/constants/ui';
import {useAuthStore} from "@/store/authStore.ts";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    priority: z.enum(['low', 'medium', 'high']),
    column: z.enum(['inbox', 'today', 'week', 'upcoming']),
});

type FormData = z.infer<typeof schema>;

export default function AddTaskModal({
                                         children,
                                     }: {
    children: ReactNode;
    boardId: string;
}) {
    const boardId = useAuthStore((state) => state.boardId);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {title: '', priority: 'medium', column: 'inbox'},
    });

    const onSubmit = async (values: FormData) => {
        try {
            setLoading(true);
            setApiError(null);
            await createTask({...values, boardId});

            // Refresh tasks immediately
            queryClient.invalidateQueries({ queryKey: ["tasks", boardId] });

            form.reset({title: '', priority: 'medium', column: 'inbox'});
            setOpen(false);
        } catch (err: any) {
            setApiError(err.response?.data?.message || 'Failed to add task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>Create a task for this board.</DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 py-4">
                    {/* Title */}
                    <div>
                        <Input
                            placeholder="Task description"
                            {...form.register('title')}
                            className={form.formState.errors.title ? 'border-red-500' : ''}
                        />
                        {form.formState.errors.title && (
                            <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        {/* Priority */}
                        <Select
                            value={form.watch('priority')}
                            onValueChange={(val) => form.setValue('priority', val as 'low' | 'medium' | 'high')}
                        >
                            <SelectTrigger className="w-[50%]">
                                <SelectValue placeholder="Priority"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full ${priorityColors.low}`}/>
                                        Low Priority
                                    </div>
                                </SelectItem>
                                <SelectItem value="medium">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full ${priorityColors.medium}`}/>
                                        Normal Priority
                                    </div>
                                </SelectItem>
                                <SelectItem value="high">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full ${priorityColors.high}`}/>
                                        High Priority
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Column */}
                        <Select
                            value={form.watch('column')}
                            onValueChange={(val) =>
                                form.setValue('column', val as 'inbox' | 'today' | 'week' | 'upcoming')
                            }
                        >
                            <SelectTrigger className="w-[50%]">
                                <SelectValue placeholder="Column"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="inbox">Inbox</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="week">This Week</SelectItem>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Task'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
