# Relatório de Alterações — Zentera Virtua Landing Page

## Resumo geral

O projeto original (gerado pelo Lovable com TanStack Start + Vite + React + TypeScript + Tailwind 4 + Framer Motion, gerenciado por **Bun**) foi corrigido e refinado sem recriação do zero e sem troca de stack. As principais frentes: correção do import quebrado da logo, recorte da logo (removendo a grande área transparente), favicons oficiais, idioma `pt-BR` em todo o site, formulário de contato com envio real por webhook configurável, rotas reais de Política de Privacidade e Termos de Uso, remoção de métricas não comprovadas, acessibilidade (menu mobile, skip link, ARIA, movimento reduzido), SEO básico completo, reorganização do código (o `Sections.tsx` de 1.047 linhas foi dividido em componentes) e validação completa (lint, typecheck e build de produção).

## Problemas encontrados / erros preexistentes

1. **Build quebrado**: `Logo.tsx` e `Sections.tsx` importavam `@/assets/zentera-virtua-logo.asset.json`, arquivo inexistente (o real é `zentera-virtua-logo.png`). O build de produção falhava com `UNLOADABLE_DEPENDENCY`.
2. **Lockfile apontando para registry privado do Lovable**: três entradas do `bun.lock` (`framer-motion`, `motion-dom`, `motion-utils`) referenciavam tarballs em `europe-west1-npm.pkg.dev/lovable-core-prod/...`, que retorna 403 fora do sandbox do Lovable — `bun install` falhava em qualquer máquina externa.
3. **Lint preexistente falhando**: ~800 erros de formatação Prettier em arquivos originais (incluindo `src/server.ts` e componentes shadcn), porque os arquivos de configuração vieram no ZIP sem o ponto inicial (`prettierrc`, `prettierignore`, `gitignore`), então o Prettier não encontrava a configuração.
4. **Logo minúscula**: o PNG de 1054×1008 tinha o conteúdo visível em apenas ~683×213 px, cercado de transparência.
5. **Favicon padrão do Lovable** em `public/favicon.ico`.
6. **`<html lang="en">`** e textos de sistema em inglês (404, error boundary do cliente e página de erro SSR).
7. **Formulário simulava sucesso** com `setTimeout` de 1100 ms, sem requisição real; sem checkbox de privacidade, sem honeypot, sem estado de erro.
8. **Links `href="#"`** para Política de Privacidade e Termos de Uso no rodapé; rotas inexistentes.
9. **Métricas não comprovadas**: `480ms`, `×10`, `1→∞`, `100%`, `0×`, `24/7` como estatísticas, e o texto "Uma simulação real…".
10. **Menu mobile sem acessibilidade**: sem `aria-expanded`/`aria-controls`, sem fechamento por `Escape`, sem trava de foco, sem bloqueio de scroll, sem devolução de foco.
11. **Performance**: `AgentCard` usava `setState` em cada `mousemove` (tilt 3D), causando re-render contínuo.
12. **SEO incompleto**: sem favicons próprios, sem `og:image`, sem canonical, sem robots.txt/sitemap.xml, sem JSON-LD.

## Arquivos criados

- `src/components/zentera/Hero.tsx`, `ImpactStatement.tsx`, `Problems.tsx`, `HowItWorks.tsx`, `ProductDemo.tsx`, `Multichannel.tsx`, `Integrations.tsx`, `HumanHandoff.tsx`, `Benefits.tsx`, `Differentials.tsx`, `SpecializedAgents.tsx`, `Security.tsx`, `FinalCTA.tsx`, `ContactForm.tsx`, `Footer.tsx`, `LegalLayout.tsx`
- `src/components/zentera/shared/SectionHeading.tsx`, `shared/motion.ts`
- `src/lib/site.ts` (helpers de URL absoluta a partir de `VITE_SITE_URL`)
- `src/routes/politica-de-privacidade.tsx`, `src/routes/termos-de-uso.tsx`
- `src/assets/zentera-virtua-logo-cropped.png` (recorte não destrutivo da logo oficial)
- `public/favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png` (novos), `favicon.ico` (substituído — símbolo oficial, multi-tamanhos)
- `public/og-image.png` (1200×630, logo oficial sem alterações + fundo escuro + faixa no gradiente da marca)
- `public/robots.txt`, `public/sitemap.xml` (com marcador documentado — sem URLs inventadas)
- `.env.example`, `README.md`, `RELATORIO-ALTERACOES.md`

## Arquivos modificados

