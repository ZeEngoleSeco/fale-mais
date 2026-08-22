import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Sparkles, Calendar, Dumbbell, User, Bell, Flame, TrendingUp, Radio, MapPin, ChevronRight, Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { BrandLogo } from "@/components/brand";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_ROOMS, MOCK_EVENTS } from "@/data/mock-data";
import { useCurrentUser } from "@/lib/user-store";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Início — Fale+" },
      { name: "description", content: "Seu painel diário para praticar oratória com IA, salas e eventos." },
    ],
  }),
  component: HomePage,
});

const shortcuts = [
  { to: "/rooms", label: "Salas de prática", desc: "Pratique com pessoas reais", icon: Users, color: "from-blue-500 to-blue-600" },
  { to: "/ai", label: "IA", desc: "Treine com seu mentor virtual", icon: Sparkles, color: "from-violet-500 to-fuchsia-500" },
  { to: "/events", label: "Eventos", desc: "Online e presenciais", icon: Calendar, color: "from-sky-500 to-cyan-500" },
  { to: "/ai/exercises", label: "Exercícios", desc: "Improviso, pitch e respiração", icon: Dumbbell, color: "from-emerald-500 to-teal-500" },
  { to: "/profile", label: "Perfil", desc: "Progresso e nível", icon: User, color: "from-indigo-500 to-purple-600" },
] as const;

function HomePage() {
  const { user } = useCurrentUser();
  const activeRooms = MOCK_ROOMS.filter((r) => r.isLive).slice(0, 2);
  const featuredEvent = MOCK_EVENTS[0];

  return (
    <AppShell>
      <header className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size={40} />
            <div>
              <p className="text-xs text-muted-foreground">Olá, {user.name} 👋</p>
              <div className="flex items-center gap-1.5">
                <p className="text-base font-semibold">Bem-vindo ao Fale+</p>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  Nv. {user.level}
                </span>
              </div>
            </div>
          </div>
          <Link
            to="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_4px_12px_rgba(255,255,255,0.2)] hover:bg-secondary"
          >
            <div className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${user.avatarColor} text-xs font-bold text-white`}>
              {user.initials}
            </div>
          </Link>
        </div>

        <Card className="mt-5 overflow-hidden rounded-3xl border-0 bg-gradient-brand p-5 text-white shadow-lift transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-[0_12px_32px_rgba(255,255,255,0.25)]">
          <div className="flex items-center justify-between text-xs font-medium opacity-90">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1">
              <Flame className="h-3.5 w-3.5 text-amber-300 fill-amber-300" /> Sequência de {user.streakDays} dias
            </span>
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold">
              {user.xp} / {user.xpNextLevel} XP
            </span>
          </div>
          <h2 className="mt-3 text-xl font-bold leading-tight">
            Pronto para vencer o palco hoje?
          </h2>
          <p className="mt-1 text-sm opacity-90">
            Comece com 5 minutos de treino guiado pela IA e ganhe +50 XP.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Link
              to="/ai/chat"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-primary shadow hover:bg-white transition-all hover:shadow-md"
            >
              Começar treino <TrendingUp className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/ai/exercises"
              className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-2 text-xs font-semibold text-white hover:bg-white/25 transition-all"
            >
              Ver exercícios
            </Link>
          </div>
        </Card>
      </header>

      {/* Mini Stats Bar */}
      <section className="px-5">
        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border bg-card/60 p-3 text-center">
          <div>
            <p className="text-base font-extrabold text-foreground">{user.stats.presentations}</p>
            <p className="text-[10px] text-muted-foreground">Apresentações</p>
          </div>
          <div className="border-x border-border/60">
            <p className="text-base font-extrabold text-primary">{user.stats.averageScore}</p>
            <p className="text-[10px] text-muted-foreground">Nota Média</p>
          </div>
          <div>
            <p className="text-base font-extrabold text-foreground">{user.stats.achievementsCount}</p>
            <p className="text-[10px] text-muted-foreground">Conquistas</p>
          </div>
        </div>
      </section>

      {/* Shortcuts */}
      <section className="mt-6 px-5">
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Atalhos Principais</h3>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5">
          {shortcuts.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_12px_28px_-4px_rgba(255,255,255,0.2)]"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} text-white shadow-soft`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div className="mt-4">
                <p className="text-[15px] font-semibold">{s.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Salas Ao Vivo Agora */}
      <section className="mt-8 px-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Salas ao vivo agora</h3>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          </div>
          <Link to="/rooms" className="text-xs font-semibold text-primary hover:underline">
            Ver todas ({MOCK_ROOMS.length})
          </Link>
        </div>

        <div className="mt-3 space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          {activeRooms.map((room) => (
            <Card key={room.id} className="rounded-3xl border-border p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_12px_28px_-4px_rgba(255,255,255,0.2)]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-rose-500/10 text-rose-600 text-[10px] font-bold border-0">
                      AO VIVO
                    </Badge>
                    <Badge variant="outline" className="rounded-full text-[10px]">{room.category}</Badge>
                  </div>
                  <p className="mt-1.5 truncate text-[14px] font-semibold">{room.name}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{room.desc}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {room.peopleCount} online
                    </span>
                    {room.currentSpeaker && (
                      <span className="truncate text-xs font-medium text-foreground">
                        🎙️ {room.currentSpeaker.name}
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  to="/rooms/$id"
                  params={{ id: room.id }}
                  className="shrink-0 rounded-full bg-gradient-brand px-3.5 py-1.5 text-xs font-semibold text-white shadow-soft transition-all hover:shadow-md"
                >
                  Entrar
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Próximo Evento em Destaque */}
      {featuredEvent && (
        <section className="mt-8 px-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground">Evento em destaque</h3>
            <Link to="/events" className="text-xs font-semibold text-primary hover:underline">Ver agenda</Link>
          </div>
          <Link
            to={featuredEvent.kind === "Online" ? "/events/online/$id" : "/events/offline/$id"}
            params={{ id: featuredEvent.id }}
            className="mt-3 block"
          >
            <Card className="rounded-3xl border-border p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_12px_28px_-4px_rgba(255,255,255,0.2)]">
              <div className="flex items-start gap-3">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-soft text-primary">
                  <span className="text-[10px] font-semibold uppercase">{featuredEvent.date.split(",")[0]}</span>
                  <span className="text-lg font-bold leading-none">{featuredEvent.date.split(" ")[1]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <Badge variant="secondary" className="rounded-full text-[10px]">{featuredEvent.kind}</Badge>
                  <p className="mt-1 truncate text-sm font-bold">{featuredEvent.title}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {featuredEvent.place}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 self-center" />
              </div>
            </Card>
          </Link>
        </section>
      )}

      {/* Retomar treino */}
      <section className="mt-8 px-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground">Retomar treino</h3>
          <Link to="/ai/history" className="text-xs font-semibold text-primary">Ver histórico</Link>
        </div>
        <Card className="mt-3 flex items-center gap-3 rounded-3xl border-border p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_12px_28px_-4px_rgba(255,255,255,0.2)]">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-soft">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Pitch de 60 segundos com IA</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Última nota: 8.9 · Retomar treino</p>
          </div>
          <Link
            to="/ai/chat"
            className="rounded-full bg-secondary px-3.5 py-1.5 text-xs font-semibold hover:bg-primary hover:text-white transition-all hover:shadow-md"
          >
            Treinar
          </Link>
        </Card>
      </section>
    </AppShell>
  );
}
