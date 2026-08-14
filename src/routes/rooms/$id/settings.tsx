import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ChevronRight, Trash2, CheckCircle2 } from "lucide-react";
import { MOCK_ROOMS } from "@/data/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/rooms/$id/settings")({
  head: () => ({ meta: [{ title: "Configurações da Sala — Fale+" }] }),
  component: RoomSettings,
});

function RoomSettings() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const room = MOCK_ROOMS.find((r) => r.id === id) || MOCK_ROOMS[0];

  const [name, setName] = useState(room.name);
  const [desc, setDesc] = useState(room.desc);
  const [isPrivate, setIsPrivate] = useState(room.isPrivate);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate({ to: "/rooms/$id", params: { id } });
    }, 1000);
  };

  return (
    <AppShell>
      <PageHeader title="Configurações" subtitle={room.name} back="/rooms/$id" />
      <div className="px-5 space-y-4 pb-12">
        <Card className="rounded-3xl border-border p-5 space-y-4 shadow-xs">
          <div className="space-y-1.5">
            <Label>Nome da sala</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-2xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Descrição</Label>
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="min-h-24 rounded-2xl"
            />
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-secondary/60 p-3">
            <div>
              <p className="text-sm font-semibold">Sala privada</p>
              <p className="text-xs text-muted-foreground">Apenas convidados com link</p>
            </div>
            <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-secondary/60 p-3">
            <div>
              <p className="text-sm font-semibold">Notificações da sala</p>
              <p className="text-xs text-muted-foreground">Avisar quando novas pessoas entrarem</p>
            </div>
            <Switch defaultChecked />
          </div>
        </Card>

        <Link
          to="/rooms/$id/invite"
          params={{ id }}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:bg-secondary/50 shadow-xs"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Gerenciar Convites & QR Code</p>
            <p className="text-xs text-muted-foreground">Gerar link exclusivo e código de acesso</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        <Button
          onClick={handleSave}
          className="h-12 w-full rounded-2xl bg-gradient-brand text-base font-semibold shadow-soft"
        >
          {saved ? "Alterações Salvas!" : "Salvar Alterações"}
        </Button>

        <Button
          variant="outline"
          onClick={() => navigate({ to: "/rooms" })}
          className="h-12 w-full rounded-2xl border-destructive/40 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4 mr-1" /> Excluir sala
        </Button>
      </div>
    </AppShell>
  );
}
