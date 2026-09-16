import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/zentera/LegalLayout";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/politica-de-privacidade")({
  component: PrivacyPolicyPage,
  head: () => {
    const canonical = absoluteUrl("/politica-de-privacidade");
    return {
      meta: [
        { title: `Política de Privacidade | ${SITE_NAME}` },
        {
          name: "description",
          content:
            "Saiba como a Zentera Virtua trata os dados pessoais coletados por meio deste site.",
        },
        { name: "robots", content: "index, follow" },
      ],
      links: canonical ? [{ rel: "canonical", href: canonical }] : [],
    };
  },
});

function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Política de Privacidade"
      updatedNote="Versão inicial — este texto deve passar por revisão jurídica antes da publicação definitiva."
    >
      <h2>1. Sobre esta política</h2>
      <p>
        Esta Política de Privacidade descreve, de forma geral, como a Zentera Virtua trata os dados
        pessoais coletados por meio deste site, em conformidade com a Lei Geral de Proteção de Dados
        Pessoais (Lei nº 13.709/2018 — LGPD).
      </p>

      <h2>2. Dados coletados</h2>
      <p>
        Ao preencher o formulário de contato, você pode fornecer voluntariamente: nome, empresa,
        e-mail, telefone, volume aproximado de atendimentos, canal principal de atendimento e uma
        mensagem livre.
      </p>

      <h2>3. Finalidade do tratamento</h2>
      <p>Os dados informados são utilizados exclusivamente para:</p>
      <ul>
        <li>responder à sua solicitação de contato ou demonstração;</li>
        <li>entender o cenário da sua operação para apresentar a solução adequada;</li>
        <li>manter comunicação comercial relacionada ao seu interesse.</li>
      </ul>

      <h2>4. Compartilhamento</h2>
      <p>
        Os dados não são vendidos. Eles podem ser processados por ferramentas utilizadas
        internamente para receber e organizar solicitações de contato, sempre limitadas às
        finalidades descritas acima.
      </p>

      <h2>5. Armazenamento e segurança</h2>
      <p>
        Adotamos medidas razoáveis para proteger as informações recebidas contra acessos não
        autorizados, mantendo-as apenas pelo tempo necessário para as finalidades informadas.
      </p>

      <h2>6. Seus direitos</h2>
      <p>
        Nos termos da LGPD, você pode solicitar a confirmação do tratamento, o acesso, a correção ou
        a exclusão dos seus dados pessoais, além de revogar consentimentos concedidos. Para exercer
        esses direitos, utilize o formulário de contato disponível no site.
      </p>

      <h2>7. Cookies e tecnologias semelhantes</h2>
      <p>
        Este site pode utilizar tecnologias essenciais ao seu funcionamento. Caso ferramentas de
        análise ou marketing venham a ser adotadas, esta política será atualizada para refletir o
        uso dessas tecnologias.
      </p>

      <h2>8. Alterações desta política</h2>
      <p>
        Esta política pode ser atualizada periodicamente. Recomendamos a consulta regular desta
        página para acompanhar eventuais mudanças.
      </p>

      <p className="legal-note">
        Observação: este é um texto inicial de caráter genérico. Antes da publicação definitiva do
        site, ele deve ser revisado por um profissional jurídico e complementado com os dados
        oficiais da empresa (razão social, CNPJ, canais de contato do encarregado de dados, entre
        outros).
      </p>
    </LegalLayout>
  );
}
