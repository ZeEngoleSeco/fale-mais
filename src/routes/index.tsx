import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, User as UserIcon, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandLogo, BrandWordmark } from "@/components/brand";
import { useState } from "react";
import { MOCK_USERS, type UserProfile } from "@/data/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Entrar — Fale+" },
      { name: "description", content: "Entre no Fale+ e comece a evoluir sua oratória hoje." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("ana.lima@exemplo.com");
  const [password, setPassword] = useState("••••••••");
  const [selectedUser, setSelectedUser] = useState<UserProfile>(MOCK_USERS[0]);

  const handleSelectDemo = (user: UserProfile) => {
    setSelectedUser(user);
    setEmail(user.email);
    setName(user.name);
    setPassword("fale-mais-2026");
  };

  const handleQuickLogin = (user: UserProfile) => {
    handleSelectDemo(user);
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
          <h1 className="text-3xl font-extrabold tracking-tight">
            {mode === "signin" ? "Bem-vindo de volta" : "Crie sua conta"}
          </h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            {mode === "signin"
              ? "Continue sua jornada para vencer o medo de falar em público."
              : "Junte-se a milhares de pessoas evoluindo sua oratória."}
          </p>
        </div>

        {/* Demo Fast Login Selector */}
        <div className="mt-6 rounded-3xl border border-border bg-card/80 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Contas de Demonstração (1 Clique)</span>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2">
            {MOCK_USERS.map((user) => {
              const isSelected = selectedUser.id === user.id;
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickLogin(user)}
                  className={`flex items-center gap-3 rounded-2xl p-2.5 text-left transition-all border ${
                    isSelected
                      ? "border-primary/50 bg-primary/5 shadow-soft"
                      : "border-border/60 bg-secondary/40 hover:bg-secondary"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${user.avatarColor} text-xs font-bold text-white shadow-soft`}
                  >
                    {user.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-xs font-bold text-foreground">{user.name}</p>
                      <span className="rounded-full bg-primary/10 px-1.5 py-0.2 text-[9px] font-semibold text-primary">
                        Nv. {user.level}
                      </span>
                    </div>
                    <p className="truncate text-[11px] text-muted-foreground">{user.role}</p>
                  </div>
                  <span className="rounded-full bg-gradient-brand px-2.5 py-1 text-[10px] font-semibold text-white shadow-soft">
                    Entrar
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/home" });
          }}
        >
          {mode === "signup" && (
            <Field id="name" label="Nome" icon={<UserIcon className="h-4 w-4" />}>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como devemos te chamar?"
                className="h-12 pl-10 rounded-2xl"
              />
            </Field>
          )}
          <Field id="email" label="Email" icon={<Mail className="h-4 w-4" />}>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              className="h-12 pl-10 rounded-2xl"
            />
          </Field>
          <Field id="password" label="Senha" icon={<Lock className="h-4 w-4" />}>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-12 pl-10 rounded-2xl"
            />
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
            {mode === "signin" ? "Entrar na plataforma" : "Cadastrar conta"}
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
          Explorar como visitante →
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
