import { cn } from "@/lib/cn";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green" | "red" | "blue" | "amber";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200",
    green:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
    red: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
    blue: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
    amber: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}