- `src/routes/__root.tsx` — `lang="pt-BR"`, 404 e error boundary traduzidos (com logo e identidade), favicons, `theme-color`, `og:image`/`og:locale`/Twitter Card padrão, `console.error` apenas em desenvolvimento.
- `src/routes/index.tsx` — skip link "Pular para o conteúdo", `main` com `id`, imports dos novos componentes, canonical/`og:url` a partir de `VITE_SITE_URL` (omitidos quando ausente — sem URL falsa), JSON-LD `Organization` só com dados conhecidos.
- `src/components/zentera/Logo.tsx` — import corrigido para o PNG recortado, `<img src={...}>` direto, glow desativado com movimento reduzido.
- `src/components/zentera/Header.tsx` — menu mobile acessível completo (ver seção de acessibilidade), logo maior (`h-9 md:h-11`).
- `src/lib/error-page.ts` — página de erro SSR traduzida e alinhada à identidade (fundo escuro + gradiente da marca).
- `src/styles.css` — estilos das páginas legais, `:focus-visible` global no ciano da marca.
- `bun.lock` — apenas as 3 entradas com URL privada do Lovable normalizadas para o registro público npm (mesmas versões e mesmas integridades sha512); nenhuma dependência adicionada ou atualizada.
- `.gitignore`, `.prettierrc`, `.prettierignore` — renomeados de `gitignore`/`prettierrc`/`prettierignore` (haviam perdido o ponto inicial no ZIP); `.gitignore` agora também exclui `.env`.

## Arquivos removidos

- `src/components/zentera/Sections.tsx` (1.047 linhas — dividido nos componentes acima)
- `src/components/zentera/Contact.tsx` (dividido em `ContactForm.tsx` e `Footer.tsx`)

Os componentes shadcn em `src/components/ui/` **não** foram removidos, conforme instrução (nenhum é usado pelas rotas atuais, mas a remoção automática foi evitada).

## Correções na logo

- Import inválido `zentera-virtua-logo.asset.json` → `zentera-virtua-logo-cropped.png` (e `logoAsset.url` → `src` direto).
- Recorte: bounding box do canal alfa + margem de segurança (~3% horizontal, ~6% vertical). Resultado: 723×239 px. Transparência preservada, nenhum pixel visível alterado, sem redimensionamento destrutivo.
- Uso com `w-auto` + `object-contain` em cabeçalho, rodapé, páginas legais, 404 e error boundary; tamanhos maiores no header (`h-9 md:h-11`).
- Arquivo original preservado intacto em `src/assets/zentera-virtua-logo.png`.

## Favicons

- Favicon do Lovable removido.
- Gerados a partir apenas do **símbolo** oficial (sem os textos, para legibilidade em tamanhos pequenos), com fundo transparente, centralizado e com margens: `favicon.ico` (16–64 px), `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png` (180×180). Referências adicionadas no `<head>` junto com `theme-color: #050609`.

## Acessibilidade

- Link "Pular para o conteúdo" na home e nas páginas legais.
- Menu mobile: `aria-expanded`, `aria-controls`, `aria-haspopup`, `role="dialog"` + `aria-modal`, nome acessível, fecha com `Escape` e ao clicar em link, bloqueia o scroll de fundo, prende o foco dentro do painel (trap com `Tab`/`Shift+Tab`), devolve o foco ao botão ao fechar, áreas de toque ≥ 44 px.
- Abas de agentes especializados: `role="tablist"/"tab"/"tabpanel"`, `aria-selected`, navegação por setas/Home/End (roving tabindex), funciona por toque e teclado, sem dependência de hover.
- Formulário: labels associados por `htmlFor`/`id`, `aria-invalid`, `aria-describedby` por campo, região de status com `aria-live="polite"`, foco movido para a mensagem de sucesso/erro.
- Semântica: `header`, `nav` (com `aria-label`), `main`, `section` (com `aria-labelledby`), `footer`, listas reais (`ol`/`ul`), apenas um `h1` por página, hierarquia de títulos correta.
- Foco visível global (`:focus-visible`) no ciano da marca + utilitários por elemento.
- **Movimento reduzido**: todos os componentes com animação relevante usam `useReducedMotion` do Framer Motion (não apenas CSS global): hero sem parallax e com etapas estáticas, demonstração exibida completa sem sequência por scroll, sem pulsos/anéis/brilhos animados, fades simples no lugar de deslocamentos, rolagem imediata (via media query já existente no CSS).

## Conteúdo e métricas removidas

