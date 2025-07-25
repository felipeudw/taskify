import ThemeToggle from './ThemeToggle';
import {Button} from './ui/button';
import AddTaskModal from '../features/board/AddTaskModal';

export default function Sidebar() {
    return (
        <aside className="w-64 bg-muted p-4 flex flex-col justify-between">
            <div>
                <h1 className="text-2xl font-bold mb-4">Taskify</h1>
                <AddTaskModal>
                    <Button variant="default" className="w-full mb-4">+ New Task</Button>
                </AddTaskModal>
            </div>
            <ThemeToggle/>
        </aside>
    );
}
