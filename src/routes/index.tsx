import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, User as UserIcon, ArrowRight, Sparkles, CheckCircle2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandLogo, BrandWordmark } from "@/components/brand";
import { useState } from "react";
import { useCurrentUser } from "@/lib/user-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Entrar / Cadastro — Fale+" },
      { name: "description", content: "Entre no Fale+ e comece a evoluir sua oratória hoje." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { registerUser, loginUser } = useCurrentUser();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup") {
      const targetName = name.trim() || "Novo Orador";
      const targetEmail = email.trim() || "usuario@fale-mais.com";
      const targetRole = role.trim() || "Orador em Evolução";
      registerUser(targetName, targetEmail, targetRole);
    } else {
      const targetEmail = email.trim() || "usuario@fale-mais.com";
      loginUser(targetEmail, password);
    }
    navigate({ to: "/home" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pt-10 pb-8">
        <div className="flex items-center gap-3">
          <BrandLogo size={44} />
          <BrandWordmark />
        </div>

        <div className="mt-8">
          <div className="inline-flex rounded-full bg-secondary p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-full px-4 py-1.5 transition ${
                mode === "signup"
                  ? "bg-gradient-brand text-white shadow-soft font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Criar Conta
            </button>
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`rounded-full px-4 py-1.5 transition ${
                mode === "signin"
                  ? "bg-gradient-brand text-white shadow-soft font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Já tenho conta
            </button>
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight">
            {mode === "signin" ? "Bem-vindo de volta" : "Crie seu perfil"}
          </h1>
          <p className="mt-2 text-[15px] text-muted-foreground leading-relaxed">
            {mode === "signin"
              ? "Acesse com seu e-mail para continuar seus treinos de fala."
              : "Cadastre-se para destravar sua oratória com treinos práticos e IA."}
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <Field id="name" label="Nome Completo" icon={<UserIcon className="h-4 w-4" />}>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Vilson Paixão"
                  className="h-12 pl-10 rounded-2xl"
                  required
                />
              </Field>

              <Field id="role" label="Cargo ou Objetivo com Oratória (Opcional)" icon={<Briefcase className="h-4 w-4" />}>
                <Input
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ex: Desenvolvedor, Palestrante, Líder..."
                  className="h-12 pl-10 rounded-2xl"
                />
              </Field>
            </>
          )}

          <Field id="email" label="E-mail" icon={<Mail className="h-4 w-4" />}>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              className="h-12 pl-10 rounded-2xl"
              required
            />
          </Field>

          <Field id="password" label="Senha" icon={<Lock className="h-4 w-4" />}>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className="h-12 pl-10 rounded-2xl"
              required
            />
          </Field>

          {mode === "signin" && (
            <div className="flex justify-end">
              <button type="button" className="text-xs font-semibold text-primary hover:underline">
                Esqueci minha senha
              </button>
            </div>
          )}

          <Button
            type="submit"
            className="h-12 w-full rounded-2xl bg-gradient-brand text-base font-semibold shadow-soft hover:opacity-95"
          >
            {mode === "signin" ? "Entrar na plataforma" : "Criar conta e começar"}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </form>

        <p className="mt-auto pt-6 text-center text-sm text-muted-foreground">
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
          Acessar diretamente →
        </Link>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  icon,
  children,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        {children}
      </div>
    </div>
  );
}
