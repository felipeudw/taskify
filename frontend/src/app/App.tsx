import Sidebar from '../components/Sidebar';
import Board from '../features/board/Board';

export default function App() {
    return (
        <div className="flex h-screen bg-background text-foreground">
            <Sidebar/>
            <main className="flex-1 p-4 overflow-x-auto">
                <Board/>
            </main>
        </div>
    );
}
