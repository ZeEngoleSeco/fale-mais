import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandLogo, BrandWordmark } from "@/components/brand";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Entrar — Fala que eu te escuto" },
      { name: "description", content: "Entre no Fala que eu te escuto e comece a evoluir sua oratória hoje." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pt-12 pb-8">
        <div className="flex items-center gap-3">
          <BrandLogo size={44} />
          <BrandWordmark />
        </div>

        <div className="mt-12">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {mode === "signin" ? "Bem-vindo de volta" : "Crie sua conta"}
          </h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            {mode === "signin"
              ? "Continue sua jornada para vencer o medo de falar em público."
              : "Junte-se a milhares de pessoas evoluindo sua oratória."}
          </p>
        </div>

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/home" });
          }}
        >
          {mode === "signup" && (
            <Field id="name" label="Nome" icon={<UserIcon className="h-4 w-4" />}>
              <Input id="name" placeholder="Como devemos te chamar?" className="h-12 pl-10 rounded-2xl" />
            </Field>
          )}
          <Field id="email" label="Email" icon={<Mail className="h-4 w-4" />}>
            <Input id="email" type="email" placeholder="voce@email.com" className="h-12 pl-10 rounded-2xl" />
          </Field>
          <Field id="password" label="Senha" icon={<Lock className="h-4 w-4" />}>
            <Input id="password" type="password" placeholder="••••••••" className="h-12 pl-10 rounded-2xl" />
          </Field>

          {mode === "signin" && (
            <div className="flex justify-end">
              <button type="button" className="text-sm font-medium text-primary hover:underline">
                Esqueci minha senha
              </button>
            </div>
          )}

          <Button
            type="submit"
            className="h-12 w-full rounded-2xl bg-gradient-brand text-base font-semibold shadow-soft hover:opacity-95"
          >
            {mode === "signin" ? "Entrar" : "Cadastrar"}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">ou continue com</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button variant="outline" className="h-12 w-full rounded-2xl">
          <GoogleIcon />
          Continuar com Google
        </Button>

        <p className="mt-auto pt-8 text-center text-sm text-muted-foreground">
          {mode === "signin" ? "Ainda não tem conta?" : "Já possui uma conta?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="font-semibold text-primary hover:underline"
          >
            {mode === "signin" ? "Cadastre-se" : "Entrar"}
          </button>
        </p>

        <Link to="/home" className="mt-3 text-center text-xs text-muted-foreground/70 hover:text-foreground">
          Explorar sem login →
        </Link>
      </div>
    </div>
  );
}

function Field({
  id, label, icon, children,
}: { id: string; label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        {children}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" className="mr-1">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.8 6C12.3 13.3 17.7 9.5 24 9.5Z"/>
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.7c-.6 3-2.3 5.6-4.9 7.3l7.6 5.9c4.4-4 7.1-10 7.1-17.5Z"/>
      <path fill="#FBBC05" d="M10.4 28.7c-1-3-1-6.2 0-9.2l-7.8-6C-.9 19 -.9 29 2.6 34.7l7.8-6Z"/>
      <path fill="#34A853" d="M24 48c6.2 0 11.5-2 15.3-5.5l-7.6-5.9c-2.1 1.4-4.8 2.3-7.7 2.3-6.3 0-11.7-3.8-13.6-9.7l-7.8 6C6.5 42.6 14.6 48 24 48Z"/>
    </svg>
  );
}
