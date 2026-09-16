import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "zentera-theme";
export const THEME_COLORS: Record<Theme, string> = {
  dark: "#050609",
  light: "#f4f7fa",
};

/**
 * Script injetado no <head> (antes da pintura) para aplicar o tema salvo e
 * evitar flash incorreto durante o carregamento com SSR. Mantém a lógica
 * mínima e sem dependências, pois roda como string inline.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var m=t==="light"?"light":"dark";var r=document.documentElement;r.classList.remove("light","dark");r.classList.add(m);r.style.colorScheme=m;var c=m==="light"?"${THEME_COLORS.light}":"${THEME_COLORS.dark}";var e=document.querySelector('meta[name="theme-color"]');if(!e){e=document.createElement("meta");e.setAttribute("name","theme-color");document.head.appendChild(e);}e.setAttribute("content",c);}catch(_){var d=document.documentElement;d.classList.add("dark");d.style.colorScheme="dark";}})();`;

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;

  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", THEME_COLORS[theme]);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Inicia em "dark" no servidor e na primeira renderização do cliente; o valor
  // real vindo do localStorage é lido no efeito abaixo (evita mismatch de SSR).
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    let initial: Theme = "dark";
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      initial = stored === "light" ? "light" : "dark";
    } catch {
      initial = "dark";
    }
    setThemeState(initial);
    applyTheme(initial);
    // Habilita a transição de cores só após a montagem, para não animar o
    // primeiro paint.
    document.documentElement.classList.add("theme-ready");
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Ignora indisponibilidade de localStorage (ex.: modo privado restrito).
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        /* noop */
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme deve ser usado dentro de <ThemeProvider>.");
  }
  return ctx;
}
