import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ChevronRight, Sparkles, Clock, Volume2, UserCheck, Wind, VolumeX } from "lucide-react";
import { MOCK_SUGGESTIONS } from "@/data/mock-data";

export const Route = createFileRoute("/ai/suggestions")({
  head: () => ({ meta: [{ title: "Sugestões da IA — Fale+" }] }),
  component: Suggestions,
});

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Clock": return Clock;
    case "Volume2": return Volume2;
    case "UserCheck": return UserCheck;
    case "Wind": return Wind;
    case "VolumeX": return VolumeX;
    default: return Sparkles;
  }
};

function Suggestions() {
  return (
    <AppShell>
      <PageHeader
        title="Sugestões Personalizadas"
        subtitle="Dicas práticas baseadas nas suas últimas apresentações"
        back="/ai"
      />
      <div className="px-5 space-y-3 pb-12">
        {MOCK_SUGGESTIONS.map((item) => {
          const IconComponent = getIcon(item.icon);
          return (
            <Card
              key={item.id}
              className="rounded-3xl border-border p-4.5 transition hover:shadow-soft flex flex-col gap-2"
            >
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-soft text-primary shadow-xs">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <Badge variant="outline" className="rounded-full text-[10px] mb-1">
                    {item.category}
                  </Badge>
                  <h3 className="text-sm font-bold text-foreground leading-snug">{item.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
                </div>
              </div>

              <div className="mt-2 pt-2.5 border-t border-border/50 flex justify-end">
                <Link
                  to="/ai/chat"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  Praticar dica com a IA <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
