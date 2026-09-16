# Zentera Virtua — Landing Page

Landing page institucional da **Zentera Virtua**, plataforma de agentes de inteligência artificial para atendimento, suporte, triagem e automação — com handoff para atendimento humano quando necessário.

## Tecnologias

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite 8](https://vite.dev) com [TanStack Start](https://tanstack.com/start) (SSR) e [TanStack Router](https://tanstack.com/router) (rotas por arquivo)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Framer Motion](https://motion.dev) (animações, com suporte a `prefers-reduced-motion`)
- [Lucide React](https://lucide.dev) (ícones)
- Gerenciador de pacotes: **Bun** (lockfile `bun.lock` — não troque o gerenciador)

## Requisitos

- [Bun](https://bun.sh) 1.x instalado
- Node.js 20+ (usado pelo Vite/Nitro durante build e desenvolvimento)

## Instalação

```bash
bun install
```

## Desenvolvimento

```bash
bun run dev
```

O site fica disponível no endereço indicado no terminal (por padrão, `http://localhost:8080` ou a porta configurada pelo ambiente).

## Variáveis de ambiente

Copie o arquivo de exemplo e preencha os valores:

```bash
cp .env.example .env
```

| Variável                   | Obrigatória?                | Descrição                                                                                                              |
| -------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `VITE_CONTACT_WEBHOOK_URL` | Para o formulário funcionar | URL que recebe os envios do formulário de contato via `POST` em JSON.                                                  |
| `VITE_SITE_URL`            | Para SEO completo           | URL pública final do site (ex.: `https://www.seudominio.com.br`), usada em canonical, `og:url` e `og:image` absolutos. |

**Importante sobre segurança:** variáveis com prefixo `VITE_` são embutidas no bundle e ficam **visíveis no navegador**. Nunca coloque tokens, chaves ou segredos nelas. Se o destino do webhook exigir autenticação por segredo, use um intermediário do lado do servidor (n8n, API própria, função serverless) que guarde o segredo e exponha apenas uma URL pública de recebimento.

### Formato do payload enviado pelo formulário

```json
{
  "name": "…",
  "company": "…",
  "email": "…",
  "phone": "…",
  "mainChannel": "…",
  "privacyAccepted": true,
  "source": "zentera-virtua-landing-page",
  "submittedAt": "2026-01-01T12:00:00.000Z"
}
```

Comportamento do formulário quando `VITE_CONTACT_WEBHOOK_URL` não está configurada:

- **Desenvolvimento:** mensagem clara indicando a variável ausente.
- **Produção:** mensagem amigável de indisponibilidade — o formulário **nunca** simula sucesso.

## Build de produção

```bash
bun run build
```

A saída é gerada em `.output/` (Nitro, com alvo padrão Cloudflare configurado pelo template do Lovable).

Para visualizar o build:

```bash
bun run preview
```

> Observação: o template usa Nitro com alvo Cloudflare Workers. Dependendo do ambiente local, o `preview` pode exigir as ferramentas da plataforma de deploy (ex.: Wrangler). O deploy pode ser feito com `npx nitro deploy --prebuilt` ou pela plataforma escolhida.

## Publicação — checklist

1. Definir `VITE_SITE_URL` com o domínio final e refazer o build.
2. Definir `VITE_CONTACT_WEBHOOK_URL` com a URL real do webhook.
3. Em `public/sitemap.xml`, substituir o marcador `{{SITE_URL}}` pelo domínio final e remover o comentário.
4. Em `public/robots.txt`, adicionar a linha `Sitemap: https://SEU-DOMINIO/sitemap.xml`.
5. Revisar juridicamente os textos de **Política de Privacidade** e **Termos de Uso** (ver abaixo).

## Política de Privacidade e Termos de Uso

Os conteúdos estão em:

- `src/routes/politica-de-privacidade.tsx`
- `src/routes/termos-de-uso.tsx`

Ambos são **textos iniciais genéricos** e **devem passar por revisão jurídica profissional** antes da publicação definitiva. Complete-os com os dados oficiais da empresa (razão social, CNPJ, contatos, encarregado de dados etc.) — nenhum dado jurídico foi inventado no projeto.

## Identidade visual e logo

- Arquivo oficial: `src/assets/zentera-virtua-logo.png` (intacto).
- Versão recortada usada na interface: `src/assets/zentera-virtua-logo-cropped.png` — apenas o excesso de área transparente foi removido; nenhum pixel visível, cor, gradiente ou proporção foi alterado.
- Favicons (`public/favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`) foram gerados a partir do **símbolo** oficial, sem redesenho.
- Imagem de compartilhamento: `public/og-image.png` (1200×630), usa a logo oficial sem alterações.

**Para substituir a logo sem quebrar a identidade:** troque `src/assets/zentera-virtua-logo.png` e gere novamente a versão recortada com o mesmo nome (`zentera-virtua-logo-cropped.png`), recortando apenas a transparência excedente. Regere os favicons a partir do novo símbolo, mantendo os mesmos nomes de arquivos em `public/`. Não recolora, não distorça e não redesenhe a marca.

## Temas (escuro e claro)

A landing page possui dois temas: **escuro** (padrão) e **claro**. A alternância fica no botão do cabeçalho (ícone de sol no tema escuro, lua no claro), presente no desktop, no celular e no cabeçalho das páginas legais.

- **Tema padrão da primeira visita:** escuro.
- **Persistência:** a preferência é salva em `localStorage` na chave `zentera-theme`, com os valores `dark` ou `light`. Ao recarregar, o tema escolhido é mantido.
- **Sem flash incorreto:** um script mínimo é injetado no `<head>` e roda antes da pintura (compatível com o SSR do TanStack Start), aplicando a classe (`dark`/`light`) no `<html>`, definindo `color-scheme` e atualizando a meta tag `theme-color` (`#050609` no escuro, `#f4f7fa` no claro).
- **Implementação:** `src/components/zentera/ThemeProvider.tsx` (contexto, persistência e script de init) e `src/components/zentera/ThemeToggle.tsx` (botão).

O tema claro reutiliza a identidade oficial (violeta, índigo, azul, azul-petróleo, ciano e o mesmo gradiente da marca). Os tokens dos dois temas ficam em `src/styles.css` (`:root`/`.dark` para o escuro e `.light` para o claro). Componentes usam tokens semânticos (`bg-card`, `bg-secondary`, `border-border`, `border-input`, `text-foreground`, `text-muted`, etc.) em vez de cores fixas, de modo que funcionam nos dois temas. A logo não recebe nenhum filtro e permanece idêntica.

## Scripts disponíveis

```bash
bun run dev        # servidor de desenvolvimento
bun run build      # build de produção
bun run build:dev  # build em modo development
bun run preview    # pré-visualização do build
bun run lint       # ESLint
bun run format     # Prettier
```

## Estrutura principal

```text
src/
  routes/                      # rotas (TanStack Router, por arquivo)
    __root.tsx                 # documento, <head>, 404 e erro
    index.tsx                  # página inicial
    politica-de-privacidade.tsx
    termos-de-uso.tsx
  components/zentera/          # seções da landing page (um componente por arquivo)
    shared/                    # SectionHeading e variantes de animação
  lib/site.ts                  # helpers de SEO/URLs (VITE_SITE_URL)
  assets/                      # logo oficial e versão recortada
public/                        # favicons, og-image, robots.txt, sitemap.xml
```
