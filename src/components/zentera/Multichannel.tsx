import { motion, useReducedMotion } from "framer-motion";
import { MessageSquare, Globe, Mail, Send, Webhook, Headphones, Sparkles } from "lucide-react";
import { SectionHeading } from "./shared/SectionHeading";

const channels = [
  { name: "WhatsApp", icon: MessageSquare },
  { name: "Chat no site", icon: Globe },
  { name: "E-mail", icon: Mail },
  { name: "Telegram", icon: Send },
  { name: "APIs e webhooks", icon: Webhook },
  { name: "Plataformas de atendimento", icon: Headphones },
];

export function Multichannel() {
  const reduce = useReducedMotion();
  return (
    <section
      id="multicanal"
      className="relative py-20 sm:py-24 lg:py-28 overflow-hidden"
      aria-labelledby="multicanal-titulo"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-10">
        <SectionHeading
          eyebrow="Multicanal"
          title={
            <span id="multicanal-titulo">
              Uma inteligência. <span className="text-gradient-brand">Todos os canais.</span>
            </span>
          }
          subtitle="Ofereça uma experiência consistente independentemente de onde a conversa começar."
        />

        {/* Versão mobile: lista vertical simples no lugar do diagrama radial */}
        <ul className="mt-10 grid grid-cols-1 gap-3 sm:hidden">
          {channels.map((c) => {
            const Icon = c.icon;
            return (
              <li key={c.name} className="surface-card flex items-center gap-3 rounded-2xl p-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card/60 border border-border">
                  <Icon className="h-5 w-5 text-brand-cyan" aria-hidden />
                </span>
                <span className="text-sm text-foreground">{c.name}</span>
              </li>
            );
          })}
        </ul>

        <div className="relative mt-10 lg:mt-14 mx-auto hidden max-w-4xl sm:block sm:aspect-[5/3]">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-gradient-brand glow-brand flex items-center justify-center">
            <div className="absolute inset-2 rounded-full bg-background/60 backdrop-blur-xl flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-brand-cyan" aria-hidden />
            </div>
            {!reduce && (
              <>
                <motion.div
                  aria-hidden
                  className="absolute inset-0 rounded-full border border-[rgba(79,178,198,0.4)]"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
                <motion.div
                  aria-hidden
                  className="absolute inset-0 rounded-full border border-[rgba(54,50,113,0.5)]"
                  animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 1.2,
                  }}
                />
              </>
            )}
          </div>

          {channels.map((c, i) => {
            const angle = (i / channels.length) * Math.PI * 2 - Math.PI / 2;
            const rx = 42;
            const ry = 38;
            const left = 50 + Math.cos(angle) * rx;
            const top = 50 + Math.sin(angle) * ry;
            const Icon = c.icon;
            return (
              <motion.div
                key={c.name}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                whileInView={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: reduce ? 0.3 : 0.6,
                  delay: reduce ? 0 : i * 0.08,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${left}%`, top: `${top}%` }}
              >
                <div className="group flex flex-col items-center gap-2">
                  <div className="relative h-16 w-16 rounded-full surface-card flex items-center justify-center group-hover:border-[rgba(79,178,198,0.35)] transition-colors">
                    <Icon className="h-6 w-6 text-brand-cyan" aria-hidden />
                  </div>
                  <div className="text-xs text-text-muted whitespace-nowrap">{c.name}</div>
                </div>
              </motion.div>
            );
          })}

          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4FB2C6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#363271" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {channels.map((_, i) => {
              const angle = (i / channels.length) * Math.PI * 2 - Math.PI / 2;
              const left = 50 + Math.cos(angle) * 42;
              const top = 50 + Math.sin(angle) * 38;
              return (
                <line
                  key={i}
                  x1={left}
                  y1={top}
                  x2={50}
                  y2={50}
                  stroke="url(#line-grad)"
                  strokeWidth="0.15"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
