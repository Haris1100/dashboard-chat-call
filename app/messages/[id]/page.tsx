import { AppShell } from "@/components/shell/AppShell";
import { Card } from "@/components/ui/Card";
import { staticRecords } from "@/lib/static-data";
import { formatTime } from "@/lib/format";

export default async function MessageDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rec = staticRecords.find(
    (r) => r.type === "message" && r.href === `/messages/${id}`
  );

  return (
    <AppShell>
      <Card className="p-6">
        <div className="text-xs text-zinc-500 dark:text-zinc-400">Message</div>
        <div className="mt-1 text-2xl font-semibold tracking-tight">
          {rec?.title ?? `Message ${id}`}
        </div>
        <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          {rec?.subtitle ?? "From unknown sender"} ·{" "}
          {formatTime(rec?.at ?? new Date().toISOString())}
        </div>
        <div className="mt-6 rounded-2xl border border-zinc-200/60 p-4 text-sm text-zinc-700 dark:border-zinc-800/70 dark:text-zinc-200">
          This is a detail page driven by a dynamic route. Replace this content
          with your real message data model anytime.
        </div>
      </Card>
    </AppShell>
  );
}
