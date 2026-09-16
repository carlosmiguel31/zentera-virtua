import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import logoCropped from "@/assets/zentera-virtua-logo-cropped.png";

export function FinalCTA() {
  const reduce = useReducedMotion();
  return (
    <section
      id="conversa"
      className="relative py-24 sm:py-28 lg:py-32 overflow-hidden"
      aria-labelledby="cta-final-titulo"
    >
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.08]"
        animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src={logoCropped} alt="" className="w-[min(720px,90vw)] max-w-none" />
      </motion.div>
      <div
        aria-hidden
        className="ambient-orb h-[520px] w-[520px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          background: "radial-gradient(closest-side, #363271, transparent)",
          opacity: 0.35,
        }}
      />

      <div className="relative mx-auto w-full max-w-4xl px-5 sm:px-6 text-center">
        <motion.h2
          id="cta-final-titulo"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.3 : 0.9 }}
          className="break-words text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-balance"
        >
          O futuro do atendimento começa{" "}
          <span className="text-gradient-brand">com uma conversa.</span>
        </motion.h2>
        <motion.p
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: reduce ? 0.3 : 0.9,
            delay: reduce ? 0 : 0.15,
          }}
          className="mt-6 text-lg text-text-muted"
        >
          Descubra como agentes inteligentes podem transformar a experiência dos seus clientes e a
          produtividade da sua equipe.
        </motion.p>
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.3 : 0.9, delay: reduce ? 0 : 0.3 }}
          className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center"
        >
          <a
            href="#contato"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-4 sm:w-auto text-sm font-medium bg-gradient-brand text-foreground glow-brand hover:opacity-95 transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cyan"
          >
            Solicitar uma demonstração <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <a
            href="#contato"
            className="inline-flex w-full items-center justify-center rounded-full px-7 py-4 sm:w-auto text-sm font-medium border border-[rgba(79,178,198,0.22)] text-foreground hover:bg-secondary transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cyan"
          >
            Falar com um especialista
          </a>
        </motion.div>
      </div>
    </section>
  );
}
