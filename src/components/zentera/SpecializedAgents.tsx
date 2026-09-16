import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  LifeBuoy,
  TrendingUp,
  Wallet,
  BadgeDollarSign,
  CalendarClock,
  HeartHandshake,
  Info,
  MousePointerClick,
} from "lucide-react";
import { SectionHeading } from "./shared/SectionHeading";

type Agent = {
  id: string;
  label: string;
  items: string[];
  icon: React.ComponentType<{ className?: string }>;
};

const agents: Agent[] = [
  {
    id: "comercial",
    label: "Comercial",
    items: ["Contratação", "Upgrade", "Downgrade", "Indique e Ganhe"],
    icon: TrendingUp,
  },
  {
    id: "suporte",
    label: "Suporte",
    items: [
      "Lentidão",
      "Oscilação",
      "LOS",
      "Reincidências Técnicas",
      "Mudança de Endereço",
      "Troca de Titularidade",
      "Portabilidade",
    ],
    icon: LifeBuoy,
  },
  {
    id: "financeiro",
    label: "Financeiro",
    items: [
      "Formas de Pagamento",
      "Local de Pagamento",
      "Alteração da Data de Vencimento",
      "Desconto em Fatura",
      "Prorrogação de Fatura",
      "Proporcionalidade – Multa e pro-rata",
      "Desbloqueio em Confiança",
      "2ª Via da Fatura",
      "Reprocessamento – Cartão de Crédito",
      "Suspensão temporária",
    ],
    icon: Wallet,
  },
  {
    id: "cobranca",
    label: "Cobrança",
    items: ["Renegociações", "Reativação de Contrato", "Negativação"],
    icon: BadgeDollarSign,
  },
  {
    id: "agendamento",
    label: "Agendamento",
    items: ["Agendamento", "Reagendamento", "Cancelamento – Visita Técnica"],
    icon: CalendarClock,
  },
  {
    id: "retencao",
    label: "Retenção",
    items: ["Insatisfação", "Concorrente", "Mudança s/ Viabilidade", "Redução de Custos"],
    icon: HeartHandshake,
  },
  {
    id: "informacao",
    label: "Informação / Reclamação",
    items: ["SVAS", "NFCOM", "Outros"],
    icon: Info,
  },
];

export function SpecializedAgents() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const reduce = useReducedMotion();
  const baseId = useId();
  const panelId = `${baseId}-painel`;
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const current = agents.find((a) => a.id === openId) ?? null;

  const openAt = (index: number) => {
    const next = (index + agents.length) % agents.length;
    setOpenId(agents[next].id);
    btnRefs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        openAt(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        openAt(index - 1);
        break;
      case "Home":
        e.preventDefault();
        openAt(0);
        break;
      case "End":
        e.preventDefault();
        openAt(agents.length - 1);
        break;
      case "Escape":
        setOpenId(null);
        setPinned(false);
        break;
    }
  };

  return (
    <section
      id="agentes"
      className="relative py-20 sm:py-24 lg:py-28"
      aria-labelledby="agentes-titulo"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-10">
        <SectionHeading
          eyebrow="Agentes especializados"
          title={
            <span id="agentes-titulo">
              Um agente para cada necessidade.
              <br />
              <span className="text-gradient-brand">Uma experiência conectada.</span>
            </span>
          }
        />

        <div
          onMouseLeave={() => {
            if (!pinned) setOpenId(null);
          }}
        >
          <div
            role="group"
            aria-label="Agentes especializados"
            className="mt-8 grid grid-cols-2 gap-2 sm:mt-10 sm:flex sm:flex-wrap sm:justify-center sm:gap-2.5"
          >
            {agents.map((a, i) => {
              const isOpen = a.id === openId;
              return (
                <button
                  key={a.id}
                  ref={(el) => {
                    btnRefs.current[i] = el;
                  }}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onMouseEnter={() => setOpenId(a.id)}
                  onFocus={() => setOpenId(a.id)}
                  onClick={() => {
                    if (isOpen && pinned) {
                      setPinned(false);
                      setOpenId(null);
                    } else {
                      setPinned(true);
                      setOpenId(a.id);
                    }
                  }}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={`min-h-11 w-full rounded-full px-4 py-2.5 text-sm font-medium sm:w-auto sm:px-6 sm:py-3 sm:text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan ${
                    isOpen
                      ? "bg-gradient-brand text-foreground glow-brand"
                      : "border border-input text-text-muted hover:text-foreground hover:border-[rgba(79,178,198,0.3)]"
                  }`}
                >
                  {a.label}
                </button>
              );
            })}
          </div>

          <div
            id={panelId}
            role="region"
            aria-label="Tipos de atendimento do agente selecionado"
            className="mt-6 sm:mt-8 mx-auto max-w-5xl min-h-[220px] sm:min-h-[200px]"
          >
            <AnimatePresence mode="wait">
              {current ? (
                <motion.div
                  key={current.id}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0.15 : 0.32, ease: "easeOut" }}
                  className="surface-card rounded-3xl p-5 sm:p-7 lg:p-8"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-2xl bg-gradient-brand inline-flex items-center justify-center">
                      <current.icon className="h-5 w-5 text-foreground" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold tracking-tight">
                        {current.label}
                      </h3>
                      <p className="text-xs uppercase tracking-[0.16em] text-text-subtle">
                        Tipos de atendimento
                      </p>
                    </div>
                  </div>

                  <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {current.items.map((item, i) => (
                      <motion.li
                        key={item}
                        initial={reduce ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: reduce ? 0 : 0.3,
                          delay: reduce ? 0 : 0.04 + i * 0.025,
                          ease: "easeOut",
                        }}
                        className="flex items-start gap-3 text-sm text-foreground"
                      >
                        <span
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-cyan"
                          aria-hidden
                        />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0.15 : 0.3 }}
                  className="flex min-h-[220px] sm:min-h-[200px] items-center justify-center rounded-3xl border border-dashed border-border px-6 text-center"
                >
                  <p className="inline-flex items-center gap-2 text-sm text-text-subtle">
                    <MousePointerClick className="h-4 w-4 text-brand-cyan" aria-hidden />
                    Selecione um tipo de atendimento para ver as opções.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
