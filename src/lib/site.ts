/**
 * Helpers de URL do site.
 *
 * `VITE_SITE_URL` deve conter a URL pública final (ex.: https://www.seudominio.com.br).
 * Enquanto a variável não estiver configurada, nenhuma URL absoluta é inventada:
 * os metadados que exigem URL absoluta (canonical, og:url) são simplesmente omitidos
 * e `og:image` usa caminho relativo como fallback.
 */
export function absoluteUrl(path = "/"): string | undefined {
  const base = import.meta.env.VITE_SITE_URL as string | undefined;
  if (!base) return undefined;
  try {
    return new URL(path, base.endsWith("/") ? base : `${base}/`).toString();
  } catch {
    return undefined;
  }
}

export const SITE_NAME = "Zentera Virtua";
export const SITE_TITLE = "Zentera Virtua | Atendimento com Inteligência Artificial";
export const SITE_DESCRIPTION =
  "Agentes inteligentes para atendimento, suporte e automação. Integre inteligência artificial aos seus canais e sistemas para oferecer experiências mais rápidas, personalizadas e eficientes.";
