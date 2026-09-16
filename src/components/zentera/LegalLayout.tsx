import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Logo } from "./Logo";
import { Footer } from "./Footer";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Layout das páginas legais (Política de Privacidade e Termos de Uso):
 * cabeçalho simplificado, conteúdo legível e rodapé completo.
 */
export function LegalLayout({
  title,
  updatedNote,
  children,
}: {
  title: string;
  updatedNote?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-clip">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-gradient-brand focus:px-4 focus:py-2 focus:text-sm focus:text-foreground"
      >
        Pular para o conteúdo
      </a>

      <header className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-4xl px-5 sm:px-6 h-16 md:h-20 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cyan"
            aria-label="Zentera Virtua — Voltar ao início"
          >
            <Logo className="h-9 md:h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-foreground transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Voltar ao início</span>
              <span className="sr-only sm:hidden">Voltar ao início</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="conteudo" className="mx-auto w-full max-w-3xl px-5 sm:px-6 py-12 sm:py-16 lg:py-24">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.08] text-balance">
          {title}
        </h1>
        {updatedNote && <p className="mt-4 text-sm text-text-subtle">{updatedNote}</p>}
        <div className="legal-content mt-10">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
