import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function AdminThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label="Đổi theme"
            className="relative h-10 w-[4.25rem] rounded-full border border-white/20 bg-white/50 p-1 backdrop-blur-md transition hover:scale-105 dark:border-white/10 dark:bg-slate-800/60"
        >
            <span
                className={`absolute top-1 h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow transition-all duration-500 ${
                    theme === "dark" ? "left-[calc(100%-2.25rem)]" : "left-1"
                }`}
            />
            <Sun className={`absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 ${theme === "dark" ? "opacity-30" : "text-amber-500"}`} />
            <Moon className={`absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 ${theme === "dark" ? "text-indigo-300" : "opacity-30"}`} />
        </button>
    );
}
