import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, fadeOnly, viewportOnce } from "./motion";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  center?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={reduce ? fadeOnly : fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={`${center ? "text-center mx-auto" : ""} max-w-3xl`}
    >
      {eyebrow && (
        <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(79,178,198,0.2)] bg-card/60 px-3 py-1 text-xs uppercase tracking-[0.18em] text-text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" aria-hidden />
          {eyebrow}
        </div>
      )}
      <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-tight text-balance leading-[1.1]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-text-muted leading-relaxed text-balance">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
