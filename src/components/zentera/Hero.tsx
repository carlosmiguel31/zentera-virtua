import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export function Hero() {
  const reduce = useReducedMotion();

  const enter = (delay: number) =>
    reduce
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.3 },
        }
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.9,
            delay,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    <section
      id="solucao"
      className="relative flex min-h-[calc(100svh-64px)] items-center overflow-hidden pb-16 pt-24 sm:pb-20 sm:pt-28 lg:min-h-[calc(100svh-80px)]"
    >
      <div
        aria-hidden
        className="ambient-orb hidden sm:block h-[560px] w-[560px] -top-40 -left-40"
        style={{
          background: "radial-gradient(closest-side, #363271, transparent)",
        }}
      />
      <div
        aria-hidden
        className="ambient-orb hidden sm:block h-[500px] w-[500px] top-1/3 -right-32"
        style={{
          background: "radial-gradient(closest-side, #4FB2C6, transparent)",
          opacity: 0.25,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-center">
        <div className="lg:col-span-5">
          <motion.div
            {...enter(0)}
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(79,178,198,0.22)] bg-card/60 px-3 py-1.5 text-xs text-text-muted"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-cyan" aria-hidden />
            Plataforma de agentes inteligentes
          </motion.div>

          <h1 className="mt-5 break-words text-[1.75rem] sm:text-4xl lg:text-[2.5rem] xl:text-5xl font-semibold tracking-tight leading-[1.1] text-balance">
            <motion.span {...enter(0.1)} className="block">
              <span className="text-gradient-brand">ISPs</span>,
            </motion.span>
            <motion.span {...enter(0.16)} className="block">
              O FUTURO DO ATENDIMENTO
            </motion.span>
            <motion.span {...enter(0.22)} className="block">
              JÁ COMEÇOU!
            </motion.span>
          </h1>

          <motion.p
            {...enter(0.3)}
            className="mt-5 max-w-lg text-base sm:text-lg lg:text-xl font-medium leading-snug text-foreground text-balance"
          >
            Descubra o poder da <span className="text-gradient-brand">Zentera Virtua</span> e escale
            sua operação 24/7!
          </motion.p>

          <motion.p
            {...enter(0.42)}
            className="mt-4 max-w-lg text-sm sm:text-base text-text-muted leading-relaxed"
          >
            A Inteligência Artificial que usa agentes autônomos para resolver demandas complexas,
            reduzindo custos sem aumentar sua equipe.
          </motion.p>

          <motion.div
            {...enter(0.54)}
            className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center"
          >
            <a
              href="#agentes"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full sm:w-auto px-6 py-3.5 text-sm font-medium bg-gradient-brand text-foreground glow-brand hover:opacity-95 transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cyan"
            >
              Conhecer a solução <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href="#contato"
              className="inline-flex w-full items-center justify-center rounded-full sm:w-auto px-6 py-3.5 text-sm font-medium border border-[rgba(79,178,198,0.22)] text-foreground hover:bg-secondary transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cyan"
            >
              Solicitar demonstração
            </a>
          </motion.div>

          <motion.p {...enter(0.7)} className="mt-6 text-sm text-text-subtle">
            WhatsApp, chat, e-mail, Telegram e integrações personalizadas.
          </motion.p>
        </div>

        <div className="lg:col-span-7">
          <HeroConversation />
        </div>
      </div>
    </section>
  );
}

type Msg =
  | { role: "user"; text: string }
  | { role: "ai"; text: string }
  | { role: "system"; text: string };

/** Roteiro fixo do fluxo Comercial exibido na demonstração do Hero. */
const script: Msg[] = [
  { role: "user", text: "Quero contratar" },
  { role: "system", text: "Intenção identificada: Comercial" },
  {
    role: "ai",
    text: "Sou a Ana do setor Comercial e vou prosseguir com seu atendimento. Me informe seu nome, por gentileza!",
  },
  { role: "user", text: "Marcos" },
  { role: "ai", text: "Marcos, você já conhece os nossos planos?" },
  { role: "user", text: "Não" },
  {
    role: "ai",
    text: "Entendi! Mas antes de te passar os planos, você pretende usar a internet mais para jogos online ou trabalho em home office? Assim consigo te indicar o plano ideal para a sua rotina.",
  },
];