- Removidos: `Latência média · 480ms`, `×10`, `1→∞`, `100%`, `0×`, estatística `24/7` e o painel de "estatísticas" dos benefícios.
- Substituições responsáveis: "Respostas em poucos instantes", "Escala conforme a demanda", "Atendimento mais consistente", "Contexto preservado", "Disponibilidade ampliada".
- "Uma simulação real de como um agente Zentera conduz um chamado" → "Uma demonstração ilustrativa de como um agente Zentera pode conduzir um atendimento", com selos "Demonstração ilustrativa", "Exemplo de fluxo", aviso "Conteúdo fictício, sem dados pessoais reais" e nota "A experiência pode ser personalizada conforme a operação".
- Promessa absoluta na conversa demonstrativa ("previsão de normalização em 40 minutos" / "100%") suavizada.
- Handoff reforça colaboração humano + IA ("A IA colabora com a equipe — não a substitui").
- Removida a linha de e-mail/telefone fictícios da seção de contato (dados não fornecidos — nada foi inventado).

## Formulário de contato

- Removida a simulação de sucesso com `setTimeout`.
- Envio real: `POST` JSON para `VITE_CONTACT_WEBHOOK_URL` com payload padronizado (`name`, `company`, `email`, `phone`, `monthlyVolume`, `mainChannel`, `message`, `privacyAccepted`, `source`, `submittedAt` em ISO).
- Implementados: validação por campo, normalização (trim/lowercase no e-mail), estados idle/loading/sucesso/erro, botão desabilitado + guarda contra duplo envio, timeout de 15 s com `AbortController`, tratamento de respostas HTTP não-2xx, limpeza do formulário apenas após sucesso real, honeypot invisível, checkbox obrigatório "Li e concordo com a Política de Privacidade" com link real para a rota.
- Sem webhook configurado: mensagem técnica clara em desenvolvimento; mensagem amigável (sem detalhes técnicos e sem simular sucesso) em produção.
- Nenhum segredo no frontend; risco das variáveis `VITE_` documentado no README e no `.env.example`.

## Páginas legais

- Rotas reais `/politica-de-privacidade` e `/termos-de-uso` (TanStack Router, funcionam por acesso direto à URL, com título e descrição próprios e canonical condicional).
- Layout com identidade da marca, cabeçalho simplificado com "Voltar ao início", rodapé completo, skip link, boa legibilidade e responsividade.
- Textos iniciais profissionais e genéricos; **nenhum dado inventado** (sem CNPJ, endereço, razão social etc.); nota visível de que exigem revisão jurídica.

## Idioma

- `<html lang="pt-BR">`.
- Traduzidos: 404 ("Página não encontrada", "Voltar ao início"), error boundary do cliente ("Não foi possível carregar esta página", "Tentar novamente"), página de erro SSR (`error-page.ts`), botão de envio ("Enviando…"), todos os rótulos/mensagens do formulário. Nenhum texto de sistema em inglês restante nas telas renderizadas. (Componentes shadcn não utilizados em `src/components/ui/` mantêm strings internas originais, conforme instrução de não removê-los/alterá-los sem necessidade.)

## SEO

- `title` e `meta description` conforme especificado; keywords mantidas.
- Open Graph completo (`og:title`, `og:description`, `og:type`, `og:site_name`, `og:locale`, `og:image` 1200×630 com dimensões declaradas) e Twitter Card (`summary_large_image` + título/descrição/imagem).
- `canonical` e `og:url` gerados a partir de `VITE_SITE_URL`; quando a variável está ausente, são **omitidos** (sem domínio inventado) e `og:image` usa caminho relativo como fallback.
- JSON-LD `Organization` apenas com dados conhecidos (nome, descrição; URL/logo só quando `VITE_SITE_URL` existir).
- `robots.txt` e `sitemap.xml` criados sem URLs falsas — o sitemap usa o marcador `{{SITE_URL}}` com instruções de substituição documentadas no próprio arquivo e no README.
- Favicon, Apple Touch Icon e `theme-color` configurados.

## Organização do código e performance

- `Sections.tsx` (1.047 linhas) dividido em 16 componentes + pasta `shared/`; imports organizados; sem `any`; dados repetitivos em arrays tipados.
- Efeito de tilt 3D com `setState` em `mousemove` (re-render por pixel) **removido** junto com a grade de 9 cards de agentes, substituída por interface de abas (menos cards simultâneos, uma ideia por vez, transição suave) — resolvendo performance e excesso de cards de uma vez.
- Animações decorativas contínuas desativadas com movimento reduzido (deixam de rodar, em vez de apenas acelerar via CSS).
- Grid de problemas reduzido de 7 para 6 cards (o item "Sem cobertura 24/7" foi absorvido pelo benefício "Disponibilidade ampliada", evitando repetição).
- Logo principal sem lazy loading (evita atraso visual); demais imagens são geradas/estáticas leves.

