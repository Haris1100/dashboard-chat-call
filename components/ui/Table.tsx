import { cn } from "@/lib/cn";
import type * as React from "react";

export function Table({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-2xl border border-zinc-200/60 dark:border-zinc-800/70",
        className
      )}
      {...props}
    />
  );
}

export function TableInner({
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn(
        "w-full border-collapse bg-white text-sm dark:bg-zinc-950",
        className
      )}
      {...props}
    />
  );
}

export function Th({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "border-b border-zinc-200/60 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800/70 dark:text-zinc-300",
        className
      )}
      {...props}
    />
  );
}

export function Td({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn("px-4 py-3 text-zinc-900 dark:text-zinc-100", className)}
      {...props}
    />
  );
}
