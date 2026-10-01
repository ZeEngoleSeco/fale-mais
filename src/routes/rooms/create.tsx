import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  Users,
  Lock,
  Globe,
  SlidersHorizontal,
  PlusCircle,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useCurrentUser } from "@/lib/user-store";
import { createRoom } from "@/lib/supabase-room-store";
import { useState } from "react";

export const Route = createFileRoute("/rooms/create")({
  head: () => ({ meta: [{ title: "Criar Sala — Solta Voz" }] }),
  component: CreateRoomPage,
});

const categories = ["Pitch", "Improviso", "Corporativo", "Bem-estar", "Storytelling", "Debate"] as const;

export function CreateRoomPage() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<typeof categories[number]>("Pitch");
  const [maxPeople, setMaxPeople] = useState(20);
  const [initialTopic, setInitialTopic] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isGuest = !user || user.id === "user-default";

  if (isGuest) {
    return (
      <AppShell>
        <PageHeader title="Criar Sala" subtitle="Faça login para criar uma sala" back="/rooms" />
        <div className="px-5 py-12 text-center text-muted-foreground space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-primary">
            <Lock className="h-8 w-8" />
          </div>
          <p className="text-base font-bold text-foreground">Acesso Reservado a Membros</p>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Qualquer usuário cadastrado na plataforma pode criar suas próprias salas de prática e gerenciá-las.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate({ to: "/profile" })}
              className="rounded-full bg-gradient-brand px-6 py-2.5 text-xs font-bold text-white shadow-soft transition hover:opacity-90"
            >
              Criar Conta / Entrar
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Por favor, informe o nome da sala!");
      return;
    }

    setIsLoading(true);

    try {
      const room = await createRoom({
        name,
        description: desc,
        category,
        maxPeople,
        isPrivate,
        password: isPrivate ? password : undefined,
        initialTopic,
      });

      if (!room) {
        toast.error("Erro ao criar sala. Tente novamente.");
        setIsLoading(false);
        return;
      }

      toast.success(`Sala "${room.name}" criada! 🚀`, {
        description: "Entrando na sala ao vivo...",
      });

      setTimeout(() => {
        navigate({ to: "/rooms/$id", params: { id: room.id } });
      }, 600);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao criar sala.");
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <Toaster position="top-center" />
      <PageHeader title="Criar Sala de Prática" subtitle="Configure o espaço ao vivo" back="/rooms" />

      <form className="px-5 space-y-4 pb-16" onSubmit={handleSubmit}>
        {/* Informações Básicas */}
        <Card className="rounded-3xl p-5 space-y-4 border-border shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Configurações Gerais
            </span>
          </div>

          <FieldStack label="Nome da Sala *">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Pitch para Investidores & Startups"
              className="h-12 rounded-2xl"
              required
            />
          </FieldStack>

          <FieldStack label="Objetivo / Descrição">
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Descreva o que será praticado (ex: discursos de 60s, controle de gesticulação)..."
              className="min-h-20 rounded-2xl text-xs leading-relaxed"
            />
          </FieldStack>

          <FieldStack label="Categoria da Sala">
            <div className="flex flex-wrap gap-2 pt-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    category === cat
                      ? "bg-gradient-brand text-white shadow-soft font-bold scale-105"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </FieldStack>

          <FieldStack label="Tema da Primeira Apresentação (Opcional)">
            <Input
              value={initialTopic}
              onChange={(e) => setInitialTopic(e.target.value)}
              placeholder="Ex.: Pitch de Solução SaaS B2B"
              className="h-11 rounded-2xl text-xs"
            />
          </FieldStack>
        </Card>

        {/* Capacidade */}
        <Card className="rounded-3xl p-5 space-y-4 border-border shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Capacidade
            </span>
          </div>

          <FieldStack label={`Capacidade Máxima: ${maxPeople} pessoas`}>
            <div className="flex gap-2 pt-1">
              {[5, 10, 20, 35, 50].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setMaxPeople(num)}
                  className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                    maxPeople === num
                      ? "bg-primary text-white shadow-soft"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </FieldStack>
        </Card>

        {/* Privacidade */}
        <Card className="rounded-3xl p-5 space-y-4 border-border shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-soft text-primary">
                {isPrivate ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Sala Privada</p>
                <p className="text-xs text-muted-foreground">
                  {isPrivate ? "Requer senha para ingressar" : "Qualquer membro pode entrar livremente"}
                </p>
              </div>
            </div>
            <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
          </div>

          {isPrivate && (
            <FieldStack label="Senha de Acesso à Sala">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ex.: 123456"
                  className="h-11 pl-3.5 pr-10 rounded-2xl text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus:outline-none p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FieldStack>
          )}
        </Card>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-13 w-full rounded-2xl bg-gradient-brand text-base font-bold shadow-lift hover:opacity-95 transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Criando sala...
            </>
          ) : (
            <>
              <PlusCircle className="h-5 w-5 mr-2" /> Criar e Entrar na Sala
            </>
          )}
        </Button>
      </form>
    </AppShell>
  );
}

function FieldStack({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold text-foreground">{label}</Label>
      {children}
    </div>
  );
}
