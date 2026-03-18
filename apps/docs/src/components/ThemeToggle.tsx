"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
	const [theme, setThemeState] = useState<"light" | "dark">("light");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const isDark = document.documentElement.classList.contains("dark");
		setThemeState(isDark ? "dark" : "light");
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "dark" ? "light" : "dark";
		setThemeState(newTheme);

		if (newTheme === "dark") {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	};

	// Prevent flash during hydration
	if (!mounted) {
		return <div className="inline-flex h-9 w-9 items-center justify-center" />;
	}

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className="text-muted-foreground hover:text-foreground hover:bg-accent hover:border-border inline-flex h-9 w-9 items-center justify-center rounded-none border border-transparent transition-colors"
			aria-label="Toggle theme"
		>
			<Sun className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
			<Moon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
			<span className="sr-only">Toggle theme</span>
		</button>
	);
}