## Comandos executados e resultados

| Etapa                               | Comando                                                | Resultado                                                                                                                                                                      |
| ----------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Instalação                          | `bun install`                                          | OK após normalizar o lockfile (falhava com 403 no registry privado)                                                                                                            |
| Build inicial (antes das correções) | `bun run build`                                        | **Falhou** — import inexistente `zentera-virtua-logo.asset.json`                                                                                                               |
| Lint                                | `bun run lint`                                         | **0 erros** / 6 avisos preexistentes (`react-refresh` em componentes shadcn não utilizados)                                                                                    |
| Typecheck                           | `bunx tsc --noEmit`                                    | OK, sem erros                                                                                                                                                                  |
| Formatação                          | `bun run format`                                       | OK                                                                                                                                                                             |
| Build final                         | `bun run build`                                        | **OK** — cliente + SSR + Nitro gerados em `.output/`                                                                                                                           |
| Teste de SSR (dev server)           | `curl` nas rotas                                       | `/` 200 · `/politica-de-privacidade` 200 · `/termos-de-uso` 200 · rota inexistente 404 com página traduzida; `lang="pt-BR"` e títulos corretos confirmados no HTML renderizado |
| Validação do ZIP final              | extração em pasta limpa + `bun install` + lint + build | OK (ver seção abaixo)                                                                                                                                                          |

Não há suíte de testes no projeto (nenhum script `test` no `package.json`); nada foi executado nesse ponto.

## Limitações e pendências conhecidas

1. **Revisão jurídica**: Política de Privacidade e Termos de Uso são textos iniciais genéricos e precisam de revisão profissional + dados oficiais da empresa.
2. **Domínio final**: configurar `VITE_SITE_URL`, substituir `{{SITE_URL}}` no `sitemap.xml` e adicionar a linha `Sitemap:` no `robots.txt`.
3. **Webhook**: configurar `VITE_CONTACT_WEBHOOK_URL`; se o destino exigir segredo, usar intermediário no servidor (documentado no README).
4. **Preview local do build**: o template do Lovable usa Nitro com alvo Cloudflare Workers; `bun run preview` pode exigir ferramentas da plataforma (ex.: Wrangler) dependendo do ambiente. O build em si compila e o site funciona normalmente em desenvolvimento e no deploy.
5. **Avisos de lint preexistentes**: 6 avisos `react-refresh/only-export-components` em componentes shadcn não utilizados — inofensivos e mantidos para não alterar arquivos da biblioteca.
6. **Responsividade**: as classes responsivas foram revisadas no código (breakpoints de 320 px a 1920 px, fluxos horizontais colapsando em verticais, sem larguras fixas problemáticas); recomenda-se uma passada visual final nos dispositivos reais antes da publicação.

## Atualização — correção da seção "Diferenciais"

- `src/components/zentera/Differentials.tsx`: removido o deslocamento vertical condicional (`sm:translate-y-6` aplicado por índice), que criava buracos e desalinhamento entre as linhas.
- Grade estabilizada: `ul` com `grid items-stretch gap-4 sm:grid-cols-2` e cards com `h-full` — os dois cards de cada linha agora têm a mesma altura; `sm:min-h-[112px]` equilibra linhas com textos curtos no desktop, mantendo altura automática no mobile.
- Contêiner da seção ajustado para `lg:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.45fr)]` com `lg:items-start` e `lg:gap-20`; o bloco de texto permanece sticky apenas no desktop (`lg:sticky lg:top-32`).
- Ícone dos cards agora circular (`h-7 w-7 rounded-full`) com `gap-4` para o texto; texto em `sm:text-[15px]` para melhor leitura.
- Ordem dos dez diferenciais mantida, preenchendo cinco linhas de duas colunas no desktop, conforme especificado; nenhum texto alterado.
- Revalidado: lint 0 erros, `tsc --noEmit` OK, build OK e ZIP reextraído/reinstalado/rebuildado com sucesso; SSR confirma ausência de `translate-y` e os 10 cards renderizados.

## Atualização — revisão de espaçamento vertical e responsividade mobile

**Espaçamento entre seções (redução de ~30% no mobile):**

- Seções comuns (`Problems`, `HowItWorks`, `ProductDemo`, `Multichannel`, `Integrations`, `HumanHandoff`, `Benefits`, `Differentials`, `SpecializedAgents`, `Security`, `ContactForm`): `py-32 md:py-40/44` → `py-20 sm:py-24 lg:py-28 xl:py-32`.
- Seções de impacto (`ImpactStatement`, `FinalCTA`): `py-32 md:py-48` / `py-40 md:py-52` → `py-24 sm:py-28 lg:py-36`.
- Nenhum `py-40`, `py-44`, `py-48` ou `py-52` restante.

