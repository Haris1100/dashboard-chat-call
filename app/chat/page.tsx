import dynamic from "next/dynamic";
import { AppShell } from "@/components/shell/AppShell";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";

const ChatPanel = dynamic(
  () => import("@/components/chat/ChatPanel").then((m) => m.ChatPanel),
  {
    loading: () => (
      <Card className="p-6">
        <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
          <Spinner /> Loading chat...
        </div>
      </Card>
    ),
  }
);

export default function ChatPage() {
  return (
    <AppShell>
      <ChatPanel />
    </AppShell>
  );
}
