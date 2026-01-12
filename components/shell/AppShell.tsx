"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  MessageCircle,
  Phone,
  LogIn,
  LogOut,
  UserPlus,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/call", label: "Call", icon: Phone },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  return (
    <div className="min-h-dvh">
      <div className="mx-auto grid w-full grid-cols-1 gap-6 p-4 md:grid-cols-[260px_1fr] md:p-6">
        <aside className="rounded-2xl border border-zinc-200/60 bg-white p-4 shadow-soft dark:border-zinc-800/70 dark:bg-zinc-950 md:sticky md:top-6 md:h-[calc(100dvh-3rem)]">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold tracking-tight">
              Assessment
              <div className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
                Call
              </div>
            </div>
          </div>

          <nav className="mt-5 space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                    active
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 rounded-2xl border border-zinc-200/60 p-3 dark:border-zinc-800/70">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              Signed in
            </div>
            <div className="mt-1 truncate text-sm font-semibold">
              {loading
                ? "Loading..."
                : user
                  ? (user.displayName ?? user.email)
                  : "Guest"}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {!user && !loading && (
                <>
                  <Link href="/login" className="w-full">
                    <Button variant="secondary" className="w-full">
                      <LogIn className="h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" className="w-full">
                    <Button variant="ghost" className="w-full">
                      <UserPlus className="h-4 w-4" />
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
              {user && (
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={() => {
                    logout();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              )}
            </div>
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