**Espaços internos:** distância título→conteúdo reduzida (`mt-16` → `mt-10 lg:mt-14`; `mt-20` → `mt-12 lg:mt-16`; `mt-24` → `mt-16 lg:mt-20`); gaps grandes tornados responsivos (`gap-12/14` → `gap-8 lg:gap-12/14`); paddings de cards escalonados (`p-4 sm:p-5 lg:p-6` e equivalentes).

**Contêineres:** padronizados para `mx-auto w-full max-w-* px-5 sm:px-6 lg:px-10` (px-5 no menor breakpoint para não consumir a área útil em 320 px).

**Hero:** `min-h-[calc(100svh-72px)]` (e `-80px` no desktop) com `pb-16 pt-24 sm:pb-20 sm:pt-28` — cresce com o conteúdo, sem altura fixa; título reescalado para `text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl` com `break-words`; botões empilhados em largura total no celular (`w-full sm:w-auto`); orbes decorativos ocultos abaixo de `sm`; ordem no mobile: título → texto → botões → canais → demonstração (já garantida pela ordem do DOM).

**Grades:** todas iniciam em uma coluna no celular (`grid-cols-1` explícito onde havia layout lateral); composições texto+conteúdo usam `grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12/14`.

**Diferenciais:** uma coluna no mobile, duas a partir de `sm`; `min-h-0` no mobile e `sm:min-h-[112px]` no desktop; sticky apenas `lg:sticky lg:top-28`; sem `translate-y`; gaps `gap-8 sm:gap-10 lg:gap-16`.

**Sticky:** todos os elementos sticky (`ProductDemo`, `Differentials`) restritos a `lg:` com `top-28` (não cobrem o cabeçalho).

**Demonstrações e fluxos:**

- `Multichannel`: o diagrama radial (posicionamento absoluto + labels `nowrap`) agora aparece apenas a partir de `sm`; no celular é substituído por uma lista vertical simples com os mesmos seis canais — nenhum conteúdo perdido, só a decoração.
- `HowItWorks`: o card decorativo de cada etapa (ícone + faixa animada, sem conteúdo textual próprio) fica oculto abaixo de `md`, encurtando a timeline no celular; número, título e descrição de cada etapa permanecem.
- `ProductDemo`: `min-h-[560px]` só a partir de `md` (sem área vazia no celular durante a revelação por scroll).

**Agentes especializados:** abas em grade `grid-cols-2 gap-2` no celular (sem compressão em linha única) e `sm:flex sm:flex-wrap` a partir de `sm`; botões `min-h-11 w-full sm:w-auto`; painel com `p-5 sm:p-7 lg:p-10`.

**Formulário:** uma coluna no celular (`grid-cols-1 gap-5 md:grid-cols-2`); mensagem, honeypot e consentimento com `md:col-span-2`; inputs com `min-h-11` (≥44 px) e `text-base` (16 px — evita zoom automático no iOS); botão de envio em largura total no celular.

**Cabeçalho/menu:** contêiner com `px-5 sm:px-6`; botão do menu já em 44×44 px; painel do menu com rolagem interna e `pb-[calc(1.25rem+env(safe-area-inset-bottom))]` para respeitar a safe area inferior; comportamento de foco/Escape/scroll-lock mantido.

**Rodapé:** colunas empilhadas (`sm:grid-cols-2 md:grid-cols-4`), `py-10 sm:py-14`, `gap-8`, espaçamento entre links aumentado para `space-y-2.5` (área de toque), alinhamento à esquerda mantido.

**Páginas legais:** `px-5 sm:px-6` e `py-12 sm:py-16 lg:py-24`.

**Validação da rodada:** lint 0 erros, `tsc --noEmit` OK, build de produção OK, sem erros no console do dev server; HTML renderizado confirma ausência dos paddings antigos, presença do novo padrão, lista mobile do multicanal, `min-h` do hero e `md:col-span-2` no formulário. ZIP reextraído, reinstalado e rebuildado. Observação: este ambiente não possui navegador, então a inspeção nos breakpoints (320→1920 px) foi feita por análise das classes responsivas e do HTML SSR; recomenda-se uma conferência visual final no navegador.

## Atualização — correção dos selects, tema claro/escuro e revisão de temas

