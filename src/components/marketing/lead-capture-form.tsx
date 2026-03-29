"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

import { captureLeadFromSiteAction } from "@/modules/leads/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import {
  contactPreferenceOptions,
  estimatedTicketOptions,
  leadFormSteps,
  serviceInterestOptions,
  urgencyOptions,
} from "@/lib/lead-capture";
import { cn } from "@/lib/utils";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  niche: string;
  contactPreference: string;
  serviceInterest: string;
  urgency: string;
  objective: string;
  message: string;
  estimatedTicket: string;
  source: string;
  landingPage: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
};

const attributionStorageKey = "ameni-site-attribution";

function buildInitialValues(defaultServiceInterest?: string): FormValues {
  return {
    name: "",
    email: "",
    phone: "",
    company: "",
    niche: "",
    contactPreference: "",
    serviceInterest: defaultServiceInterest ?? "",
    urgency: "",
    objective: "",
    message: "",
    estimatedTicket: "",
    source: "website",
    landingPage: "",
    referrer: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmTerm: "",
    utmContent: "",
  };
}

export function LeadCaptureForm({
  theme = "light",
  defaultServiceInterest,
}: {
  theme?: "light" | "dark";
  defaultServiceInterest?: string;
}) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState<FormValues>(() => buildInitialValues(defaultServiceInterest));

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(attributionStorageKey) : null;
    const parsed = saved ? (JSON.parse(saved) as Partial<FormValues>) : {};
    const currentSearchParams =
      typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const currentPathname = typeof window !== "undefined" ? window.location.pathname : "";
    const nextValues: Partial<FormValues> = {
      ...parsed,
      source: "website",
    };

    const trackedParams = {
      utmSource: currentSearchParams.get("utm_source") ?? parsed?.utmSource ?? "",
      utmMedium: currentSearchParams.get("utm_medium") ?? parsed?.utmMedium ?? "",
      utmCampaign: currentSearchParams.get("utm_campaign") ?? parsed?.utmCampaign ?? "",
      utmTerm: currentSearchParams.get("utm_term") ?? parsed?.utmTerm ?? "",
      utmContent: currentSearchParams.get("utm_content") ?? parsed?.utmContent ?? "",
      landingPage: parsed?.landingPage || currentPathname || "",
      referrer: parsed?.referrer || (typeof document !== "undefined" ? document.referrer : "") || "",
    };

    const merged = {
      ...buildInitialValues(defaultServiceInterest),
      ...parsed,
      ...trackedParams,
      source: "website",
      serviceInterest: defaultServiceInterest ?? parsed?.serviceInterest ?? "",
    };

    setValues((current) => ({
      ...current,
      ...nextValues,
      ...trackedParams,
      source: "website",
      landingPage: trackedParams.landingPage,
      referrer: trackedParams.referrer,
      serviceInterest: current.serviceInterest || defaultServiceInterest || parsed?.serviceInterest || "",
    }));

    if (typeof window !== "undefined") {
      window.localStorage.setItem(attributionStorageKey, JSON.stringify(merged));
    }
  }, [defaultServiceInterest]);

  const fieldClassName =
    theme === "dark"
      ? "border-mist-100/10 bg-[linear-gradient(180deg,rgba(11,21,39,0.92),rgba(7,14,28,0.94))] text-white shadow-none placeholder:text-mist-100/30 focus:border-jade-300/50 focus:ring-jade-300/10"
      : undefined;

  function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  }

  function validateCurrentStep() {
    const nextErrors: Record<string, string> = {};

    if (step === 0) {
      if (!values.name.trim()) {
        nextErrors.name = "Informe seu nome.";
      }

      if (!values.email.trim()) {
        nextErrors.email = "Informe seu email.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        nextErrors.email = "Email inválido.";
      }
    }

    if (step === 1) {
      if (!values.serviceInterest) {
        nextErrors.serviceInterest = "Selecione a frente de interesse.";
      }

      if (!values.estimatedTicket) {
        nextErrors.estimatedTicket = "Informe a faixa de investimento.";
      }

      if (!values.urgency) {
        nextErrors.urgency = "Selecione a urgência.";
      }

      if (!values.contactPreference) {
        nextErrors.contactPreference = "Selecione o canal preferido.";
      }
    }

    if (step === 2 && !values.objective.trim()) {
      nextErrors.objective = "Descreva o objetivo principal.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function goToNextStep() {
    if (!validateCurrentStep()) {
      return;
    }

    setStep((current) => Math.min(current + 1, leadFormSteps.length - 1));
  }

  function goToPreviousStep() {
    setStep((current) => Math.max(current - 1, 0));
  }

  return (
    <form action={captureLeadFromSiteAction} className="grid gap-6">
      <div className="grid gap-4">
        <div className="flex items-center justify-between gap-3">
          {leadFormSteps.map((item, index) => {
            const active = index === step;
            const completed = index < step;

            return (
              <div className="flex min-w-0 flex-1 items-center gap-3" key={item.id}>
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition",
                    completed && "border-jade-300 bg-[linear-gradient(135deg,#30E2BC,#8FB6FF)] text-ink-950",
                    active && !completed && "border-jade-300/50 bg-jade-300/12 text-jade-300",
                    !active && !completed && (theme === "dark" ? "border-mist-100/12 bg-[linear-gradient(180deg,rgba(11,21,39,0.92),rgba(7,14,28,0.94))] text-mist-100/42" : "border-ink-950/10 bg-ink-950/5 text-ink-950/45"),
                  )}
                >
                  {completed ? <CheckCircle2 className="size-4" /> : index + 1}
                </div>
                <div className="min-w-0">
                  <p className={cn("text-xs font-semibold uppercase tracking-[0.18em]", theme === "dark" ? "text-mist-100/42" : "text-ink-950/42")}>
                    Etapa {index + 1}
                  </p>
                  <p className={cn("truncate text-sm", theme === "dark" ? "text-white" : "text-ink-950")}>{item.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className={cn("rounded-[24px] border p-5", theme === "dark" ? "border-mist-100/10 bg-[linear-gradient(180deg,rgba(10,19,36,0.92),rgba(6,12,24,0.92))]" : "border-ink-950/8 bg-white")}>
          <p className={cn("text-xs font-semibold uppercase tracking-[0.18em]", theme === "dark" ? "text-jade-300" : "text-emerald-500")}>
            {leadFormSteps[step].title}
          </p>
          <p className={cn("mt-2 text-sm leading-7", theme === "dark" ? "text-mist-100/56" : "text-ink-950/62")}>
            {leadFormSteps[step].description}
          </p>
        </div>
      </div>

      {step === 0 ? (
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Input
                className={fieldClassName}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Seu nome"
                value={values.name}
              />
              {errors.name ? <p className="text-xs text-[#f6b7c9]">{errors.name}</p> : null}
            </div>
            <div className="grid gap-2">
              <Input
                className={fieldClassName}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="Seu melhor email"
                type="email"
                value={values.email}
              />
              {errors.email ? <p className="text-xs text-[#f6b7c9]">{errors.email}</p> : null}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              className={fieldClassName}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="WhatsApp"
              value={values.phone}
            />
            <Input
              className={fieldClassName}
              onChange={(event) => updateField("company", event.target.value)}
              placeholder="Empresa"
              value={values.company}
            />
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="grid gap-5">
          <div className="grid gap-3">
            <p className={cn("text-sm font-semibold", theme === "dark" ? "text-white" : "text-ink-950")}>Frente de interesse</p>
            <div className="grid gap-3 md:grid-cols-2">
              {serviceInterestOptions.map((option) => {
                const selected = values.serviceInterest === option;

                return (
                  <button
                    className={cn(
                      "rounded-[22px] border px-4 py-4 text-left text-sm transition",
                      selected
                        ? "border-jade-300/60 bg-jade-300/12 text-white"
                        : theme === "dark"
                          ? "border-mist-100/10 bg-[linear-gradient(180deg,rgba(11,21,39,0.92),rgba(7,14,28,0.94))] text-mist-100/66 hover:border-mist-100/24"
                          : "border-ink-950/10 bg-white text-ink-950/70 hover:border-ink-950/20",
                    )}
                    key={option}
                    onClick={() => updateField("serviceInterest", option)}
                    type="button"
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {errors.serviceInterest ? <p className="text-xs text-[#f6b7c9]">{errors.serviceInterest}</p> : null}
          </div>

          <div className="grid gap-3">
            <p className={cn("text-sm font-semibold", theme === "dark" ? "text-white" : "text-ink-950")}>Faixa de investimento</p>
            <div className="grid gap-3 md:grid-cols-2">
              {estimatedTicketOptions.map((option) => {
                const selected = values.estimatedTicket === option.value;

                return (
                  <button
                    className={cn(
                      "rounded-[22px] border px-4 py-4 text-left text-sm transition",
                      selected
                        ? "border-jade-300/60 bg-jade-300/12 text-white"
                        : theme === "dark"
                          ? "border-mist-100/10 bg-[linear-gradient(180deg,rgba(11,21,39,0.92),rgba(7,14,28,0.94))] text-mist-100/66 hover:border-mist-100/24"
                          : "border-ink-950/10 bg-white text-ink-950/70 hover:border-ink-950/20",
                    )}
                    key={option.value}
                    onClick={() => updateField("estimatedTicket", option.value)}
                    type="button"
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            {errors.estimatedTicket ? <p className="text-xs text-[#f6b7c9]">{errors.estimatedTicket}</p> : null}
          </div>

          <div className="grid gap-3">
            <p className={cn("text-sm font-semibold", theme === "dark" ? "text-white" : "text-ink-950")}>Canal preferido para o primeiro contato</p>
            <div className="flex flex-wrap gap-3">
              {contactPreferenceOptions.map((option) => {
                const selected = values.contactPreference === option.value;

                return (
                  <button
                    className={cn(
                      "rounded-full border px-4 py-3 text-sm transition",
                      selected
                        ? "border-jade-300/60 bg-jade-300/12 text-white"
                        : theme === "dark"
                          ? "border-mist-100/10 bg-[linear-gradient(180deg,rgba(11,21,39,0.92),rgba(7,14,28,0.94))] text-mist-100/66 hover:border-mist-100/24"
                          : "border-ink-950/10 bg-white text-ink-950/70 hover:border-ink-950/20",
                    )}
                    key={option.value}
                    onClick={() => updateField("contactPreference", option.value)}
                    type="button"
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            {errors.contactPreference ? <p className="text-xs text-[#f6b7c9]">{errors.contactPreference}</p> : null}
          </div>

          <div className="grid gap-3">
            <p className={cn("text-sm font-semibold", theme === "dark" ? "text-white" : "text-ink-950")}>Urgência do projeto</p>
            <div className="flex flex-wrap gap-3">
              {urgencyOptions.map((option) => {
                const selected = values.urgency === option.value;

                return (
                  <button
                    className={cn(
                      "rounded-full border px-4 py-3 text-sm transition",
                      selected
                        ? "border-emerald-300/60 bg-emerald-300/12 text-white"
                        : theme === "dark"
                          ? "border-mist-100/10 bg-[linear-gradient(180deg,rgba(11,21,39,0.92),rgba(7,14,28,0.94))] text-mist-100/66 hover:border-mist-100/24"
                          : "border-ink-950/10 bg-white text-ink-950/70 hover:border-ink-950/20",
                    )}
                    key={option.value}
                    onClick={() => updateField("urgency", option.value)}
                    type="button"
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            {errors.urgency ? <p className="text-xs text-[#f6b7c9]">{errors.urgency}</p> : null}
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              className={fieldClassName}
              onChange={(event) => updateField("niche", event.target.value)}
              placeholder="Nicho ou segmento"
              value={values.niche}
            />
            <div className="grid gap-2">
              <Input
                className={fieldClassName}
                onChange={(event) => updateField("objective", event.target.value)}
                placeholder="Objetivo principal"
                value={values.objective}
              />
              {errors.objective ? <p className="text-xs text-[#f6b7c9]">{errors.objective}</p> : null}
            </div>
          </div>
          <Textarea
            className={fieldClassName}
            onChange={(event) => updateField("message", event.target.value)}
            placeholder="Conte um pouco sobre o momento da empresa, os gargalos e o que você quer destravar agora."
            value={values.message}
          />
        </div>
      ) : null}

      <input name="name" type="hidden" value={values.name} />
      <input name="email" type="hidden" value={values.email} />
      <input name="phone" type="hidden" value={values.phone} />
      <input name="company" type="hidden" value={values.company} />
      <input name="niche" type="hidden" value={values.niche} />
      <input name="contactPreference" type="hidden" value={values.contactPreference} />
      <input name="objective" type="hidden" value={values.objective} />
      <input name="message" type="hidden" value={values.message} />
      <input name="serviceInterest" type="hidden" value={values.serviceInterest} />
      <input name="urgency" type="hidden" value={values.urgency} />
      <input name="estimatedTicket" type="hidden" value={values.estimatedTicket} />
      <input name="source" type="hidden" value={values.source} />
      <input name="landingPage" type="hidden" value={values.landingPage} />
      <input name="referrer" type="hidden" value={values.referrer} />
      <input name="utmSource" type="hidden" value={values.utmSource} />
      <input name="utmMedium" type="hidden" value={values.utmMedium} />
      <input name="utmCampaign" type="hidden" value={values.utmCampaign} />
      <input name="utmTerm" type="hidden" value={values.utmTerm} />
      <input name="utmContent" type="hidden" value={values.utmContent} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className={cn("text-sm", theme === "dark" ? "text-white/48" : "text-ink-950/48")}>
          Etapa {step + 1} de {leadFormSteps.length}
        </div>
        <div className="flex gap-3">
          {step > 0 ? (
            <Button
              className={cn(theme === "dark" ? "border border-mist-100/10 bg-[linear-gradient(180deg,rgba(11,21,39,0.92),rgba(7,14,28,0.94))] text-white hover:bg-[linear-gradient(180deg,rgba(13,25,45,0.96),rgba(8,16,31,0.96))]" : undefined)}
              onClick={goToPreviousStep}
              type="button"
              variant={theme === "dark" ? undefined : "secondary"}
            >
              <ArrowLeft className="mr-2 size-4" />
              Voltar
            </Button>
          ) : null}

          {step < leadFormSteps.length - 1 ? (
            <Button
              className={cn(theme === "dark" ? "border border-white/10 bg-[linear-gradient(135deg,#30E2BC,#8FB6FF)] text-ink-950 hover:brightness-105" : undefined)}
              onClick={goToNextStep}
              type="button"
            >
              Continuar
              <ArrowRight className="ml-2 size-4" />
            </Button>
          ) : (
            <SubmitButton
              className={cn(
                theme === "dark"
                  ? "border border-white/10 bg-[linear-gradient(135deg,#30E2BC,#8FB6FF)] text-ink-950 hover:brightness-105"
                  : "w-full sm:w-auto",
              )}
              size="lg"
            >
              Solicitar diagnóstico
            </SubmitButton>
          )}
        </div>
      </div>
    </form>
  );
}
