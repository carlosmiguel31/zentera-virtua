import { motion, useReducedMotion } from "framer-motion";
import logoCropped from "@/assets/zentera-virtua-logo-cropped.png";

/**
 * Logo oficial da Zentera Virtua.
 *
 * Usa a versão recortada do arquivo oficial (apenas o excesso de transparência
 * foi removido — nenhum pixel visível, cor ou proporção foi alterado).
 * Para substituir a marca, troque os arquivos em `src/assets` mantendo o mesmo nome.
 */
export function Logo({
  className = "h-9 w-auto",
  withGlow = false,
}: {
  className?: string;
  withGlow?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <span className="relative inline-flex items-center">
      {withGlow && (
        <motion.span
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full blur-2xl"
          style={{
            background: "radial-gradient(closest-side, rgba(79,178,198,0.25), transparent 70%)",
          }}
          animate={reduce ? undefined : { opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <img
        src={logoCropped}
        alt="Zentera Virtua"
        className={`${className} object-contain`}
        draggable={false}
      />
    </span>
  );
}
