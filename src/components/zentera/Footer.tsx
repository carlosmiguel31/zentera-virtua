import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const navLinks = [
  { href: "/#solucao", label: "Solução" },
  { href: "/#agentes", label: "Agentes" },
  { href: "/#multicanal", label: "Multicanal" },
  { href: "/#contato", label: "Contato" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-[rgba(79,178,198,0.12)] py-10 sm:py-14">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-10">
        <div className="md:col-span-2">
          <Logo className="h-11 w-auto" />
          <p className="mt-5 text-sm text-text-muted max-w-sm">
            Zentera Virtua — Inteligência que transforma conversas em soluções.
          </p>
        </div>
        <nav aria-label="Navegação do rodapé">
          <div className="text-xs uppercase tracking-[0.18em] text-text-subtle">Navegação</div>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-text-muted hover:text-foreground transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Contato e informações legais">
          <div className="text-xs uppercase tracking-[0.18em] text-text-subtle">
            Contato & Legal
          </div>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a
                href="/#contato"
                className="text-text-muted hover:text-foreground transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
              >
                Fale conosco
              </a>
            </li>
            <li>
              <Link
                to="/politica-de-privacidade"
                className="text-text-muted hover:text-foreground transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
              >
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link
                to="/termos-de-uso"
                className="text-text-muted hover:text-foreground transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
              >
                Termos de Uso
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-10 mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-3 text-xs text-text-subtle">
        <div>© {new Date().getFullYear()} Zentera Virtua. Todos os direitos reservados.</div>
        <div>Desenvolvido para um atendimento ágil, autônomo e inteligente.</div>
      </div>
    </footer>
  );
}
