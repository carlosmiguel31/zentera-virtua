import { useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, Mail, Phone, Building2, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  mainChannel: string;
  privacyAccepted: boolean;
  /** Honeypot invisível: humanos não preenchem este campo. */
  website: string;
};

type FieldName = keyof Omit<FormValues, "website">;

const initialValues: FormValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  mainChannel: "",
  privacyAccepted: false,
  website: "",
};

type Status = "idle" | "loading" | "success" | "error";

const REQUEST_TIMEOUT_MS = 15000;

function getWebhookUrl(): string | undefined {
  const url = (import.meta.env.VITE_CONTACT_WEBHOOK_URL as string | undefined)?.trim();
  return url ? url : undefined;
}

export function ContactForm() {
  const reduce = useReducedMotion();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const statusRef = useRef<HTMLDivElement>(null);
  const submittingRef = useRef(false);

  const set = <K extends keyof FormValues>(k: K, v: FormValues[K]) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (k in errors && errors[k as FieldName]) {
      setErrors((e) => ({ ...e, [k]: undefined }));
    }
  };

  const validate = (): Partial<Record<FieldName, string>> => {
    const e: Partial<Record<FieldName, string>> = {};
    if (!values.name.trim()) e.name = "Informe seu nome.";
    if (!values.company.trim()) e.company = "Informe a empresa.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      e.email = "Informe um e-mail válido.";
    if (!values.phone.trim()) e.phone = "Informe um telefone ou WhatsApp.";
    if (!values.mainChannel) e.mainChannel = "Selecione o canal principal.";
    if (!values.privacyAccepted)
      e.privacyAccepted = "É necessário aceitar a Política de Privacidade.";
    return e;
  };

  const focusStatus = () => {
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (submittingRef.current) return;

    // Honeypot: se preenchido, encerra silenciosamente sem enviar nada.
    if (values.website.trim()) return;

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const webhookUrl = getWebhookUrl();
    if (!webhookUrl) {
      setStatus("error");
      setErrorMessage(
        import.meta.env.DEV
          ? "A variável VITE_CONTACT_WEBHOOK_URL não está configurada. Defina a URL do webhook no arquivo .env para habilitar o envio."
          : "O envio está temporariamente indisponível. Tente novamente mais tarde ou fale conosco por outro canal.",
      );
      focusStatus();
      return;
    }

    submittingRef.current = true;
    setStatus("loading");
    setErrorMessage("");

    const payload = {
      name: values.name.trim(),
      company: values.company.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
      mainChannel: values.mainChannel,
      privacyAccepted: values.privacyAccepted,
      source: "zentera-virtua-landing-page",
      submittedAt: new Date().toISOString(),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Resposta HTTP inválida: ${response.status}`);
      }

      setStatus("success");
      setValues(initialValues);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof DOMException && error.name === "AbortError"
          ? "O envio demorou mais do que o esperado. Verifique sua conexão e tente novamente."
          : "Não foi possível enviar sua solicitação agora. Tente novamente em alguns instantes.",
      );
    } finally {
      clearTimeout(timeoutId);
      submittingRef.current = false;
      focusStatus();
    }
  };

  return (
    <section
      id="contato"
      className="relative py-20 sm:py-24 lg:py-28"
      aria-labelledby="contato-titulo"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(79,178,198,0.2)] bg-card/60 px-3 py-1 text-xs uppercase tracking-[0.18em] text-text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" aria-hidden /> Contato
          </div>
          <h2
            id="contato-titulo"
            className="mt-4 text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-tight leading-[1.1] text-balance"
          >
            Vamos desenvolver
            <br className="hidden sm:block" /> o{" "}
            <span className="text-gradient-brand">agente ideal</span> para
            <br className="hidden sm:block" /> sua operação
          </h2>
          <div className="mt-5 max-w-md space-y-3 text-text-muted leading-relaxed">
            <p className="text-base sm:text-lg font-medium text-foreground">
              Sem espera, sem complicação.
            </p>
            <p className="text-sm sm:text-base">
              A velocidade que o atendimento da sua empresa precisa com a atenção que o seu cliente
              merece!
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="surface-card rounded-3xl p-4 sm:p-6 md:p-8 relative overflow-hidden">
            <div
              aria-hidden
              className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-brand opacity-20 blur-3xl"
            />
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  ref={statusRef}
                  tabIndex={-1}
                  role="status"
                  aria-live="polite"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="relative text-center py-16 outline-none"
                >
                  <div className="mx-auto h-14 w-14 rounded-full bg-gradient-brand inline-flex items-center justify-center glow-brand">
                    <CheckCircle2 className="h-7 w-7 text-foreground" aria-hidden />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold tracking-tight">
                    Recebemos sua solicitação.
                  </h3>
                  <p className="mt-3 text-text-muted max-w-md mx-auto">
                    Um especialista da Zentera Virtua entrará em contato em breve para agendar sua
                    demonstração.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-8 inline-flex items-center rounded-full border border-[rgba(79,178,198,0.22)] px-5 py-2.5 text-sm hover:bg-secondary transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
                  >
                    Enviar outra mensagem
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={onSubmit}
                  className="relative grid grid-cols-1 gap-5 md:grid-cols-2"
                  noValidate
                >
                  <Field id="contato-nome" label="Nome" icon={User} error={errors.name}>
                    <input
                      id="contato-nome"
                      value={values.name}
                      onChange={(e) => set("name", e.target.value)}
                      className={inputCls}
                      placeholder="Seu nome"
                      autoComplete="name"
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={errors.name ? "contato-nome-erro" : undefined}
                    />
                  </Field>
                  <Field
                    id="contato-empresa"
                    label="Empresa"
                    icon={Building2}
                    error={errors.company}
                  >
                    <input
                      id="contato-empresa"
                      value={values.company}
                      onChange={(e) => set("company", e.target.value)}
                      className={inputCls}
                      placeholder="Nome da empresa"
                      autoComplete="organization"
                      aria-invalid={errors.company ? true : undefined}
                      aria-describedby={errors.company ? "contato-empresa-erro" : undefined}
                    />
                  </Field>
                  <Field
                    id="contato-email"
                    label="E-mail corporativo"
                    icon={Mail}
                    error={errors.email}
                  >
                    <input
                      id="contato-email"
                      type="email"
                      value={values.email}
                      onChange={(e) => set("email", e.target.value)}
                      className={inputCls}
                      placeholder="voce@empresa.com"
                      autoComplete="email"
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={errors.email ? "contato-email-erro" : undefined}
                    />
                  </Field>
                  <Field
                    id="contato-telefone"
                    label="Telefone / WhatsApp"
                    icon={Phone}
                    error={errors.phone}
                  >
                    <input
                      id="contato-telefone"
                      value={values.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      className={inputCls}
                      placeholder="(00) 00000-0000"
                      autoComplete="tel"
                      aria-invalid={errors.phone ? true : undefined}
                      aria-describedby={errors.phone ? "contato-telefone-erro" : undefined}
                    />
                  </Field>
                  <div className="md:col-span-2">
                    <Field id="contato-canal" label="Canal principal" error={errors.mainChannel}>
                      <Select
                        value={values.mainChannel}
                        onValueChange={(value) => set("mainChannel", value)}
                      >
                        <SelectTrigger
                          id="contato-canal"
                          className={selectTriggerCls}
                          aria-label="Canal principal"
                          aria-invalid={errors.mainChannel ? true : undefined}
                          aria-describedby={errors.mainChannel ? "contato-canal-erro" : undefined}
                        >
                          <SelectValue placeholder="Selecionar…" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          sideOffset={6}
                          className="z-[100] border-border bg-popover text-popover-foreground shadow-xl"
                        >
                          <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                          <SelectItem value="Chat no site">Chat no site</SelectItem>
                          <SelectItem value="E-mail">E-mail</SelectItem>
                          <SelectItem value="Telegram">Telegram</SelectItem>
                          <SelectItem value="Plataforma de atendimento">
                            Plataforma de atendimento
                          </SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>

                  {/* Honeypot anti-spam: invisível para pessoas, ignorado por leitores de tela. */}
                  <div
                    className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
                    aria-hidden
                  >
                    <label htmlFor="contato-website">Não preencha este campo</label>
                    <input
                      id="contato-website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={values.website}
                      onChange={(e) => set("website", e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-start gap-3">
                      <input
                        id="contato-privacidade"
                        type="checkbox"
                        checked={values.privacyAccepted}
                        onChange={(e) => set("privacyAccepted", e.target.checked)}
                        className="mt-1 h-4 w-4 shrink-0 accent-[#4FB2C6]"
                        aria-invalid={errors.privacyAccepted ? true : undefined}
                        aria-describedby={
                          errors.privacyAccepted ? "contato-privacidade-erro" : undefined
                        }
                      />
                      <label htmlFor="contato-privacidade" className="text-sm text-text-muted">
                        Li e concordo com a{" "}
                        <Link
                          to="/politica-de-privacidade"
                          className="text-brand-cyan underline underline-offset-2 hover:text-foreground transition-colors"
                        >
                          Política de Privacidade
                        </Link>
                        .
                      </label>
                    </div>
                    {errors.privacyAccepted && (
                      <p id="contato-privacidade-erro" className="mt-1.5 text-xs text-destructive">
                        {errors.privacyAccepted}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2 mt-2 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div
                      ref={status === "error" ? statusRef : undefined}
                      tabIndex={-1}
                      aria-live="polite"
                      className="outline-none"
                    >
                      {status === "error" && (
                        <p className="flex items-start gap-2 text-sm text-destructive">
                          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden />
                          {errorMessage}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium bg-gradient-brand sm:w-auto text-foreground glow-brand disabled:opacity-70 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
                    >
                      {status === "loading" && (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      )}
                      {status === "loading" ? "Enviando…" : "Solicitar demonstração"}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

const inputCls =
  "w-full min-h-11 rounded-xl bg-card/60 border border-input px-4 py-3 text-base text-foreground placeholder:text-text-subtle outline-none focus:border-[rgba(79,178,198,0.5)] focus:ring-2 focus:ring-[rgba(79,178,198,0.2)] transition";

const selectTriggerCls =
  "w-full min-h-11 rounded-xl border border-input bg-card/60 px-4 py-3 text-base text-foreground shadow-none outline-none focus:border-[rgba(79,178,198,0.5)] focus:ring-2 focus:ring-ring data-[placeholder]:text-text-subtle";

function Field({
  id,
  label,
  icon: Icon,
  error,
  children,
}: {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-center gap-2 text-xs text-text-muted mb-1.5">
        {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden /> : null}
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-erro`} className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
