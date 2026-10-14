# Formulário de contato — Microsoft 365 / Microsoft Graph

A landing envia o formulário para `POST /api/contact`. A rota roda no servidor, obtém um token OAuth 2.0 no Microsoft Entra e envia o e-mail pelo Microsoft Graph.

## 1. Criar o App Registration

No Microsoft Entra admin center:

1. Acesse **Identity > Applications > App registrations > New registration**.
2. Nome sugerido: `Zentera Virtua - Formulario Site`.
3. Use apenas o tenant da organização (single tenant).
4. Não é necessário configurar Redirect URI para o fluxo client credentials.
5. Salve o **Application (client) ID** e o **Directory (tenant) ID**.

## 2. Criar o segredo

Em **Certificates & secrets > Client secrets > New client secret**:

1. Crie um segredo com validade adequada à política da empresa.
2. Copie o **Value** imediatamente. Ele será usado em `MICROSOFT_CLIENT_SECRET`.
3. Nunca use o Secret ID no lugar do Value.

## 3. Permissão do Microsoft Graph

Em **API permissions > Add a permission > Microsoft Graph > Application permissions**:

1. Adicione `Mail.Send`.
2. Clique em **Grant admin consent** para o tenant.

Observação de segurança: a permissão de aplicação `Mail.Send` é ampla. Depois que o envio estiver funcionando, restrinja o aplicativo à caixa `contato@zenteravirtua.com.br` usando **Exchange Online App RBAC**.

## 4. Variáveis na VPS

No `.env` da landing em produção:

```env
VITE_SITE_URL=https://zenteravirtua.com.br

MICROSOFT_TENANT_ID=SEU_TENANT_ID
MICROSOFT_CLIENT_ID=SEU_CLIENT_ID
MICROSOFT_CLIENT_SECRET=SEU_CLIENT_SECRET_VALUE

CONTACT_FROM=contato@zenteravirtua.com.br
CONTACT_TO=contato@zenteravirtua.com.br
CONTACT_RATE_LIMIT_MAX=5
CONTACT_RATE_LIMIT_WINDOW_MS=600000
```

As três variáveis `MICROSOFT_*` não podem usar prefixo `VITE_` e não podem ser commitadas.

## 5. Funcionamento

O e-mail chega em `contato@zenteravirtua.com.br` com:

- Nome
- Empresa
- E-mail
- Telefone / WhatsApp
- Canal principal
- Data e hora do envio

O campo `replyTo` é configurado com o e-mail informado pelo lead. Assim, ao clicar em **Responder** no Outlook, a resposta é direcionada ao lead.

A rota também possui validação server-side, honeypot, limite de payload e rate limit por IP.
