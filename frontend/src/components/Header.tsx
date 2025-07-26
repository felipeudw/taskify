import {Button} from "@/components/ui/button";
import {Moon, Sun} from "lucide-react";
import AddTaskModal from "@/features/board/AddTaskModal";
import {useTheme} from "@/components/theme-provider";

export function Header() {
    const {theme, setTheme} = useTheme();

    return (
        <header
            className="
    flex flex-wrap items-center justify-between gap-4
    px-4 py-3
    bg-gradient-to-r from-primary to-primary/80
    text-primary-foreground
    shadow-md
  "
        >
            {/* Left: Add Task */}
            <div className="order-1">
                <AddTaskModal>
                    <Button className="bg-white/20 hover:bg-white/30 text-primary-foreground">
                        + Add Task
                    </Button>
                </AddTaskModal>
            </div>

            {/* Center: App Name */}
            <h1 className="order-2 w-full text-center text-xl font-bold tracking-tight sm:w-auto sm:order-none">
                Taskify
            </h1>

            {/* Right: Theme Toggle + Profile */}
            <div className="order-3 flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-white/20"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20">
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
