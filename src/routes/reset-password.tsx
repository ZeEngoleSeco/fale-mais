import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, ArrowRight, CheckCircle2, AlertCircle, KeyRound, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandLogo, BrandWordmark } from "@/components/brand";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useCurrentUser } from "@/lib/user-store";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Redefinir Senha — Solta Voz" },
      { name: "description", content: "Redefina sua senha de acesso no Solta Voz." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { updatePassword } = useCurrentUser();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [isSessionValid, setIsSessionValid] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkRecoverySession = async () => {
      // 1. Check hash for explicit errors from Supabase redirect
      const hash = window.location.hash;
      if (hash.includes("error_description=") || hash.includes("error=")) {
        const params = new URLSearchParams(hash.replace(/^#/, ""));
        const errorDesc = params.get("error_description") || "Link de recuperação inválido ou expirado.";
        if (isMounted) {
          setErrorMessage(decodeURIComponent(errorDesc.replace(/\+/g, " ")));
          setIsSessionValid(false);
          setCheckingSession(false);
        }
        return;
      }

      // 2. Check current session
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session && !error) {
        if (isMounted) {
          setIsSessionValid(true);
          setCheckingSession(false);
        }
        return;
      }

      // Give Supabase client a moment to parse hash tokens if present
      setTimeout(async () => {
        const { data: { session: updatedSession } } = await supabase.auth.getSession();
        if (isMounted) {
          if (updatedSession) {
            setIsSessionValid(true);
          } else {
            setIsSessionValid(false);
            setErrorMessage("Sessão de recuperação inválida ou expirada. Solicite um novo link para redefinir sua senha.");
          }
          setCheckingSession(false);
        }
      }, 1000);
    };

    checkRecoverySession();

    // Listen for auth events (e.g. PASSWORD_RECOVERY)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (session && event === "SIGNED_IN")) {
        if (isMounted) {
          setIsSessionValid(true);
          setErrorMessage(null);
          setCheckingSession(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanPassword = password.trim();
    const cleanConfirm = confirmPassword.trim();

    if (!cleanPassword) {
      setErrorMessage("Por favor, digite a nova senha.");
      return;
    }

    if (!cleanConfirm) {
      setErrorMessage("Por favor, confirme a nova senha.");
      return;
    }

    if (cleanPassword !== cleanConfirm) {
      setErrorMessage("As senhas não coincidem. Digite a mesma senha nos dois campos.");
      return;
    }

    if (cleanPassword.length < 6) {
      setErrorMessage("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);

    const result = await updatePassword(cleanPassword);
    setLoading(false);

    if (!result.success) {
      const err = result.error || "Erro ao redefinir a senha.";
      setErrorMessage(err);
      toast.error("Não foi possível alterar a senha", { description: err });
      return;
    }

    setSuccessMessage("Sua senha foi redefinida com sucesso! Redirecionando para o login...");
    toast.success("Senha alterada com sucesso! 🎉");

    setTimeout(() => {
      navigate({ to: "/" });
    }, 2000);
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
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <KeyRound className="h-3.5 w-3.5" /> Redefinição de Senha
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
            Crie sua nova senha
          </h1>
          <p className="mt-2 text-[15px] text-muted-foreground leading-relaxed">
            Escolha uma nova senha forte para sua conta no Solta Voz e confirme abaixo.
          </p>
        </div>

        {checkingSession ? (
          <div className="mt-10 flex flex-col items-center justify-center space-y-3 py-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Verificando link de recuperação...</p>
          </div>
        ) : !isSessionValid ? (
          <div className="mt-6 space-y-6">
            <div className="flex items-start gap-3 rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-xs font-medium text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-sm block">Link inválido ou expirado</span>
                <p className="leading-relaxed">
                  {errorMessage || "Não encontramos uma sessão de recuperação ativa. Por favor, solicite um novo link para alterar sua senha."}
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="h-12 w-full rounded-2xl bg-gradient-brand text-base font-semibold shadow-soft hover:opacity-95 cursor-pointer"
            >
              Voltar ao Login e Solicitar Novo Link
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
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
              <Field
                id="password"
                label="Nova Senha"
                icon={<Lock className="h-4 w-4" />}
                endIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus:outline-none p-1"
                    title={showPassword ? "Ocultar senha" : "Exibir senha"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              >
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Digite a nova senha (mínimo 6 caracteres)"
                  className="h-12 pl-10 pr-10 rounded-2xl"
                  required
                />
              </Field>

              <Field
                id="confirmPassword"
                label="Confirmar Nova Senha"
                icon={<Lock className="h-4 w-4" />}
                endIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus:outline-none p-1"
                    title={showConfirmPassword ? "Ocultar senha" : "Exibir senha"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              >
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Repita a nova senha"
                  className="h-12 pl-10 pr-10 rounded-2xl"
                  required
                />
              </Field>

              <Button
                type="submit"
                disabled={loading || !!successMessage}
                className="h-12 w-full rounded-2xl bg-gradient-brand text-base font-semibold shadow-soft hover:opacity-95 active:scale-98 transition-all cursor-pointer mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Atualizando senha...
                  </span>
                ) : (
                  <>
                    Atualizar Senha
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/" className="text-xs font-semibold text-primary hover:underline">
                ← Voltar para o Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  icon,
  endIcon,
  children,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  endIcon?: React.ReactNode;
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
        {endIcon && <span className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">{endIcon}</span>}
      </div>
    </div>
  );
}
