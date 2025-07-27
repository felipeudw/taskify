import {BrowserRouter, Routes, Route, Navigate} from "react-router";
import {ThemeProvider} from "@/components/theme-provider";
import {Header} from "@/components/Header";
import {BoardLayout} from "@/features/board/BoardLayout";
import Board from "@/features/board/Board";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import StartPage from "@/pages/StartPage";
import {Toaster} from "sonner";
import {useAuthStore} from "@/store/authStore";

export default function App() {
    const token = useAuthStore((s) => s.token);

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <BrowserRouter>
                <Toaster richColors position="top-center"/>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={!token ? <StartPage/> : <Navigate to="/boards"/>}/>
                    <Route path="/login" element={!token ? <Login/> : <Navigate to="/boards"/>}/>
                    <Route path="/register" element={!token ? <Register/> : <Navigate to="/boards"/>}/>

                    {/* Protected */}
                    <Route
                        path="/boards"
                        element={
                            token ? (
                                <div className="h-full flex flex-col">
                                    <Header/>
                                    <BoardLayout>
                                        <Board/>
                                    </BoardLayout>
                                </div>
                            ) : (
                                <Navigate to="/" replace/>
                            )
                        }
                    />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}