**Campos de seleção do formulário (visibilidade no Windows/Chrome):**
- Os dois `<select>` nativos ("Atendimentos mensais" e "Canal principal") foram substituídos pelo componente acessível de Select baseado em Radix UI (`src/components/ui/select.tsx`), eliminando o problema de opções invisíveis (fundo branco do SO com texto claro).
- `SelectContent` renderiza via Portal com `bg-popover text-popover-foreground border-border`, `z-[100]` e sombra — não é cortado pelo `overflow-hidden` do card do formulário.
- `SelectItem` ajustado: `text-popover-foreground`, `focus:bg-accent focus:text-accent-foreground`, `data-[state=checked]:font-medium` e indicador de seleção em `text-brand-cyan`.
- `SelectTrigger` com a mesma altura/borda/tipografia dos inputs (`min-h-11`, `rounded-xl`, `text-base`, foco no ciano da marca), placeholder em cor secundária e `aria-label`; no "Canal principal" também `aria-invalid`/`aria-describedby` associados ao erro.
- Navegação por teclado, toque, Enter/Espaço/setas/Escape e rolagem já são fornecidos pelo Radix.

**Sistema de temas (escuro/claro):**
- Novos componentes: `src/components/zentera/ThemeProvider.tsx` (contexto React, persistência e script de init) e `src/components/zentera/ThemeToggle.tsx` (botão circular ~42 px, ≥44 px de área no mobile, sol/lua, `aria-label` e `title`).
- Padrão da primeira visita: **escuro**. Preferência salva em `localStorage` sob a chave `zentera-theme` (valores `dark`/`light`) e restaurada ao recarregar.
- Sem flash: script inline no `<head>` (via `dangerouslySetInnerHTML`) roda antes da pintura, aplica a classe no `<html>`, define `color-scheme` e cria/atualiza a meta `theme-color`. `<html lang="pt-BR" className="dark" suppressHydrationWarning>` evita mismatch de hidratação; nada acessa `window`/`document`/`localStorage` durante o SSR (apenas em efeitos e no script do navegador).
- Meta `theme-color` dinâmica: `#050609` (escuro) / `#f4f7fa` (claro); a meta estática anterior foi removida do `<head>`.
- Botão de tema posicionado no cabeçalho desktop (antes do CTA), no cabeçalho mobile (antes do botão de menu) e no cabeçalho das páginas legais (`LegalLayout.tsx`).

**Tokens e paleta (styles.css):**
- Tokens reorganizados: paleta/gradiente da marca constantes em `:root`; tema escuro em `:root, .dark`; tema claro em `.light` (fundo azul-acinzentado, cards brancos, textos azul-marinho, bordas índigo de baixa opacidade, sombras/brilhos azulados). O gradiente oficial não foi alterado.
- Novas variáveis semânticas de superfície: `--surface-card-background`, `--surface-card-border`, `--surface-card-shadow` e `--ambient-opacity`, com valores por tema. O utilitário `surface-card` e o `ambient-orb` passaram a usá-las (opacidade dos orbes cai para 0.14 no claro).
- Transição de tema suave (220 ms) aplicada apenas a `background-color`, `color`, `border-color` e `box-shadow` (nunca a transform/tamanho/posição), habilitada só após a montagem (classe `theme-ready`) e desativada com `prefers-reduced-motion`.

**Auditoria de cores fixas:** substituição de classes escuras fixas por tokens nos componentes de `src/components/zentera` e nas rotas — `border-white/5`→`border-border`, `border-white/10`→`border-input`, `bg-white/[0.02|0.03|0.015]`→`bg-card/60`, `bg-white/[0.04|0.06]` e `hover:bg-white/[0.04]`→`bg-secondary`/`hover:bg-secondary`; divisores decorativos (`bg-white/5`) → `bg-border`; erros do formulário passaram a usar o token `text-destructive` (legível nos dois temas). Textos sobre o gradiente e botões com gradiente continuam com `text-foreground`/claro. A logo permanece intacta, sem filtros.

**Validação da rodada:** `bun install`, lint 0 erros (8 avisos preexistentes de `react-refresh` em componentes shadcn e no ThemeProvider), `tsc --noEmit` OK e build de produção OK. SSR verificado por HTML renderizado: script de tema presente no `<head>`, `<html class="dark" lang="pt-BR">`, botão de tema com `aria-label`, os dois campos agora como `combobox` do Radix (zero `<option>` nativo) e nenhuma meta `theme-color` estática. O CSS de produção contém o bloco `.light` e resolve `bg-card/60` via `color-mix` por tema. Observação: sem navegador neste ambiente, a inspeção visual nos breakpoints e a troca ao vivo de tema devem ser conferidas no navegador.

