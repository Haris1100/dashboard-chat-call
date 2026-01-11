import dynamic from "next/dynamic";
import { AppShell } from "@/components/shell/AppShell";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";

const CallPanel = dynamic(
  () => import("@/components/call/CallPanel").then((m) => m.CallPanel),
  {
    loading: () => (
      <Card className="p-6">
        <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
          <Spinner /> Loading call interface...
        </div>
      </Card>
    ),
  }
);

export default function CallPage() {
  return (
    <AppShell>
      <CallPanel />
    </AppShell>
  );
}
