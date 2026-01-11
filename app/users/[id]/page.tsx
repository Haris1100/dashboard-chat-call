import { AppShell } from "@/components/shell/AppShell";
import { Card } from "@/components/ui/Card";
import type { ExternalUser } from "@/lib/types";

export default async function UserDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    next: { revalidate: 300 },
  });
  const user = (
    res.ok ? ((await res.json()) as ExternalUser) : null
  ) as ExternalUser | null;

  return (
    <AppShell>
      <Card className="p-6">
        <div className="text-xs text-zinc-500 dark:text-zinc-400">User</div>
        <div className="mt-1 text-2xl font-semibold tracking-tight">
          {user?.name ?? `User ${id}`}
        </div>
        <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          @{user?.username ?? "unknown"} · {user?.email ?? "no email"}
        </div>
        <div className="mt-6 rounded-2xl border border-zinc-200/60 p-4 text-sm text-zinc-700 dark:border-zinc-800/70 dark:text-zinc-200">
          External API detail fetched server-side and rendered efficiently.
        </div>
      </Card>
    </AppShell>
  );
}
