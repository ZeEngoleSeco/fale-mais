import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2, QrCode } from "lucide-react";

export const Route = createFileRoute("/rooms/$id/invite")({
  head: () => ({ meta: [{ title: "Convites — Fala que eu te escuto+" }] }),
  component: Invite,
});

function Invite() {
  const { id } = Route.useParams();
  const link = `https://falemais.app/sala/${id}?convite=xj4k9`;

  return (
    <AppShell>
      <PageHeader title="Convites" back="/rooms/$id/settings" />
      <div className="px-5 space-y-4">
        <Card className="rounded-3xl p-5">
          <p className="text-sm font-semibold">Link de convite</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 truncate rounded-2xl bg-secondary px-3 py-3 text-xs text-muted-foreground">
              {link}
            </div>
            <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-soft">
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </Card>

        <Card className="flex flex-col items-center rounded-3xl p-6">
          <div className="flex h-48 w-48 items-center justify-center rounded-3xl bg-gradient-soft">
            <QrCode className="h-32 w-32 text-primary" strokeWidth={1.4} />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Aponte a câmera para entrar</p>
        </Card>

        <Button className="h-12 w-full rounded-2xl bg-gradient-brand text-base font-semibold shadow-soft">
          <Share2 className="h-4 w-4" /> Compartilhar
        </Button>
      </div>
    </AppShell>
  );
}
