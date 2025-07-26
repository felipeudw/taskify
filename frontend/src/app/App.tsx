import Sidebar from '../components/Sidebar';
import Board from '../features/board/Board';
import {ThemeProvider} from "@/components/theme-provider.tsx";
import {Header} from "@/components/Header.tsx";
import {BoardLayout} from "@/features/board/BoardLayout.tsx";

export default function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="h-full flex flex-col">
                <Header />
                <BoardLayout>
                    <Board />
                </BoardLayout>
            </div>
        </ThemeProvider>
    );
}
