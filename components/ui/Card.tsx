import { cn } from "@/lib/cn";
import type * as React from "react";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200/60 bg-white shadow-soft dark:border-zinc-800/70 dark:bg-zinc-950",
        className
      )}
      {...props}
    />
  );
}