/** Atraso até o próximo evento: mensagens maiores respiram um pouco mais. */
const gapAfter = (text: string) => Math.min(1100, 600 + text.length * 6);

/** Tempo com o indicador "digitando" visível antes de uma fala do agente. */
const typingFor = (text: string) => Math.min(1000, 550 + text.length * 2.5);

const START_DELAY = 600;

function HeroConversation() {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // A sequência começa quando o Hero aparece na viewport — e apenas uma vez
  // por carregamento da página.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setStarted(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Sequência automática por timers. Sem qualquer dependência de rolagem.
  useEffect(() => {
    if (!started) return;

    if (reduce) {
      setCount(script.length);
      setTyping(false);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    let at = START_DELAY;

    script.forEach((msg, index) => {
      if (msg.role === "ai") {
        timers.push(setTimeout(() => setTyping(true), at));
        at += typingFor(msg.text);
        timers.push(
          setTimeout(() => {
            setTyping(false);
            setCount(index + 1);
          }, at),
        );
      } else {
        timers.push(setTimeout(() => setCount(index + 1), at));
      }
      at += gapAfter(msg.text);
    });

    return () => timers.forEach(clearTimeout);
  }, [started, reduce]);

  // Auto-scroll APENAS dentro do container da conversa: a página nunca se move.
  useEffect(() => {
    if (reduce) return;
    const el = chatRef.current;
    if (!el || count === 0) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [count, typing, reduce]);

  const visible = script.slice(0, count);

  return (
    <motion.div
      ref={sectionRef}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0.3 : 1,
        delay: reduce ? 0 : 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative"
      aria-label="Demonstração ilustrativa de um atendimento comercial conduzido por um agente Zentera"
    >
      <div
        className="absolute -inset-6 rounded-[2rem] bg-gradient-brand opacity-20 blur-3xl"
        aria-hidden
      />
      <div className="relative surface-card rounded-3xl p-4 sm:p-6 md:p-7">
        <div className="flex items-center justify-between gap-3 text-xs text-text-subtle">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full bg-brand-cyan ${reduce ? "" : "animate-pulse"}`}
              aria-hidden
            />
            Exemplo de fluxo: Comercial
          </div>
          <div className="hidden sm:block">Canal de mensagens</div>
        </div>

        <div
          ref={chatRef}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          className="mt-5 h-[300px] space-y-3 overflow-y-auto pr-1 sm:h-[380px] lg:h-[420px]"
        >
          {visible.map((m, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "system" ? (
                <div className="w-full flex items-center gap-3 text-xs text-text-muted">
                  <div className="h-px flex-1 bg-border" aria-hidden />
                  <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(79,178,198,0.2)] px-3 py-1 bg-card/60">
                    <Sparkles className="h-3.5 w-3.5 text-brand-cyan" aria-hidden />
                    {m.text}
                  </div>
                  <div className="h-px flex-1 bg-border" aria-hidden />
                </div>
              ) : (
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[80%] ${
                    m.role === "user"
                      ? "bg-secondary border border-border rounded-br-sm"
                      : "text-foreground rounded-bl-sm"
                  }`}
                  style={
                    m.role === "ai"
                      ? {
                          background:
                            "linear-gradient(135deg, rgba(54,50,113,0.5), rgba(79,178,198,0.25))",
                          border: "1px solid rgba(79,178,198,0.25)",
                        }
                      : undefined
                  }
                >
                  {m.text}
                </div>
              )}
            </motion.div>
          ))}

          {typing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
              aria-hidden
            >
              <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-[rgba(79,178,198,0.25)] bg-card/60 px-4 py-3.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan/80 animate-pulse" />
                <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan/55 animate-pulse [animation-delay:160ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan/30 animate-pulse [animation-delay:320ms]" />
              </div>
            </motion.div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-text-subtle">
          Conteúdo fictício, sem dados pessoais reais.
        </p>
      </div>
    </motion.div>
  );
}
