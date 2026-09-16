import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "#solucao", label: "Solução" },
  { href: "#agentes", label: "Agentes" },
  { href: "#multicanal", label: "Multicanal" },
  { href: "#contato", label: "Contato" },
];

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Menu mobile: bloqueio de scroll, foco preso no painel, Escape fecha,
  // foco devolvido ao botão que abriu.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusables = panel
      ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
          (el) => el.offsetParent !== null,
        )
      : [];
    focusables[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "Tab" && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && (active === first || !panel?.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !panel?.contains(active))) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const trigger = triggerRef.current;
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open, close]);

  return (
    <motion.header
      initial={reduce ? false : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-xl bg-background/70 border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-10 h-16 md:h-20 flex items-center justify-between">
        <a
          href="#top"
          className="flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cyan"
          aria-label="Zentera Virtua — Início"
        >
          <Logo className="h-9 md:h-11 w-auto" />
        </a>

        <nav className="hidden lg:flex items-center gap-9" aria-label="Navegação principal">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-text-muted hover:text-foreground transition-colors relative group rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cyan"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-brand transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <a
            href="#contato"
            className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium text-foreground bg-gradient-brand hover:opacity-90 transition-opacity glow-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cyan"
          >
            Solicitar demonstração
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            ref={triggerRef}
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center h-11 w-11 rounded-full border border-border text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
            aria-label="Abrir menu de navegação"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-haspopup="dialog"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.1 : 0.2 }}
          >
            <div
              className="absolute inset-0 bg-background/90 backdrop-blur-xl"
              onClick={close}
              aria-hidden
            />
            <motion.div
              ref={panelRef}
              id="menu-mobile"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
              initial={reduce ? { opacity: 0 } : { x: "100%" }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%" }}
              transition={{
                type: "tween",
                duration: reduce ? 0.1 : 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute right-0 top-0 h-full w-[86%] max-w-sm border-l border-[rgba(79,178,198,0.14)] bg-surface flex flex-col overflow-y-auto p-5 sm:p-6 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
            >
              <div className="flex items-center justify-between">
                <Logo className="h-9 w-auto" />
                <button
                  onClick={close}
                  className="h-11 w-11 rounded-full border border-[rgba(79,178,198,0.18)] inline-flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
                  aria-label="Fechar menu"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>
              <nav className="mt-10 flex flex-col gap-1" aria-label="Navegação principal">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={close}
                    className="py-4 text-2xl font-medium text-foreground border-b border-border rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
              <a
                href="#contato"
                onClick={close}
                className="mt-auto inline-flex justify-center rounded-full px-6 py-3.5 text-base font-medium bg-gradient-brand text-foreground glow-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
              >
                Solicitar demonstração
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
