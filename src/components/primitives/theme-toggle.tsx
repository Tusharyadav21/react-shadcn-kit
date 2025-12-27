"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib";

export default function ThemeToggle({ big = false }: { big?: boolean }) {
  const { setTheme, theme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      className={cn(
        "flex items-center rounded p-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground hover:bg-secondary w-full",
        big ? "justify-start px-4 gap-2" : "justify-center",
      )}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <div className="relative h-[1.2rem] w-[1.2rem]">
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute top-0 left-0 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>
      {!big && <span className="sr-only">Toggle theme</span>}
      {big && <span className="text-sm">Toggle Theme</span>}
    </motion.button>
  );
}
