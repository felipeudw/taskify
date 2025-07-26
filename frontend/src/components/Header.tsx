import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import AddTaskModal from "@/features/board/AddTaskModal.tsx";
import {useTheme} from "@/components/theme-provider.tsx";

export function Header() {
    const { theme, setTheme } = useTheme();

    return (
        <header className="relative flex items-center justify-between px-6 py-4 bg-card border-b border-border shadow-sm">
            {/* Left: Add Task */}
            <AddTaskModal>
                <Button variant="secondary" className="rounded-lg">
                    + Add Task
                </Button>
            </AddTaskModal>

            {/* Center: App Name */}
            <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold tracking-tight text-foreground">
                Taskify
            </h1>

            {/* Right: Theme Toggle + Profile */}
            <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </Button>

                {/* Profile Button */}
                <Button variant="ghost" size="icon" className="rounded-full">
                    <img
                        src="https://ui-avatars.com/api/?name=User"
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                    />
                </Button>
            </div>
        </header>
    );
}
