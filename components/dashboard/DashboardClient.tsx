"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { Spinner } from "@/components/ui/Spinner";
import { Table, TableInner, Td, Th } from "@/components/ui/Table";
import { Tooltip } from "@/components/ui/Tooltip";
import { fetchPosts } from "@/lib/api";
import { formatTime } from "@/lib/format";
import type { DashboardRecord, RecordStatus, RecordType } from "@/lib/types";
import { ArrowUpRight, Filter, RefreshCcw } from "lucide-react";

const typeTones: Record<RecordType, any> = {
  message: "blue",
  call: "amber",
  user: "green",
};

function statusTone(status: RecordStatus) {
  if (status === "open" || status === "missed" || status === "inactive")
    return "red";
  if (status === "resolved" || status === "answered" || status === "active")
    return "green";
  return "neutral";
}

export function DashboardClient({
  stats,
  initialRecords,
}: {
  stats: {
    totalUsers: number;
    activeUsers: number;
    openMessages: number;
    missedCalls: number;
  };
  initialRecords: DashboardRecord[];
}) {
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState<RecordType | "all">("all");
  const [status, setStatus] = React.useState<RecordStatus | "all">("all");
  const [page, setPage] = React.useState(1);
  const perPage = 10;

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialRecords.filter((r) => {
      if (type !== "all" && r.type !== type) return false;
      if (status !== "all" && r.status !== status) return false;
      if (!q) return true;
      return (r.title + " " + r.subtitle).toLowerCase().includes(q);
    });
  }, [initialRecords, query, status, type]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  React.useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const slice = React.useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  const postsQuery = useQuery({
    queryKey: ["posts", 1, 5],
    queryFn: () => fetchPosts(1, 5),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="text-2xl font-semibold tracking-tight">Dashboard</div>
          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Overview, filters, actions, and external API data.
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/chat">
            <Button variant="secondary">Open Chat</Button>
          </Link>
          <Link href="/call">
            <Button>Start Call</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard title="Total users" value={stats.totalUsers} tone="blue" />
        <StatCard title="Active users" value={stats.activeUsers} tone="green" />
        <StatCard
          title="Open messages"
          value={stats.openMessages}
          tone="amber"
        />
        <StatCard title="Missed calls" value={stats.missedCalls} tone="red" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
              <div className="text-sm font-semibold">Records</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                {filtered.length} results
              </div>
            </div>

            <div className="grid w-full grid-cols-1 gap-2 md:w-auto md:grid-cols-3">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
              />
              <select
                className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
              >
                <option value="all">All types</option>
                <option value="message">Messages</option>
                <option value="call">Calls</option>
                <option value="user">Users</option>
              </select>
              <select
                className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option value="all">All status</option>
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
                <option value="missed">Missed</option>
                <option value="answered">Answered</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <Table>
              <TableInner>
                <thead>
                  <tr>
                    <Th>Type</Th>
                    <Th>Title</Th>
                    <Th>Status</Th>
                    <Th>Time</Th>
                    <Th className="text-right">Action</Th>
                  </tr>
                </thead>
                <tbody>
                  {slice.map((r) => (
                    <tr
                      key={r.id}
                      className="group border-b border-zinc-200/60 transition hover:bg-zinc-50 dark:border-zinc-800/70 dark:hover:bg-zinc-900/40"
                    >
                      <Td>
                        <Badge tone={typeTones[r.type]}>{r.type}</Badge>
                      </Td>
                      <Td>
                        <div className="font-semibold">{r.title}</div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          {r.subtitle}
                        </div>
                      </Td>
                      <Td>
                        <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                      </Td>
                      <Td className="text-zinc-600 dark:text-zinc-300">
                        {formatTime(r.at)}
                      </Td>
                      <Td className="text-right">
                        <Tooltip label="View details">
                          <Link
                            href={r.href}
                            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-900"
                          >
                            View <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Tooltip>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </TableInner>
            </Table>

            <div className="mt-4">
              <Pagination
                page={page}
                pageCount={pageCount}
                onChange={setPage}
              />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">External feed</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                JSONPlaceholder posts
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                postsQuery.refetch();
              }}
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {postsQuery.isLoading && (
              <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                <Spinner /> Loading posts...
              </div>
            )}
            {postsQuery.isError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                Failed to load external data
              </div>
            )}
            {postsQuery.data?.items?.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-zinc-200/60 p-4 dark:border-zinc-800/70"
              >
                <div className="line-clamp-1 text-sm font-semibold">
                  {p.title}
                </div>
                <div className="mt-1 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-300">
                  {p.body}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: number;
  tone: any;
}) {
  const ring =
    tone === "blue"
      ? "ring-sky-200 dark:ring-sky-900"
      : tone === "green"
        ? "ring-emerald-200 dark:ring-emerald-900"
        : tone === "amber"
          ? "ring-amber-200 dark:ring-amber-900"
          : "ring-red-200 dark:ring-red-900";

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {title}
          </div>
          <div className="mt-1 text-2xl font-semibold tracking-tight">
            {value}
          </div>
        </div>
        <div
          className={`h-10 w-10 rounded-2xl bg-zinc-100 ring-4 ${ring} dark:bg-zinc-900`}
        />
      </div>
    </Card>
  );
}
