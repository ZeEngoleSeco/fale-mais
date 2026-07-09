import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export const Route = createFileRoute("/rooms/create")({
  head: () => ({ meta: [{ title: "Criar sala — Fale+" }] }),
  component: CreateRoomPage,
});

function CreateRoomPage() {
  const navigate = useNavigate();
  const [priv, setPriv] = useState(false);
  return (
    <AppShell>
      <PageHeader title="Nova sala" back="/rooms" />
      <form
        className="px-5 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/rooms" });
        }}
      >
        <Card className="rounded-3xl p-5 space-y-4">
          <FieldStack label="Nome da sala">
            <Input placeholder="Ex.: Pitch semanal" className="h-11 rounded-2xl" />
          </FieldStack>
          <FieldStack label="Descrição">
            <Textarea placeholder="Descreva o objetivo da sala" className="min-h-24 rounded-2xl" />
          </FieldStack>
          <div className="grid grid-cols-2 gap-3">
            <FieldStack label="Categoria">
              <Input placeholder="Pitch, Improviso..." className="h-11 rounded-2xl" />
            </FieldStack>
            <FieldStack label="Máx. participantes">
              <Input type="number" defaultValue={20} className="h-11 rounded-2xl" />
            </FieldStack>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-secondary/60 p-3">
            <div>
              <p className="text-sm font-semibold">Sala privada</p>
              <p className="text-xs text-muted-foreground">Somente com convite ou senha</p>
            </div>
            <Switch checked={priv} onCheckedChange={setPriv} />
          </div>
          {priv && (
            <FieldStack label="Senha (opcional)">
              <Input type="password" placeholder="••••••" className="h-11 rounded-2xl" />
            </FieldStack>
          )}
        </Card>

        <Button type="submit" className="h-12 w-full rounded-2xl bg-gradient-brand text-base font-semibold shadow-soft">
          Criar sala
        </Button>
      </form>
    </AppShell>
  );
}

function FieldStack({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  );
}
