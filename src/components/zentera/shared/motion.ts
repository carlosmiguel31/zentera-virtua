import type { Variants } from "framer-motion";

/** Revelação suave usada nas seções. Com movimento reduzido, os componentes
 * devem trocar por `fadeOnly` ou desativar a animação. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};

export const viewportOnce = { once: true, amount: 0.3 } as const;
