import {useEffect, useState} from "react";

export function useDarkMode() {
    const [isDark, setIsDark] = useState<boolean>(() => {
        return localStorage.getItem("theme") === "dark" || false;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    return {isDark, toggleDarkMode: () => setIsDark(!isDark)};
}
