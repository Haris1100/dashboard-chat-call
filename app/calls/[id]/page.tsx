import { AppShell } from "@/components/shell/AppShell";
import { Card } from "@/components/ui/Card";
import { staticRecords } from "@/lib/static-data";
import { formatTime } from "@/lib/format";

export default async function CallDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rec = staticRecords.find(
    (r) => r.type === "call" && r.href === `/calls/${id}`
  );

  return (
    <AppShell>
      <Card className="p-6">
        <div className="text-xs text-zinc-500 dark:text-zinc-400">Call Log</div>
        <div className="mt-1 text-2xl font-semibold tracking-tight">
          {rec?.title ?? `Call ${id}`}
        </div>
        <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          {rec?.subtitle ?? "Unknown direction"} ·{" "}
          {formatTime(rec?.at ?? new Date().toISOString())}
        </div>
        <div className="mt-6 rounded-2xl border border-zinc-200/60 p-4 text-sm text-zinc-700 dark:border-zinc-800/70 dark:text-zinc-200">
          Status:{" "}
          <span className="font-semibold">{rec?.status ?? "unknown"}</span>
        </div>
      </Card>
    </AppShell>
  );
}
