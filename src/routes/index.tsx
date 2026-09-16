import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/zentera/Header";
import { Hero } from "@/components/zentera/Hero";
import { SpecializedAgents } from "@/components/zentera/SpecializedAgents";
import { Multichannel } from "@/components/zentera/Multichannel";
import { FinalCTA } from "@/components/zentera/FinalCTA";
import { ContactForm } from "@/components/zentera/ContactForm";
import { Footer } from "@/components/zentera/Footer";
import { absoluteUrl, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => {
    const canonical = absoluteUrl("/");
    const ogImage = absoluteUrl("/og-image.png") ?? "/og-image.png";
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      ...(canonical ? { url: canonical } : {}),
      ...(absoluteUrl("/og-image.png") ? { logo: absoluteUrl("/og-image.png") } : {}),
    };
    return {
      meta: [
        { title: SITE_TITLE },
        { name: "description", content: SITE_DESCRIPTION },
        {
          name: "keywords",
          content:
            "atendimento com inteligência artificial, agentes de IA, automação de atendimento, atendimento via WhatsApp, chatbot inteligente, suporte automatizado, agente virtual, atendimento multicanal",
        },
        { property: "og:title", content: SITE_TITLE },
        { property: "og:description", content: SITE_DESCRIPTION },
        { property: "og:type", content: "website" },
        ...(canonical ? [{ property: "og:url", content: canonical }] : []),
        { property: "og:image", content: ogImage },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: SITE_TITLE },
        { name: "twitter:description", content: SITE_DESCRIPTION },
        { name: "twitter:image", content: ogImage },
      ],
      links: canonical ? [{ rel: "canonical", href: canonical }] : [],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLd),
        },
      ],
    };
  },
});

function Index() {
  return (
    <div id="top" className="relative min-h-screen bg-background text-foreground overflow-x-clip">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-gradient-brand focus:px-4 focus:py-2 focus:text-sm focus:text-foreground"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <SpecializedAgents />
        <Multichannel />
        <FinalCTA />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
