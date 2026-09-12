import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, User as UserIcon, ArrowRight, CheckCircle2, Briefcase, AlertCircle, Sparkles, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { BrandLogo, BrandWordmark } from "@/components/brand";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useCurrentUser, saveRememberMePreference, getRememberMePreference } from "@/lib/user-store";
import { MOCK_USERS } from "@/data/mock-data";

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
  const [loading, setLoading] = useState(false);

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

    if (newMode === "signin") {
      // If email is empty, prefill default demo user for convenience
      if (!email.trim()) {
        setEmail("ana.lima@exemplo.com");
        setPassword("123456");
      }
      toast.info("Modo de Login ativado! Informe seu e-mail e senha ou use as contas de demonstração.");
    } else if (newMode === "signup") {
      toast.info("Modo de Cadastro ativado! Crie seu perfil no Fale+.");
    }
  };

  const handleSelectDemoAccount = (demoUser: typeof MOCK_USERS[0]) => {
    setEmail(demoUser.email);
    setPassword("123456");
    setMode("signin");
    setErrorMessage(null);
    toast.success(`Conta demo "${demoUser.name}" selecionada!`, {
      description: "Clique em 'Entrar na plataforma' para acessar.",
    });
  };

  const handleDirectLogin = async () => {
    const targetEmail = email.trim() || "orador@fale-mais.com";
    const targetPassword = password.trim() || "123456";
    setLoading(true);
    const result = await loginUser(targetEmail, targetPassword);
    setLoading(false);
    if (result.success) {
      saveRememberMePreference(rememberMe, targetEmail, targetPassword);
      navigate({ to: "/home" });
    } else {
      setErrorMessage(result.error || "Erro ao realizar login.");
    }
  };

  const handleAlreadyHaveAccount = () => {
    if (mode === "signin") {
      handleDirectLogin();
    } else {
      switchMode("signin");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    if (mode === "signup") {
      const targetName = name.trim();
      const targetEmail = email.trim();
      const targetRole = role.trim();

      const result = await registerUser(targetName, targetEmail, password, targetRole);
      if (!result.success) {
        setErrorMessage(result.error || "Erro ao criar conta no Supabase.");
        setLoading(false);
        return;
      }
      saveRememberMePreference(rememberMe, targetEmail, password);
      toast.success("Conta criada no Supabase! Bem-vindo ao Fale+ 🎉");
      setTimeout(() => {
        navigate({ to: "/home" });
      }, 500);
    } else if (mode === "signin") {
      const targetEmail = email.trim() || "orador@fale-mais.com";
      const targetPassword = password.trim() || "123456";
      const result = await loginUser(targetEmail, targetPassword);
      if (!result.success) {
        setErrorMessage(result.error || "Erro ao realizar login no Supabase.");
        setLoading(false);
        return;
      }
      saveRememberMePreference(rememberMe, targetEmail, targetPassword);
      navigate({ to: "/home" });
    } else if (mode === "forgot") {
      const targetEmail = email.trim();
      if (password && password !== confirmPassword) {
        setErrorMessage("As senhas não coincidem. Verifique a digitação.");
        setLoading(false);
        return;
      }
      const result = await resetPassword(targetEmail, password);
      if (!result.success) {
        setErrorMessage(result.error || "Erro ao redefinir senha.");
        setLoading(false);
        return;
      }
      saveRememberMePreference(rememberMe, targetEmail, password);
      setSuccessMessage("E-mail de recuperação / senha processados no Supabase!");
      toast.success("Operação concluída com sucesso!");
      setTimeout(() => {
        navigate({ to: "/home" });
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pt-10 pb-8">
        <div className="flex items-center gap-3">
          <BrandLogo size={44} />
          <BrandWordmark />
        </div>

        <div className="mt-8">
          {/* Alternador de Abas: Criar Conta vs Já tenho conta */}
          <div className="inline-flex rounded-full bg-secondary p-1 text-xs font-semibold shadow-xs">
            <button
              id="tab-signup"
              type="button"
              onClick={() => switchMode("signup")}
              className={`rounded-full px-4 py-2 transition-all cursor-pointer ${
                mode === "signup"
                  ? "bg-gradient-brand text-white shadow-soft font-bold scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              Criar Conta
            </button>
            <button
              id="tab-signin"
              type="button"
              onClick={handleAlreadyHaveAccount}
              className={`rounded-full px-4 py-2 transition-all cursor-pointer ${
                mode === "signin"
                  ? "bg-gradient-brand text-white shadow-soft font-bold scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
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

        {/* Contas de Demonstração Rápidas no Modo Login */}
        {mode === "signin" && (
          <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-3.5 space-y-2 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between text-xs font-bold text-foreground">
              <span className="flex items-center gap-1.5 text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Acesso Rápido com Contas Demo:
              </span>
              <span className="text-[10px] text-muted-foreground font-normal">Senha: 123456</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              {MOCK_USERS.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleSelectDemoAccount(u)}
                  className={`flex flex-col items-start rounded-xl p-2 text-left text-xs transition-all border ${
                    email.toLowerCase() === u.email.toLowerCase()
                      ? "border-primary bg-primary/15 font-bold shadow-xs"
                      : "border-border/60 bg-card hover:border-primary/40 hover:bg-secondary"
                  }`}
                >
                  <span className="font-bold text-foreground truncate w-full">{u.name}</span>
                  <span className="text-[10px] text-muted-foreground truncate w-full">{u.role}</span>
                </button>
              ))}
            </div>
          </div>
        )}

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
              required={mode === "signup" || mode === "forgot"}
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
              required={mode === "signup" || mode === "forgot"}
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
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                Esqueci minha senha
              </button>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-2xl bg-gradient-brand text-base font-semibold shadow-soft hover:opacity-95 active:scale-98 transition-all cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">Entrando...</span>
            ) : (
              <>
                {mode === "signin"
                  ? "Entrar na plataforma"
                  : mode === "signup"
                  ? "Criar conta e começar"
                  : "Redefinir Senha e Entrar"}
                <ArrowRight className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {mode === "forgot" ? (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              ← Voltar para o Login
            </button>
          </div>
        ) : (
          <p className="mt-auto pt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "Ainda não tem conta?" : "Já possui uma conta?"}{" "}
            <button
              type="button"
              onClick={mode === "signin" ? () => switchMode("signup") : handleAlreadyHaveAccount}
              className="font-semibold text-primary hover:underline cursor-pointer"
            >
              {mode === "signin" ? "Cadastre-se" : "Entrar"}
            </button>
          </p>
        )}

        <Link to="/home" className="mt-3 text-center text-xs text-muted-foreground/70 hover:text-foreground">
          Acessar diretamente sem login →
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
