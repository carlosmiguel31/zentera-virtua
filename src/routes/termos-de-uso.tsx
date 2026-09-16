import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/zentera/LegalLayout";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/termos-de-uso")({
  component: TermsOfUsePage,
  head: () => {
    const canonical = absoluteUrl("/termos-de-uso");
    return {
      meta: [
        { title: `Termos de Uso | ${SITE_NAME}` },
        {
          name: "description",
          content: "Condições gerais de uso do site da Zentera Virtua.",
        },
        { name: "robots", content: "index, follow" },
      ],
      links: canonical ? [{ rel: "canonical", href: canonical }] : [],
    };
  },
});

function TermsOfUsePage() {
  return (
    <LegalLayout
      title="Termos de Uso"
      updatedNote="Versão inicial — este texto deve passar por revisão jurídica antes da publicação definitiva."
    >
      <h2>1. Aceitação dos termos</h2>
      <p>
        Ao acessar e utilizar este site, você concorda com estes Termos de Uso. Caso não concorde
        com alguma condição, recomendamos que interrompa a navegação.
      </p>

      <h2>2. Objeto do site</h2>
      <p>
        Este site tem caráter institucional e informativo, apresentando a solução de agentes de
        inteligência artificial para atendimento oferecida pela Zentera Virtua e permitindo o envio
        de solicitações de contato e demonstração.
      </p>

      <h2>3. Conteúdo informativo e demonstrações</h2>
      <p>
        As demonstrações exibidas nas páginas são ilustrativas e têm o objetivo de exemplificar como
        um agente pode conduzir um atendimento. A experiência final pode ser personalizada conforme
        as regras, canais e sistemas de cada operação, e as funcionalidades disponíveis podem variar
        de acordo com o escopo contratado.
      </p>

      <h2>4. Propriedade intelectual</h2>
      <p>
        A marca Zentera Virtua, sua identidade visual, os textos e os demais elementos deste site
        são protegidos pela legislação aplicável. É vedada a reprodução ou o uso sem autorização
        prévia.
      </p>

      <h2>5. Responsabilidades do usuário</h2>
      <p>Ao utilizar o site, você se compromete a:</p>
      <ul>
        <li>fornecer informações verdadeiras nos formulários;</li>
        <li>não utilizar o site para fins ilícitos ou abusivos;</li>
        <li>não tentar comprometer a segurança ou o funcionamento do site.</li>
      </ul>

      <h2>6. Limitação de responsabilidade</h2>
      <p>
        Empregamos esforços razoáveis para manter as informações do site atualizadas e o serviço
        disponível, mas não garantimos disponibilidade ininterrupta nem a ausência de eventuais
        imprecisões, que serão corrigidas assim que identificadas.
      </p>

      <h2>7. Privacidade</h2>
      <p>
        O tratamento de dados pessoais realizado por meio deste site é descrito na nossa{" "}
        <a href="/politica-de-privacidade">Política de Privacidade</a>.
      </p>

      <h2>8. Alterações destes termos</h2>
      <p>
        Estes termos podem ser atualizados periodicamente. A versão vigente será sempre a publicada
        nesta página.
      </p>

      <p className="legal-note">
        Observação: este é um texto inicial de caráter genérico. Antes da publicação definitiva do
        site, ele deve ser revisado por um profissional jurídico e complementado com os dados
        oficiais da empresa.
      </p>
    </LegalLayout>
  );
}
