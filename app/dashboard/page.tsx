import { AppShell } from "@/components/shell/AppShell";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { staticRecords } from "@/lib/static-data";
import type { ExternalUser } from "@/lib/types";

export default async function DashboardPage() {
  const usersRes = await fetch("https://jsonplaceholder.typicode.com/users", {
    next: { revalidate: 300 },
  });
  const users =
    (usersRes.ok ? ((await usersRes.json()) as ExternalUser[]) : []) ?? [];

  const stats = {
    totalUsers: users.length,
    activeUsers: Math.max(0, Math.floor(users.length * 0.6)),
    openMessages: staticRecords.filter(
      (r) => r.type === "message" && r.status === "open"
    ).length,
    missedCalls: staticRecords.filter(
      (r) => r.type === "call" && r.status === "missed"
    ).length,
  };

  return (
    <AppShell>
      <DashboardClient stats={stats} initialRecords={staticRecords} />
    </AppShell>
  );
}
