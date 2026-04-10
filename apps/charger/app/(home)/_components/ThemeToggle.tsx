"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl border border-border/10 bg-muted/5 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-300 active:scale-95 group",
        "bg-card/50 hover:bg-muted border-border/40 text-foreground/70 hover:text-foreground shadow-sm",
        "dark:bg-secondary-blue-dark-900/50 dark:hover:bg-secondary-blue-dark-800/80 dark:border-white/10 dark:text-gray-400 dark:hover:text-white"
      )}
      aria-label="Toggle theme"
    >
      <div className="relative w-4 h-4 overflow-hidden">
        <Sun 
          className={cn(
            "absolute inset-0 w-full h-full transition-all duration-500 ease-in-out transform",
            isDark ? "translate-y-6 opacity-0 scale-50" : "translate-y-0 opacity-100 scale-100"
          )} 
        />
        <Moon 
          className={cn(
            "absolute inset-0 w-full h-full transition-all duration-500 ease-in-out transform",
            isDark ? "translate-y-0 opacity-100 scale-100" : "-translate-y-6 opacity-0 scale-50"
          )} 
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
