import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  Users,
  Lock,
  Globe,
  Sparkles,
  UserPlus,
  Shield,
  Zap,
  Mic,
  MessageSquare,
  Check,
} from "lucide-react";
import { MOCK_USERS, CURRENT_USER } from "@/data/mock-data";
import { useCurrentUser } from "@/lib/user-store";
import { createNewRoom } from "@/lib/room-store";
import { useState } from "react";

export const Route = createFileRoute("/rooms/create")({
  head: () => ({ meta: [{ title: "Criar Sala — Fale+" }] }),
  component: CreateRoomPage,
});

const categories = ["Pitch", "Improviso", "Corporativo", "Bem-estar", "Storytelling", "Debate"] as const;

export function CreateRoomPage() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const activeUser = user || CURRENT_USER;

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<typeof categories[number]>("Pitch");
  const [maxPeople, setMaxPeople] = useState(20);
  const [initialTopic, setInitialTopic] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([MOCK_USERS[1].id]); // Pre-select Carlos Eduardo

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Por favor, informe o nome da sala!");
      return;
    }

    // Create room dynamically
    const room = createNewRoom({
      name,
      desc,
      category,
      maxPeople,
      isPrivate,
      password: isPrivate ? password : undefined,
      initialParticipantUserIds: selectedUserIds,
      initialTopic,
    });

    toast.success(`Sala "${room.name}" criada com sucesso! 🚀`, {
      description: "Entrando na sala ao vivo como Host...",
    });

    // Navigate directly into newly created live room
    setTimeout(() => {
      navigate({ to: "/rooms/$id", params: { id: room.id } });
    }, 600);
  };

  return (
    <AppShell>
      <Toaster position="top-center" />
      <PageHeader title="Criar Sala de Prática" subtitle="Configure o espaço ao vivo e convide pessoas" back="/rooms" />

      <form className="px-5 space-y-4 pb-16" onSubmit={handleSubmit}>
        {/* Informações Básicas da Sala */}
        <Card className="rounded-3xl p-5 space-y-4 border-border shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <Sparkles className="h-4 w-4 text-primary" />
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

          {/* Categoria */}
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

          {/* Tema Inicial de Fala */}
          <FieldStack label="Tema da Primeira Apresentação (Opcional)">
            <Input
              value={initialTopic}
              onChange={(e) => setInitialTopic(e.target.value)}
              placeholder="Ex.: Pitch de Solução SaaS B2B"
              className="h-11 rounded-2xl text-xs"
            />
          </FieldStack>
        </Card>

        {/* Capacidade e Convidar Usuários da Plataforma */}
        <Card className="rounded-3xl p-5 space-y-4 border-border shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Participantes & Capacidade
              </span>
            </div>
            <Badge variant="secondary" className="rounded-full text-[10px] font-bold">
              {selectedUserIds.length + 1} Confirmados
            </Badge>
          </div>

          {/* Botões Rápido de Lotação */}
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

          {/* Lista de Usuários para Incluir/Convidar */}
          <FieldStack label="Adicionar Membros na Sala Inicial">
            <p className="text-[11px] text-muted-foreground mb-2">
              Selecione os usuários da comunidade Fale+ que iniciarão conectados com você:
            </p>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 minimal-scrollbar">
              {/* Host fixa */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-white shadow-xs">
                    {activeUser.initials}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{activeUser.name} (Você)</p>
                    <p className="text-[10px] text-primary font-semibold">Host Criador</p>
                  </div>
                </div>
                <Badge className="bg-primary text-white text-[10px] rounded-full">Host</Badge>
              </div>

              {/* Outros usuários */}
              {MOCK_USERS.filter((u) => u.id !== activeUser.id).map((u) => {
                const isSelected = selectedUserIds.includes(u.id);

                return (
                  <div
                    key={u.id}
                    onClick={() => toggleUserSelection(u.id)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-secondary/80 border-primary/40 shadow-xs"
                        : "bg-card border-border hover:bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-soft text-xs font-bold text-primary">
                        {u.initials}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{u.name}</p>
                        <p className="text-[10px] text-muted-foreground">{u.role}</p>
                      </div>
                    </div>

                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                        isSelected
                          ? "bg-primary border-primary text-white"
                          : "border-muted-foreground/40"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </FieldStack>
        </Card>

        {/* Configurações de Privacidade */}
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
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ex.: 123456"
                className="h-11 rounded-2xl text-xs"
              />
            </FieldStack>
          )}
        </Card>

        {/* Botão de Criação */}
        <Button
          type="submit"
          className="h-13 w-full rounded-2xl bg-gradient-brand text-base font-bold shadow-lift hover:opacity-95 transition-all"
        >
          <Sparkles className="h-5 w-5 mr-2" /> Criar e Entrar na Sala
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

