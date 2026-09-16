import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita divergência de ícone entre servidor e cliente: até montar, mostra o
  // ícone do tema padrão (escuro → sol).
  useEffect(() => setMounted(true), []);
  const isDark = !mounted || theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Alternar entre tema claro e escuro"
      title="Alternar tema"
      className={`group relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-[rgba(79,178,198,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan lg:h-[42px] lg:w-[42px] ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-gradient-brand opacity-0 transition-opacity duration-300 group-hover:opacity-15"
      />
      {isDark ? (
        <Sun className="relative h-[18px] w-[18px] text-brand-cyan" aria-hidden />
      ) : (
        <Moon className="relative h-[18px] w-[18px] text-brand-blue" aria-hidden />
      )}
    </button>
  );
}
