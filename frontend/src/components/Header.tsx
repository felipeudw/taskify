import {Button} from "./ui/button";
import {useDarkMode} from "../hooks/useDarkMode";

const Header = () => {
    const {isDark, toggleDarkMode} = useDarkMode();

    return (
        <header className="w-full h-14 flex items-center justify-between px-4 bg-primary text-white shadow-md">
            <h1 className="font-bold text-lg">Taskify</h1>
            <Button variant="secondary" onClick={toggleDarkMode}>
                {isDark ? "Light Mode" : "Dark Mode"}
            </Button>
        </header>
    );
};

export default Header;

