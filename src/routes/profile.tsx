import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Settings, Edit3, Mic, Users, Trophy, ChevronRight, Palette, Flame, Clock, Star, Award, LogOut, CheckCircle2, Lock, X, User, ArrowRight, Compass, Wind, Target, Brain, ShieldCheck, Zap, HeartHandshake, Lightbulb, GraduationCap, Volume2, Crown, Medal, Camera, Upload, Trash2, Image as ImageIcon
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ThemeSelector } from "@/components/theme-toggle";
import { useCurrentUser } from "@/lib/user-store";
import { useState, useRef } from "react";

const ICON_MAP: Record<string, React.ElementType> = {
  Mic,
  Flame,
  Trophy,
  Wind,
  Users,
  Compass,
  Target,
  Brain,
  ShieldCheck,
  Clock,
  Zap,
  HeartHandshake,
  Lightbulb,
  GraduationCap,
  Volume2,
  Crown,
  Medal,
  Award,
  Star,
};

function GetBadgeIcon({ name, unlocked }: { name: string; unlocked: boolean }) {
  const IconComp = ICON_MAP[name] || Trophy;
  return <IconComp className="h-4 w-4" />;
}

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Perfil — Fale+" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateName, logout } = useCurrentUser();
  const xpPercent = Math.round((user.xp / user.xpNextLevel) * 100);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editRole, setEditRole] = useState(user.role);
  const [editBio, setEditBio] = useState(user.bio);
  const [editAvatarUrl, setEditAvatarUrl] = useState<string | null | undefined>(user.avatarUrl);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [badgeFilter, setBadgeFilter] = useState<"all" | "unlocked" | "locked">("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const unlockedCount = user.badges.filter((b) => b.unlocked).length;
  const totalBadgesCount = user.badges.length;
  const badgesProgress = totalBadgesCount > 0 ? Math.round((unlockedCount / totalBadgesCount) * 100) : 0;

  const filteredBadges = user.badges.filter((b) => {
    if (badgeFilter === "unlocked") return b.unlocked;
    if (badgeFilter === "locked") return !b.unlocked;
    return true;
  });

  const handleOpenEdit = () => {
    setEditName(user.name);
    setEditRole(user.role);
    setEditBio(user.bio);
    setEditAvatarUrl(user.avatarUrl);
    setIsEditing(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem selecionada deve ter no máximo 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setEditAvatarUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setEditAvatarUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    await updateName(editName, editRole, editBio, editAvatarUrl);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 800);
  };

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/" });
  };

  return (
    <AppShell>
      <PageHeader
        title="Meu Perfil"
        subtitle="Evolução, conquistas e configurações"
        action={
          <button
            onClick={handleLogout}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground hover:text-destructive hover:border-destructive/40 transition"
            title="Sair da conta"
          >
            <LogOut className="h-4 w-4" />
          </button>
        }
      />
      <div className="px-5 space-y-5">
        {/* Main Profile Card */}
        <Card className="flex flex-col items-center rounded-3xl border-border p-6 text-center shadow-sm relative overflow-hidden">
          <div className="relative flex items-center justify-center my-1">
            {/* Glowing Aura Background (Softened Purple & Blue Glow) */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 opacity-55 blur-lg" />

            {/* Circular Gradient Border Frame (Purple & Blue) */}
            <div className="relative rounded-full p-[3px] bg-gradient-to-tr from-purple-600 via-indigo-500 to-blue-500 shadow-[0_0_18px_rgba(147,51,234,0.45),0_0_10px_rgba(37,99,235,0.35)]">
              <div className="rounded-full bg-card p-1">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-24 w-24 rounded-full object-cover shadow-inner"
                  />
                ) : (
                  <div className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${user.avatarColor} text-3xl font-bold text-white shadow-inner`}>
                    {user.initials}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Camera Action Button Overlay */}
            <button
              onClick={handleOpenEdit}
              className="absolute bottom-0 right-0 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition hover:scale-110 border-2 border-background"
              title="Trocar foto de perfil"
            >
              <Camera className="h-4 w-4" />
            </button>

            <span className="absolute -bottom-1 -left-1 z-10 rounded-full bg-background px-2.5 py-0.5 text-xs font-bold text-primary shadow border border-purple-500/30">
              Nv. {user.level}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <h2 className="text-xl font-extrabold text-foreground">{user.name}</h2>
            <button
              onClick={handleOpenEdit}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-primary transition"
              title="Editar nome"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="text-sm font-semibold text-primary mt-0.5">{user.role}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
          <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed">{user.bio}</p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={handleOpenEdit}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-4 py-1.5 text-xs font-bold text-white shadow-soft transition hover:opacity-90"
            >
              <Edit3 className="h-3.5 w-3.5" /> Editar dados do perfil
            </button>
          </div>

          <div className="mt-5 grid w-full grid-cols-4 gap-2">
            <Stat icon={Mic} label="Apresentações" value={String(user.stats.presentations)} />
            <Stat icon={Star} label="Nota Média" value={user.stats.averageScore > 0 ? String(user.stats.averageScore) : "—"} />
            <Stat icon={Clock} label="Horas" value={`${user.stats.hoursPracticed}h`} />
            <Stat icon={Trophy} label="Conquistas" value={String(user.stats.achievementsCount)} />
          </div>

          <div className="mt-5 w-full text-left rounded-2xl bg-secondary/50 p-3.5">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-semibold">Nível {user.level} → Nível {user.level + 1}</span>
              <span className="text-muted-foreground font-medium">{user.xp} / {user.xpNextLevel} XP ({xpPercent}%)</span>
            </div>
            <Progress value={xpPercent} className="h-2.5" />
          </div>
        </Card>

        {/* Conquistas / Badges */}
        <Card className="rounded-3xl border-border p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <h3 className="text-base font-extrabold text-foreground">Conquistas & Desafios de Oratória</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Evolua sua comunicação e receba recompensas praticando com frequência.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-secondary/60 rounded-2xl px-3 py-1.5 self-start sm:self-auto border border-border/40">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold text-foreground">
                {unlockedCount} de {totalBadgesCount} Desbloqueados
              </span>
            </div>
          </div>

          {/* Barra de Progresso Geral */}
          <div className="mt-3.5 rounded-2xl bg-secondary/40 p-3 border border-border/40">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-semibold text-muted-foreground">Progresso de Conquistas</span>
              <span className="font-extrabold text-primary">{badgesProgress}% Concluído</span>
            </div>
            <Progress value={badgesProgress} className="h-2 rounded-full" />
          </div>

          {/* Filtros em Abas */}
          <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setBadgeFilter("all")}
              className={`rounded-full px-3.5 py-1 text-xs font-bold transition ${
                badgeFilter === "all"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Todas ({totalBadgesCount})
            </button>
            <button
              onClick={() => setBadgeFilter("unlocked")}
              className={`rounded-full px-3.5 py-1 text-xs font-bold transition ${
                badgeFilter === "unlocked"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Desbloqueadas ({unlockedCount})
            </button>
            <button
              onClick={() => setBadgeFilter("locked")}
              className={`rounded-full px-3.5 py-1 text-xs font-bold transition ${
                badgeFilter === "locked"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Em andamento ({totalBadgesCount - unlockedCount})
            </button>
          </div>

          {/* Grid de Conquistas */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredBadges.map((badge) => (
              <div
                key={badge.id}
                className={`group relative flex items-start gap-3 rounded-2xl border p-3.5 transition-all duration-200 ${
                  badge.unlocked
                    ? "border-primary/30 bg-card hover:border-primary/60 hover:shadow-md hover-lift-pc"
                    : "border-border/60 bg-secondary/20 opacity-75 hover:opacity-100"
                }`}
              >
                <div
                  className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 ${
                    badge.unlocked
                      ? "bg-gradient-brand text-white shadow-soft"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <GetBadgeIcon name={badge.icon} unlocked={badge.unlocked} />
                  {!badge.unlocked && (
                    <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-background border border-border text-muted-foreground">
                      <Lock className="h-2.5 w-2.5" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="truncate text-xs font-extrabold text-foreground">{badge.title}</p>
                    {badge.category && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        badge.unlocked 
                          ? "bg-primary/10 text-primary" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {badge.category}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-[11px] text-muted-foreground leading-snug">{badge.description}</p>

                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    {badge.xpReward && (
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        +{badge.xpReward} XP
                      </span>
                    )}
                    {badge.unlocked ? (
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle2 className="h-3 w-3" /> {badge.unlockedAt || "Desbloqueado"}
                      </span>
                    ) : (
                      <span className="font-medium text-muted-foreground/80 flex items-center gap-0.5">
                        <Lock className="h-3 w-3" /> Em andamento
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Tema & Aparência */}
        <Card className="rounded-3xl border-border p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Palette className="h-4 w-4 text-primary" />
            <span>Aparência e Tema</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Personalize as cores e o modo claro/escuro da interface.
          </p>
          <div className="mt-4">
            <ThemeSelector />
          </div>
        </Card>

        {/* Links Rápidos */}
        <div className="space-y-2 pb-2">
          <ProfileRow to="/ai/insights" label="Meus Insights de Oratória" desc="Métricas vocais, pausas e postura" />
          <ProfileRow to="/ai/history" label="Histórico de Treinos" desc="Veja relatórios de todas as sessões" />
          <ProfileRow to="/rooms" label="Salas de Prática" desc="Participe de salas ao vivo ou crie a sua" />
          <ProfileRow to="/events" label="Eventos e Workshops" desc="Encontros online e presenciais" />
        </div>

        {/* Botão Sair da Conta */}
        <div className="pb-10">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="h-12 w-full rounded-2xl border-destructive/40 text-destructive hover:bg-destructive/10 font-semibold text-sm shadow-xs"
          >
            <LogOut className="h-4 w-4 mr-2" /> Desconectar da Conta
          </Button>
        </div>
      </div>

      {/* Modal de Edição de Nome e Perfil Atual */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md rounded-3xl border-border bg-card p-6 shadow-lift">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-soft">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Editar Meu Perfil</h3>
                  <p className="text-xs text-muted-foreground">Altere suas informações de cadastro</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
              {/* Profile Photo Upload Section */}
              <div className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-secondary/40 border border-border/50">
                <div className="relative rounded-full p-[2px] bg-gradient-to-tr from-purple-600 via-indigo-500 to-blue-500 shadow-sm">
                  <div className="rounded-full bg-card p-0.5">
                    {editAvatarUrl ? (
                      <img
                        src={editAvatarUrl}
                        alt="Preview da foto"
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : user.avatarUrl && editAvatarUrl !== null ? (
                      <img
                        src={user.avatarUrl}
                        alt="Preview da foto"
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${user.avatarColor} text-2xl font-bold text-white`}>
                        {user.initials}
                      </div>
                    )}
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8 rounded-xl text-xs font-semibold gap-1.5 border-primary/40 hover:border-primary text-primary"
                  >
                    <Upload className="h-3.5 w-3.5" /> Escolher Foto
                  </Button>

                  {((editAvatarUrl && editAvatarUrl !== null) || (user.avatarUrl && editAvatarUrl !== null)) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemovePhoto}
                      className="h-8 rounded-xl text-xs font-medium gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remover
                    </Button>
                  )}
                </div>

                <div className="w-full pt-1">
                  <Label htmlFor="avatar-url-input" className="text-[11px] text-muted-foreground font-medium">
                    Ou cole o link (URL) da foto:
                  </Label>
                  <Input
                    id="avatar-url-input"
                    type="url"
                    value={editAvatarUrl || ""}
                    onChange={(e) => setEditAvatarUrl(e.target.value || null)}
                    placeholder="https://exemplo.com/minha-foto.jpg"
                    className="mt-1 h-9 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profile-name" className="text-xs font-bold text-foreground">
                  Nome Completo
                </Label>
                <Input
                  id="profile-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Ex: Vilson Paixão"
                  className="h-11 rounded-2xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profile-role" className="text-xs font-bold text-foreground">
                  Cargo / Objetivo com Oratória
                </Label>
                <Input
                  id="profile-role"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  placeholder="Ex: Desenvolvedor, Palestrante, Líder..."
                  className="h-11 rounded-2xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profile-bio" className="text-xs font-bold text-foreground">
                  Biografia
                </Label>
                <Textarea
                  id="profile-bio"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Conte seus objetivos com a comunicação..."
                  className="min-h-20 rounded-2xl text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="h-11 flex-1 rounded-2xl border-border text-xs font-semibold"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className={`h-11 flex-1 rounded-2xl text-xs font-bold shadow-soft transition ${
                    saveSuccess ? "bg-emerald-600 text-white" : "bg-gradient-brand text-white"
                  }`}
                >
                  {saveSuccess ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Salvo!
                    </span>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </AppShell>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-secondary/60 px-2 py-2.5 text-center">
      <Icon className="mx-auto h-4 w-4 text-primary" />
      <p className="mt-1 text-base font-extrabold">{value}</p>
      <p className="text-[9px] text-muted-foreground font-medium leading-none">{label}</p>
    </div>
  );
}

function ProfileRow({ to, label, desc }: { to: string; label: string; desc: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:bg-secondary/50"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}

