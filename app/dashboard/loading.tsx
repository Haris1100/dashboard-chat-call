import { AppShell } from "@/components/shell/AppShell";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <AppShell>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Spinner />
            <div className="text-sm text-zinc-600 dark:text-zinc-300">
              Loading dashboard...
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