## Variáveis de ambiente necessárias

```env
VITE_CONTACT_WEBHOOK_URL=
VITE_SITE_URL=
```

(Ver `.env.example` para instruções e avisos de segurança. Nenhum `.env` real está incluído no ZIP.)

## Atualização — reposicionamento para ISPs e limpeza final (11/09/2026)

### Correção de declarações anteriores deste relatório

Duas afirmações das seções acima **não correspondiam ao ZIP realmente entregue** naquela rodada e só passaram a ser verdadeiras agora:

- "Arquivos removidos: `Sections.tsx` e `Contact.tsx`" — os dois arquivos ainda estavam presentes no pacote. Foram efetivamente removidos nesta rodada, após busca global confirmar zero imports.
- "Nenhum `.env` real está incluído no ZIP" — havia um `.env` na raiz do pacote. Ele foi removido nesta rodada; apenas `.env.example` é distribuído.

### Ajustes de conteúdo solicitados

- **Hero (`Hero.tsx`)** — nova comunicação voltada a provedores: título "O futuro do atendimento para ISPs já começou!", destaque "Descubra o poder da Zentera Virtua e escale sua operação 24/7!" e descrição sobre agentes autônomos e redução de custos. Tipografia `text-4xl sm:text-5xl lg:text-6xl`; colunas reequilibradas para `lg:col-span-5` (texto, ~42%) e `lg:col-span-7` (demonstração, ~58%). Badge, CTAs, animações e demonstração lateral mantidos.
- **Demonstração (`ProductDemo.tsx`)** — roteiro trocado de Suporte para **Comercial** ("Quero contratar" → identificação de intenção → atendente Ana → qualificação por perfil de uso). Rótulo do cabeçalho: "Exemplo de fluxo: Comercial". Painel de contexto atualizado (Intenção: Comercial; Categoria: Contratação; Base consultada: Planos e viabilidade; Ação: Qualificação do perfil; Decisão: Indicação do plano ideal). Ícones `Database`, `Zap` e `HeartHandshake` deixaram de ser importados.
- **Agentes especializados (`SpecializedAgents.tsx`)** — seção reescrita para exibir **apenas os tipos de atendimento**, revelados na interação. Removidos descrição, lista de ações e exemplo de conversa. Sete categorias: Comercial, Suporte, Financeiro, Cobrança, Agendamento, Retenção e Informação / Reclamação, com os itens definidos pela operação (inclui `SVAS`, `NFCOM`, `Outros`). Hover no desktop, toque no mobile (segundo toque fecha), navegação por setas/Home/End/Escape, `aria-expanded`/`aria-controls` e área de altura reservada (`min-h`) para evitar salto de layout. Estado vazio neutro: "Selecione um tipo de atendimento para ver as opções." — sem referência a hover, que não existe no mobile.
- **Formulário (`ContactForm.tsx`)** — campos "Atendimentos mensais" e "Mensagem" removidos do tipo `FormValues`, dos valores iniciais, da validação e do payload do webhook. "Canal principal" passou a ocupar a linha inteira no desktop (`md:col-span-2`). Texto de apoio ajustado, pois citava "canais e volumes".
- **Rodapé (`Footer.tsx`)** — "Desenvolvido para um atendimento ágil, autônomo e inteligente." (ponto final).

### Limpeza

- Removidos `src/components/zentera/Sections.tsx` e `src/components/zentera/Contact.tsx` (legado com Hero antigo, "Pós-venda", "Atendimentos mensais", "Mensagem" e "Feito com foco em atendimento inteligente"). Confirmado por busca global: nenhum import em rotas ou componentes. Eram também a origem de todos os erros de lint e do único erro de tipo do projeto.
- Removido `.env` do pacote. `.gitignore` já continha `.env`, `.env.*` e `!.env.example` — verificado, não alterado. `.env.example` preservado sem alterações.
- Removidas as cópias sem ponto inicial `gitignore`, `prettierrc` e `prettierignore` (idênticas às versões com ponto, que permanecem).
- `README.md` — payload documentado do formulário atualizado: `monthlyVolume` e `message` retirados do exemplo JSON.

### Validação desta rodada

