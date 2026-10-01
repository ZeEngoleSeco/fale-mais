import { createFileRoute } from "@tanstack/react-router";
import { ProjectChatRoom } from "@/components/project-chat/ProjectChatRoom";

export const Route = createFileRoute("/events/chat/$id")({
  head: () => ({
    meta: [
      { title: "Bate-Papo do Organizador & Participantes — Solta Voz" },
      { name: "description", content: "Canal direto de comunicação entre o organizador do projeto e todos os participantes." },
    ],
  }),
  component: EventChatPage,
});

function EventChatPage() {
  const { id } = Route.useParams();
  return <ProjectChatRoom projectId={id} backUrl={`/events/offline/${id}`} />;
}
