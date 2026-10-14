import { z } from "zod";

const contactPayloadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(160),
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform((value) => value.toLowerCase()),
  phone: z.string().trim().min(6).max(40),
  mainChannel: z.enum([
    "WhatsApp",
    "Chat no site",
    "E-mail",
    "Telegram",
    "Plataforma de atendimento",
    "Outro",
  ]),
  privacyAccepted: z.literal(true),
  website: z.string().max(200).optional().default(""),
});

export type ContactPayload = z.infer<typeof contactPayloadSchema>;

export function parseContactPayload(input: unknown): ContactPayload {
  return contactPayloadSchema.parse(input);
}

type TokenCache = {
  accessToken: string;
  expiresAt: number;
};

let tokenCache: TokenCache | undefined;

const GRAPH_SCOPE = "https://graph.microsoft.com/.default";
const TOKEN_REFRESH_MARGIN_MS = 60_000;
const GRAPH_TIMEOUT_MS = 15_000;

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GRAPH_TIMEOUT_MS);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function getGraphAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt - TOKEN_REFRESH_MARGIN_MS > Date.now()) {
    return tokenCache.accessToken;
  }

  const tenantId = requiredEnv("MICROSOFT_TENANT_ID");
  const clientId = requiredEnv("MICROSOFT_CLIENT_ID");
  const clientSecret = requiredEnv("MICROSOFT_CLIENT_SECRET");

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    scope: GRAPH_SCOPE,
    grant_type: "client_credentials",
  });

  const response = await fetchWithTimeout(
    `https://login.microsoftonline.com/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Microsoft OAuth token request failed", {
      status: response.status,
      body: errorBody.slice(0, 500),
    });
    throw new Error("Microsoft OAuth token request failed");
  }

  const tokenResponse = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!tokenResponse.access_token) {
    throw new Error("Microsoft OAuth token response did not include access_token");
  }

  const expiresInSeconds = Number(tokenResponse.expires_in ?? 3600);
  tokenCache = {
    accessToken: tokenResponse.access_token,
    expiresAt: Date.now() + Math.max(60, expiresInSeconds) * 1000,
  };

  return tokenCache.accessToken;
}

export async function sendContactEmail(payload: ContactPayload): Promise<void> {
  const accessToken = await getGraphAccessToken();
  const from = requiredEnv("CONTACT_FROM");
  const to = (process.env.CONTACT_TO?.trim() || from).trim();

  const safeName = escapeHtml(payload.name);
  const safeCompany = escapeHtml(payload.company);
  const safeEmail = escapeHtml(payload.email);
  const safePhone = escapeHtml(payload.phone);
  const safeChannel = escapeHtml(payload.mainChannel);
  const submittedAt = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "America/Sao_Paulo",
  }).format(new Date());

  const subject = `Novo contato pelo site Zentera Virtua — ${payload.company}`;
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111827;line-height:1.6;max-width:680px;margin:0 auto">
      <h2 style="margin:0 0 20px;color:#30457A">Novo contato pelo site Zentera Virtua</h2>
      <table role="presentation" style="border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 12px 6px 0;font-weight:700;width:160px">Nome</td><td style="padding:6px 0">${safeName}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;font-weight:700">Empresa</td><td style="padding:6px 0">${safeCompany}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;font-weight:700">E-mail</td><td style="padding:6px 0"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
        <tr><td style="padding:6px 12px 6px 0;font-weight:700">Telefone / WhatsApp</td><td style="padding:6px 0">${safePhone}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;font-weight:700">Canal principal</td><td style="padding:6px 0">${safeChannel}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;font-weight:700">Recebido em</td><td style="padding:6px 0">${escapeHtml(submittedAt)}</td></tr>
      </table>
      <p style="margin-top:24px;color:#4b5563;font-size:13px">Origem: formulário da landing page zenteravirtua.com.br</p>
    </div>
  `.trim();

  const response = await fetchWithTimeout(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(from)}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject,
          body: {
            contentType: "HTML",
            content: html,
          },
          toRecipients: [
            {
              emailAddress: {
                address: to,
              },
            },
          ],
          replyTo: [
            {
              emailAddress: {
                name: payload.name,
                address: payload.email,
              },
            },
          ],
        },
      }),
    },
  );

  if (response.status !== 202) {
    const errorBody = await response.text();
    console.error("Microsoft Graph sendMail failed", {
      status: response.status,
      body: errorBody.slice(0, 500),
    });
    throw new Error("Microsoft Graph sendMail failed");
  }
}
