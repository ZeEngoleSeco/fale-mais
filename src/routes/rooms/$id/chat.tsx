import { createFileRoute } from "@tanstack/react-router";
import { ProjectChatRoom } from "@/components/project-chat/ProjectChatRoom";

export const Route = createFileRoute("/rooms/$id/chat")({
  head: () => ({
    meta: [
      { title: "Bate-Papo da Sala com o Host — Fale+" },
      { name: "description", content: "Canal direto de comunicação entre o host/organizador da sala e os oradores/ouvintes." },
    ],
  }),
  component: RoomChatPage,
});

function RoomChatPage() {
  const { id } = Route.useParams();
  return <ProjectChatRoom projectId={id} backUrl={`/rooms/${id}`} />;
}
