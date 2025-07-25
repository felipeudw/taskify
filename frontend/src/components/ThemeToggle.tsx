import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark);
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    }, [dark]);

    return (
        <button onClick={() => setDark(!dark)} className="flex items-center gap-2">
            {dark ? <Sun /> : <Moon />} {dark ? 'Light Mode' : 'Dark Mode'}
        </button>
    );
}
