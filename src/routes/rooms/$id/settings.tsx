import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ChevronRight, Trash2 } from "lucide-react";

export const Route = createFileRoute("/rooms/$id/settings")({
  head: () => ({ meta: [{ title: "Configurações da sala — Fala que eu te escuto+" }] }),
  component: RoomSettings,
});

function RoomSettings() {
  const { id } = Route.useParams();
  return (
    <AppShell>
      <PageHeader title="Configurações" back="/rooms/$id" />
      <div className="px-5 space-y-4">
        <Card className="rounded-3xl p-5 space-y-4">
          <div className="space-y-1.5">
            <Label>Nome da sala</Label>
            <Input defaultValue={`Sala ${id}`} className="h-11 rounded-2xl" />
          </div>
          <div className="space-y-1.5">
            <Label>Descrição</Label>
            <Textarea defaultValue="Prática semanal de pitchs curtos" className="min-h-24 rounded-2xl" />
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-secondary/60 p-3">
            <div>
              <p className="text-sm font-semibold">Sala privada</p>
              <p className="text-xs text-muted-foreground">Somente por convite</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-secondary/60 p-3">
            <div>
              <p className="text-sm font-semibold">Notificações</p>
              <p className="text-xs text-muted-foreground">Avisos de novas sessões</p>
            </div>
            <Switch defaultChecked />
          </div>
        </Card>

        <Link
          to="/rooms/$id/invite"
          params={{ id }}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Convites</p>
            <p className="text-xs text-muted-foreground">Gerar link, QR Code e compartilhar</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        <Button variant="outline" className="h-12 w-full rounded-2xl border-destructive/40 text-destructive hover:bg-destructive/5">
          <Trash2 className="h-4 w-4" /> Excluir sala
        </Button>

        <Button className="h-12 w-full rounded-2xl bg-gradient-brand text-base font-semibold shadow-soft">
          Salvar alterações
        </Button>
      </div>
    </AppShell>
  );
}
