import { BrowserRouter, Routes, Route } from "react-router";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/Header";
import { BoardLayout } from "@/features/board/BoardLayout";
import Board from "@/features/board/Board";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import StartPage from "@/pages/StartPage";

export default function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<StartPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route
                        path="/boards"
                        element={
                            <ProtectedRoute>
                                <div className="h-full flex flex-col">
                                    <Header />
                                    <BoardLayout>
                                        <Board />
                                    </BoardLayout>
                                </div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}
