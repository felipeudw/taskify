import {Button} from "@/components/ui/button";
import {Moon, Sun} from "lucide-react";
import AddTaskModal from "@/features/board/AddTaskModal";
import {useTheme} from "@/components/theme-provider";

export function Header() {
    const {theme, setTheme} = useTheme();

    return (
        <header
            className="
        relative flex items-center justify-between px-6 py-4
        bg-gradient-to-r from-primary to-primary/80
        text-primary-foreground
        shadow-md
      "
        >
            {/* Left: Add Task */}
            <AddTaskModal>
                <Button
                    variant="secondary"
                    className="rounded-lg bg-white/20 hover:bg-white/30 text-primary-foreground border-none"
                >
                    + Add Task
                </Button>
            </AddTaskModal>

            {/* Center: App Name */}
            <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold tracking-tight">
                Taskify
            </h1>

            {/* Right: Theme Toggle + Profile */}
            <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-white/20"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                    {theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}
                </Button>

                {/* Profile Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-white/20"
                >
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
