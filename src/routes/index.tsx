import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, User as UserIcon, ArrowRight, Sparkles, CheckCircle2, Briefcase, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BrandLogo, BrandWordmark } from "@/components/brand";
import { useState, useEffect } from "react";
import { useCurrentUser, saveRememberMePreference, getRememberMePreference } from "@/lib/user-store";

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
  const { registerUser, loginUser, resetPassword } = useCurrentUser();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const pref = getRememberMePreference();
    if (pref.remember) {
      setRememberMe(true);
      if (pref.email) setEmail(pref.email);
      if (pref.password) setPassword(pref.password);
    }
  }, []);

  const switchMode = (newMode: "signin" | "signup" | "forgot") => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
    setConfirmPassword("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (mode === "signup") {
      const targetName = name.trim();
      const targetEmail = email.trim();
      const targetRole = role.trim();

      const result = registerUser(targetName, targetEmail, password, targetRole);
      if (!result.success) {
        setErrorMessage(result.error || "Erro ao criar conta.");
        return;
      }
      saveRememberMePreference(rememberMe, targetEmail, password);
      navigate({ to: "/home" });
    } else if (mode === "signin") {
      const targetEmail = email.trim();
      const result = loginUser(targetEmail, password);
      if (!result.success) {
        setErrorMessage(result.error || "Erro ao realizar login.");
        return;
      }
      saveRememberMePreference(rememberMe, targetEmail, password);
      navigate({ to: "/home" });
    } else if (mode === "forgot") {
      const targetEmail = email.trim();
      if (password !== confirmPassword) {
        setErrorMessage("As senhas não coincidem. Verifique a digitação.");
        return;
      }
      const result = resetPassword(targetEmail, password);
      if (!result.success) {
        setErrorMessage(result.error || "Erro ao redefinir senha.");
        return;
      }
      saveRememberMePreference(rememberMe, targetEmail, password);
      setSuccessMessage("Senha redefinida com sucesso! Redirecionando para a plataforma...");
      setTimeout(() => {
        navigate({ to: "/home" });
      }, 1200);
    }
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
              onClick={() => switchMode("signup")}
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
              onClick={() => switchMode("signin")}
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
            {mode === "signin"
              ? "Bem-vindo de volta"
              : mode === "signup"
              ? "Crie seu perfil"
              : "Recuperar Senha"}
          </h1>
          <p className="mt-2 text-[15px] text-muted-foreground leading-relaxed">
            {mode === "signin"
              ? "Acesse com seu e-mail e senha para continuar seus treinos de fala."
              : mode === "signup"
              ? "Cadastre-se para destravar sua oratória com treinos práticos e IA."
              : "Informe o e-mail da sua conta cadastrada e defina a nova senha desejada."}
          </p>
        </div>

        {errorMessage && (
          <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-destructive/10 border border-destructive/20 p-3.5 text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in slide-in-from-top-1 duration-200">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>{successMessage}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <Field id="name" label="Nome Completo" icon={<UserIcon className="h-4 w-4" />}>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrorMessage(null);
                  }}
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
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="seu.email@exemplo.com"
              className="h-12 pl-10 rounded-2xl"
              required
            />
          </Field>

          <Field
            id="password"
            label={mode === "forgot" ? "Nova Senha" : "Senha"}
            icon={<Lock className="h-4 w-4" />}
          >
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage(null);
              }}
              placeholder={
                mode === "signup"
                  ? "Crie uma senha (mínimo 4 caracteres)"
                  : mode === "forgot"
                  ? "Digite sua nova senha"
                  : "Digite sua senha"
              }
              className="h-12 pl-10 rounded-2xl"
              required
            />
          </Field>

          {mode === "forgot" && (
            <Field id="confirmPassword" label="Confirmar Nova Senha" icon={<Lock className="h-4 w-4" />}>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Repita a nova senha"
                className="h-12 pl-10 rounded-2xl"
                required
              />
            </Field>
          )}

          {mode === "signup" && (
            <div className="flex items-center gap-2.5 pt-1">
              <Checkbox
                id="rememberMeSignup"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
              />
              <Label
                htmlFor="rememberMeSignup"
                className="text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none"
              >
                Lembrar de mim neste dispositivo
              </Label>
            </div>
          )}

          {mode === "signin" && (
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2.5">
                <Checkbox
                  id="rememberMeSignin"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
                <Label
                  htmlFor="rememberMeSignin"
                  className="text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none"
                >
                  Lembrar de mim
                </Label>
              </div>
              <button
                type="button"
                onClick={() => switchMode("forgot")}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>
          )}

          <Button
            type="submit"
            className="h-12 w-full rounded-2xl bg-gradient-brand text-base font-semibold shadow-soft hover:opacity-95"
          >
            {mode === "signin"
              ? "Entrar na plataforma"
              : mode === "signup"
              ? "Criar conta e começar"
              : "Redefinir Senha e Entrar"}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </form>

        {mode === "forgot" ? (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className="text-xs font-semibold text-primary hover:underline"
            >
              ← Voltar para o Login
            </button>
          </div>
        ) : (
          <p className="mt-auto pt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "Ainda não tem conta?" : "Já possui uma conta?"}{" "}
            <button
              type="button"
              onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
              className="font-semibold text-primary hover:underline"
            >
              {mode === "signin" ? "Cadastre-se" : "Entrar"}
            </button>
          </p>
        )}

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