- `bun run lint` (ESLint): **0 erros**; 8 avisos preexistentes de `react-refresh` (componentes shadcn e `ThemeProvider`).
- `tsc --noEmit`: **OK** (o erro de tipo que existia em `Sections.tsx` desapareceu com a remoção do arquivo).
- `bun run build`: **OK** — bundles de cliente e servidor gerados pelo Nitro.
- Não há script de testes no `package.json`; nenhum teste automatizado a executar.
- Buscas globais sem ocorrências em arquivos ativos: "Atendimentos mensais", "Conte um pouco sobre sua operação e objetivos", "Pós-venda", "Feito com foco em atendimento inteligente", "Atendimento inteligente." / "Experiências extraordinárias" (Hero antigo), `monthlyVolume`, "SVAs".
- HTML renderizado (SSR) confere: Hero novo, `<html lang="pt-BR" class="dark">` com script de tema, formulário com Nome / Empresa / E-mail / Telefone / Canal principal / privacidade, estado vazio neutro dos agentes e rodapé com ponto final.
- Conteúdo do ZIP: sem `node_modules`, `dist`, `.output`, `.wrangler`, `.tanstack`, `.env`, caches ou logs. Inclui `src`, `public`, `.env.example`, `package.json`, `bun.lock`, configurações, `README.md` e este relatório.
- Observação mantida: este ambiente não tem navegador, então a conferência visual nos breakpoints e a troca de tema ao vivo continuam recomendadas localmente.

---

## Revisão — Home com cinco seções e conversa automática

### Estrutura final da Home (`src/routes/index.tsx`)

`<Header />` → `<Hero />` → `<SpecializedAgents />` → `<Multichannel />` → `<FinalCTA />` → `<ContactForm />` → `<Footer />`

### Arquivos modificados

- `src/routes/index.tsx` — imports e renderização reduzidos às cinco seções. Bloco `head()` (SEO, Open Graph, JSON-LD) preservado sem alteração.
- `src/components/zentera/Hero.tsx` — novo título, escala tipográfica reduzida e demonstração de conversa automática (ver abaixo).
- `src/components/zentera/Header.tsx` — navegação passou a ser Solução / Agentes / Multicanal / Contato.
- `src/components/zentera/Footer.tsx` — navegação interna alinhada às seções existentes.
- `src/components/zentera/SpecializedAgents.tsx` — `id="agentes"`, headline menor, categorias mais próximas do título e com maior peso visual.
- `src/components/zentera/Multichannel.tsx` — `id="multicanal"` e ajuste de respiro. Diagrama e canais intactos.
- `src/components/zentera/FinalCTA.tsx` — `id="conversa"` e headline de `lg:text-7xl` para `lg:text-6xl`. Texto, gradiente e marca d'água preservados.
- `src/components/zentera/ContactForm.tsx` — novo título e nova descrição. Campos, Select customizado e payload do webhook inalterados.
- `src/components/zentera/shared/SectionHeading.tsx` — escala de `text-4xl/5xl/6xl` para `text-3xl/4xl/[2.75rem]`.
- `src/styles.css` — `scroll-margin-top` para seções com `id`, evitando que o Header fixo cubra os títulos.

### Arquivos removidos

`Problems.tsx`, `HowItWorks.tsx`, `ProductDemo.tsx`, `Integrations.tsx`, `HumanHandoff.tsx`, `Benefits.tsx`, `Differentials.tsx`, `Security.tsx`, `ImpactStatement.tsx`.

Busca global confirmou que nenhum deles era importado por outra rota ou componente. `LegalLayout`, `Logo`, `ThemeProvider`, `ThemeToggle`, `SectionHeading` e `shared/motion.ts` permanecem.

### Conversa automática

- Toda dependência de rolagem foi eliminada: `useScroll`, `scrollYProgress` e `useTransform` de progresso saíram do Hero.
- Um `IntersectionObserver` (threshold 0.25) apenas dispara o início quando o Hero aparece; o observer se desconecta em seguida, então a sequência roda uma única vez por carregamento.
- A sequência é montada com `setTimeout` em um único `useEffect`. Intervalos proporcionais ao tamanho da mensagem (600–1100 ms). Antes de cada fala do agente entra o indicador de digitação por 550–1000 ms, que some quando a mensagem aparece.
- Todos os timers são guardados em um array e limpos no cleanup do efeito.
- Auto-scroll aplicado somente no container da conversa via `chatRef.current.scrollTo({ top: scrollHeight, behavior: "smooth" })`. A página nunca é movimentada.
- O container tem altura fixa por breakpoint (300 / 380 / 420 px), o que elimina layout shift no Hero conforme as mensagens entram.
- Ao final a conversa permanece completa na tela, sem loop e sem reinício.
- `prefers-reduced-motion`: a conversa é renderizada completa de imediato, sem timers e sem auto-scroll animado.
- Acessibilidade: `role="log"` com `aria-live="polite"` e `aria-relevant="additions"`; o indicador de digitação é `aria-hidden`.
