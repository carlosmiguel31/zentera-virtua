import { createFileRoute } from "@tanstack/react-router";
import { ZodError } from "zod";
import { parseContactPayload, sendContactEmail } from "@/lib/contact-email.server";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();
const DEFAULT_RATE_LIMIT_MAX = 5;
const DEFAULT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function positiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getClientIp(request: Request): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || "unknown";
}

function consumeRateLimit(ip: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const max = positiveInteger(process.env.CONTACT_RATE_LIMIT_MAX, DEFAULT_RATE_LIMIT_MAX);
  const windowMs = positiveInteger(
    process.env.CONTACT_RATE_LIMIT_WINDOW_MS,
    DEFAULT_RATE_LIMIT_WINDOW_MS,
  );

  const current = rateLimitStore.get(ip);
  if (!current || current.resetAt <= now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= max) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function json(data: unknown, init?: ResponseInit): Response {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-store");
  return Response.json(data, { ...init, headers });
}

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const contentType = request.headers.get("content-type") ?? "";
        if (!contentType.toLowerCase().includes("application/json")) {
          return json({ ok: false, error: "invalid_content_type" }, { status: 415 });
        }

        const ip = getClientIp(request);
        const rateLimit = consumeRateLimit(ip);
        if (!rateLimit.allowed) {
          return json(
            { ok: false, error: "rate_limited" },
            {
              status: 429,
              headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
            },
          );
        }

        const declaredLength = Number.parseInt(request.headers.get("content-length") ?? "0", 10);
        if (Number.isFinite(declaredLength) && declaredLength > 12_000) {
          return json({ ok: false, error: "payload_too_large" }, { status: 413 });
        }

        let rawBody: unknown;
        try {
          const bodyText = await request.text();
          if (bodyText.length > 12_000) {
            return json({ ok: false, error: "payload_too_large" }, { status: 413 });
          }
          rawBody = JSON.parse(bodyText);
        } catch {
          return json({ ok: false, error: "invalid_json" }, { status: 400 });
        }

        try {
          const payload = parseContactPayload(rawBody);

          // Honeypot: bots recebem sucesso aparente, mas nenhum e-mail é enviado.
          if (payload.website.trim()) {
            return json({ ok: true });
          }

          await sendContactEmail(payload);
          return json({ ok: true }, { status: 200 });
        } catch (error) {
          if (error instanceof ZodError) {
            return json({ ok: false, error: "invalid_body" }, { status: 400 });
          }

          console.error("Contact form submission failed", error);
          return json({ ok: false, error: "send_failed" }, { status: 502 });
        }
      },
    },
  },
});
