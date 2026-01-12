"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { Table, TableInner, Td, Th } from "@/components/ui/Table";
import { Tooltip } from "@/components/ui/Tooltip";
import { fetchPosts } from "@/lib/api";
import { formatTime } from "@/lib/format";
import type { DashboardRecord, RecordStatus, RecordType } from "@/lib/types";
import {
  ArrowUpRight,
  Filter,
  RefreshCcw,
  MessageSquare,
  Phone,
  Users,
  Sparkles,
  Zap,
  Activity,
  TrendingUp,
} from "lucide-react";

const typeConfig: Record<
  RecordType,
  { tone: any; icon: any; gradient: string }
> = {
  message: {
    tone: "blue",
    icon: MessageSquare,
    gradient: "from-blue-500 to-cyan-400",
  },
  call: {
    tone: "amber",
    icon: Phone,
    gradient: "from-amber-500 to-orange-400",
  },
  user: {
    tone: "green",
    icon: Users,
    gradient: "from-emerald-500 to-teal-400",
  },
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
    <div className="relative  space-y-8">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] animate-pulse rounded-full bg-gradient-to-tl from-cyan-500/20 via-blue-500/10 to-transparent blur-3xl [animation-delay:1s]" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent blur-3xl [animation-delay:2s]" />
      </div>

      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-lg shadow-violet-500/25">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-white dark:via-zinc-300 dark:to-white">
                Command Center
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Your mission control for everything
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/chat">
            <Button
              variant="secondary"
              className="group relative overflow-hidden border-0 bg-zinc-900/5 backdrop-blur-sm transition-all hover:scale-105 hover:bg-zinc-900/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <MessageSquare className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Open Chat
            </Button>
          </Link>
          <Link href="/call">
            <Button className="group relative overflow-hidden bg-gradient-to-r from-violet-600 to-fuchsia-500 shadow-lg shadow-violet-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-violet-500/30">
              <Phone className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
              Start Call
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 opacity-0 transition-opacity group-hover:opacity-100" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          gradient="from-blue-600 to-cyan-500"
          glowColor="blue"
          trend="+12%"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={Activity}
          gradient="from-emerald-600 to-teal-500"
          glowColor="emerald"
          trend="+8%"
        />
        <StatCard
          title="Open Messages"
          value={stats.openMessages}
          icon={MessageSquare}
          gradient="from-amber-500 to-orange-500"
          glowColor="amber"
          trend="-3%"
        />
        <StatCard
          title="Missed Calls"
          value={stats.missedCalls}
          icon={Phone}
          gradient="from-rose-500 to-pink-500"
          glowColor="rose"
          trend="-15%"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/70 p-6 shadow-2xl shadow-zinc-900/5 backdrop-blur-xl transition-all hover:shadow-zinc-900/10 dark:border-white/5 dark:bg-zinc-900/70">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 blur-3xl transition-all group-hover:from-violet-500/30 group-hover:to-fuchsia-500/30" />

            <div className="relative flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/20">
                  <Filter className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight">Records</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {filtered.length} results found
                  </p>
                </div>
              </div>

              <div className="grid w-full grid-cols-1 gap-2 md:w-auto md:grid-cols-3">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="border-zinc-200/50 bg-white/50 backdrop-blur-sm transition-all focus:bg-white dark:border-zinc-700/50 dark:bg-zinc-800/50 dark:focus:bg-zinc-800"
                />
                <select
                  className="h-11 rounded-xl border border-zinc-200/50 bg-white/50 px-3 text-sm backdrop-blur-sm transition-all hover:bg-white focus:bg-white dark:border-zinc-700/50 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                >
                  <option value="all">All types</option>
                  <option value="message">Messages</option>
                  <option value="call">Calls</option>
                  <option value="user">Users</option>
                </select>
                <select
                  className="h-11 rounded-xl border border-zinc-200/50 bg-white/50 px-3 text-sm backdrop-blur-sm transition-all hover:bg-white focus:bg-white dark:border-zinc-700/50 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800"
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

            <div className="relative mt-6">
              <Table>
                <TableInner>
                  <thead>
                    <tr className="border-b border-zinc-200/50 dark:border-zinc-700/50">
                      <Th className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Type
                      </Th>
                      <Th className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Details
                      </Th>
                      <Th className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Status
                      </Th>
                      <Th className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Time
                      </Th>
                      <Th className="text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Action
                      </Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                    {slice.map((r, i) => {
                      const config = typeConfig[r.type];
                      const Icon = config.icon;
                      return (
                        <tr
                          key={r.id}
                          className="group/row transition-all hover:bg-gradient-to-r hover:from-violet-50/50 hover:to-fuchsia-50/50 dark:hover:from-violet-900/10 dark:hover:to-fuchsia-900/10"
                          style={{ animationDelay: `${i * 50}ms` }}
                        >
                          <Td>
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${config.gradient} shadow-md transition-transform group-hover/row:scale-110`}
                            >
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                          </Td>
                          <Td>
                            <div className="font-semibold transition-colors group-hover/row:text-violet-600 dark:group-hover/row:text-violet-400">
                              {r.title}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                              {r.subtitle}
                            </div>
                          </Td>
                          <Td>
                            <StatusBadge status={r.status} />
                          </Td>
                          <Td className="text-sm text-zinc-600 dark:text-zinc-300">
                            {formatTime(r.at)}
                          </Td>
                          <Td className="text-right">
                            <Tooltip label="View details">
                              <Link
                                href={r.href}
                                className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-900 transition-all hover:bg-gradient-to-r hover:from-violet-600 hover:to-fuchsia-500 hover:text-white hover:shadow-lg hover:shadow-violet-500/25 dark:bg-zinc-800 dark:text-zinc-100"
                              >
                                View
                                <ArrowUpRight className="h-4 w-4 transition-transform group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5" />
                              </Link>
                            </Tooltip>
                          </Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </TableInner>
              </Table>

              <div className="mt-6">
                <Pagination
                  page={page}
                  pageCount={pageCount}
                  onChange={setPage}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="group relative h-[58vh] overflow-y-scroll rounded-3xl border border-white/10 bg-white/70 p-6 shadow-2xl shadow-zinc-900/5 backdrop-blur-xl transition-all hover:shadow-zinc-900/10 dark:border-white/5 dark:bg-zinc-900/70">
          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-3xl transition-all group-hover:from-cyan-500/30 group-hover:to-blue-500/30" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/20">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight">Live Feed</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  External API data
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => postsQuery.refetch()}
              className="group/btn transition-all hover:bg-cyan-50 dark:hover:bg-cyan-950"
            >
              <RefreshCcw className="h-4 w-4 transition-transform group-hover/btn:rotate-180" />
            </Button>
          </div>

          <div className="relative mt-6 space-y-4">
            {postsQuery.isLoading && (
              <div className="flex items-center justify-center gap-3 py-8 text-sm text-zinc-600 dark:text-zinc-300">
                <div className="relative">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500/20 border-t-cyan-500" />
                  <div className="absolute inset-0 animate-ping rounded-full bg-cyan-500/20" />
                </div>
                <span>Loading posts...</span>
              </div>
            )}
            {postsQuery.isError && (
              <div className="rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50 p-4 text-sm text-rose-800 dark:border-rose-900/50 dark:from-rose-950/50 dark:to-pink-950/50 dark:text-rose-200">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
                  Failed to load external data
                </div>
              </div>
            )}
            {postsQuery.data?.items?.map((p, i) => (
              <div
                key={p.id}
                className="group/card relative overflow-hidden rounded-2xl border border-zinc-200/50 bg-gradient-to-br from-white to-zinc-50 p-4 transition-all hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-500/10 dark:border-zinc-700/50 dark:from-zinc-800/50 dark:to-zinc-900/50 dark:hover:border-cyan-800"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute -right-8 -top-8 h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-2xl transition-all group-hover/card:from-cyan-500/20 group-hover/card:to-blue-500/20" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-2">
                    <div className="line-clamp-1 font-semibold transition-colors group-hover/card:text-cyan-600 dark:group-hover/card:text-cyan-400">
                      {p.title}
                    </div>
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-xs font-bold text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-400">
                      {p.id}
                    </div>
                  </div>
                  <div className="mt-2 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-300">
                    {p.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  gradient,
  glowColor,
  trend,
}: {
  title: string;
  value: number;
  icon: any;
  gradient: string;
  glowColor: string;
  trend: string;
}) {
  const isPositive = trend.startsWith("+");
  const glowClasses: Record<string, string> = {
    blue: "shadow-blue-500/20 hover:shadow-blue-500/30",
    emerald: "shadow-emerald-500/20 hover:shadow-emerald-500/30",
    amber: "shadow-amber-500/20 hover:shadow-amber-500/30",
    rose: "shadow-rose-500/20 hover:shadow-rose-500/30",
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/70 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-white/5 dark:bg-zinc-900/70 ${glowClasses[glowColor]}`}
    >
      <div
        className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-3xl transition-all group-hover:opacity-30`}
      />

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight">
              {value.toLocaleString()}
            </span>
            <span
              className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                isPositive
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                  : "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400"
              }`}
            >
              <TrendingUp
                className={`h-3 w-3 ${!isPositive && "rotate-180"}`}
              />
              {trend}
            </span>
          </div>
        </div>
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}
        >
          <Icon className="h-7 w-7 text-white" />
        </div>
      </div>

      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className={`h-full w-2/3 rounded-full bg-gradient-to-r ${gradient} transition-all group-hover:w-full`}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: RecordStatus }) {
  const configs: Record<string, { bg: string; text: string; dot: string }> = {
    open: {
      bg: "bg-rose-100 dark:bg-rose-900/30",
      text: "text-rose-700 dark:text-rose-400",
      dot: "bg-rose-500",
    },
    missed: {
      bg: "bg-rose-100 dark:bg-rose-900/30",
      text: "text-rose-700 dark:text-rose-400",
      dot: "bg-rose-500",
    },
    inactive: {
      bg: "bg-zinc-100 dark:bg-zinc-800",
      text: "text-zinc-700 dark:text-zinc-400",
      dot: "bg-zinc-500",
    },
    resolved: {
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-700 dark:text-emerald-400",
      dot: "bg-emerald-500",
    },
    answered: {
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-700 dark:text-emerald-400",
      dot: "bg-emerald-500",
    },
    active: {
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-700 dark:text-emerald-400",
      dot: "bg-emerald-500 animate-pulse",
    },
  };

  const config = configs[status] || configs.inactive;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.bg} ${config.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}
