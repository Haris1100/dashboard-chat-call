"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Sparkles,
  ChevronRight,
  Settings,
  HelpCircle,
  Bell,
  Search,
  Menu,
  X,
  Zap,
  Crown,
  User,
} from "lucide-react";

const nav = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    href: "/chat",
    label: "Chat",
    icon: MessageCircle,
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    href: "/call",
    label: "Call",
    icon: Phone,
    gradient: "from-emerald-500 to-teal-500",
  },
];

const secondaryNav = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help & Support", icon: HelpCircle },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <div className="relative min-h-dvh bg-zinc-50 dark:bg-zinc-950">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-to-br from-violet-500/5 via-fuchsia-500/5 to-transparent blur-3xl dark:from-violet-500/10 dark:via-fuchsia-500/5" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] animate-pulse rounded-full bg-gradient-to-tl from-cyan-500/5 via-blue-500/5 to-transparent blur-3xl [animation-delay:1s] dark:from-cyan-500/10 dark:via-blue-500/5" />
      </div>

      {/* Mobile header */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-200/50 bg-white/80 p-4 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/80 md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-lg shadow-violet-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold">Assessment</div>
            <div className="text-xs text-zinc-500">Pro Dashboard</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchOpen(!searchOpen)}
            className="h-10 w-10 p-0"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-10 w-10 p-0"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 z-50 h-full w-[280px] overflow-y-auto border-r border-white/10 bg-white/95 p-4 backdrop-blur-xl dark:bg-zinc-950/95 md:hidden"
          >
            <SidebarContent
              pathname={pathname}
              user={user}
              loading={loading}
              logout={logout}
              onClose={() => setMobileMenuOpen(false)}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="relative mx-auto grid w-full grid-cols-1 gap-6 p-4 md:grid-cols-[280px_1fr] md:p-6">
        {/* Desktop sidebar */}
        <aside className="hidden md:block">
          <div className="sticky top-6 overflow-hidden rounded-3xl border border-white/20 bg-white/70 shadow-2xl shadow-zinc-900/5 backdrop-blur-xl dark:border-white/5 dark:bg-zinc-900/70 dark:shadow-zinc-900/50">
            {/* Decorative gradient orbs */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 blur-2xl" />

            <SidebarContent
              pathname={pathname}
              user={user}
              loading={loading}
              logout={logout}
            />
          </div>
        </aside>

        {/* Main content */}
        <main className="relative min-w-0">
          {/* Top bar for desktop */}
          <div className="mb-6 hidden items-center justify-between md:flex">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="h-11 w-[300px] rounded-xl border border-zinc-200/50 bg-white/50 pl-11 pr-4 text-sm backdrop-blur-sm transition-all placeholder:text-zinc-400 focus:border-violet-500/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:focus:bg-zinc-900"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="relative h-10 w-10 p-0"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
              </Button>
              <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800" />
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-semibold">
                    {user?.displayName ?? "Guest"}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {user ? "Pro Member" : "Free Plan"}
                  </div>
                </div>
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/20">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt=""
                        className="h-full w-full rounded-xl object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-900" />
                </div>
              </div>
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  user,
  loading,
  logout,
  onClose,
}: {
  pathname: string;
  user: any;
  loading: boolean;
  logout: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="relative flex h-auto flex-col p-4">
      {/* Logo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-lg shadow-violet-500/25">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-lg font-bold tracking-tight text-transparent dark:from-white dark:to-zinc-400">
              Assessment
            </h1>
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <Zap className="h-3 w-3 text-amber-500" />
              Pro Dashboard
            </div>
          </div>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Pro badge */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 overflow-hidden rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 p-3"
        >
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Pro Member
            </span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-amber-500/20">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
              initial={{ width: "0%" }}
              animate={{ width: "75%" }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <div className="mt-1 text-[10px] text-amber-600/70 dark:text-amber-400/70">
            75% of monthly credits used
          </div>
        </motion.div>
      )}

      {/* Main navigation */}
      <nav className="mt-6 space-y-1">
        <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
          Main Menu
        </div>
        {nav.map((item, index) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-white"
                )}
              >
                {/* Active background */}
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    className={cn(
                      "absolute inset-0 rounded-xl bg-gradient-to-r shadow-lg",
                      item.gradient,
                      `shadow-${item.gradient.split("-")[1]}-500/25`
                    )}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  />
                )}

                <div
                  className={cn(
                    "relative flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                    active
                      ? "bg-white/20"
                      : "bg-zinc-100 group-hover:bg-zinc-200 dark:bg-zinc-800 dark:group-hover:bg-zinc-700"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-transform group-hover:scale-110",
                      active ? "text-white" : ""
                    )}
                  />
                </div>
                <span className="relative">{item.label}</span>
                {active && (
                  <ChevronRight className="relative ml-auto h-4 w-4" />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Secondary navigation */}
      <nav className="mt-6 space-y-1">
        <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
          Support
        </div>
        {secondaryNav.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
            >
              <Link
                href={item.href}
                onClick={onClose}
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-white"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 transition-all group-hover:bg-zinc-200 dark:bg-zinc-800 dark:group-hover:bg-zinc-700">
                  <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                </div>
                {item.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User section */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200/50 bg-gradient-to-br from-zinc-50 to-white p-4 dark:border-zinc-800/50 dark:from-zinc-900 dark:to-zinc-800/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/20">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <User className="h-6 w-6" />
              )}
            </div>
            {user && (
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-900" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {user ? "Signed in as" : "Welcome"}
            </div>
            <div className="truncate text-sm font-semibold">
              {loading
                ? "Loading..."
                : user
                  ? (user.displayName ?? user.email)
                  : "Guest User"}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {!user && !loading && (
            <>
              <Link href="/login" onClick={onClose} className="block">
                <Button className="group w-full bg-gradient-to-r from-violet-600 to-fuchsia-500 shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40">
                  <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  <span className="ml-2">Sign In</span>
                </Button>
              </Link>
              <Link href="/signup" onClick={onClose} className="block">
                <Button
                  variant="ghost"
                  className="group w-full border border-zinc-200 dark:border-zinc-800"
                >
                  <UserPlus className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span className="ml-2">Create Account</span>
                </Button>
              </Link>
            </>
          )}
          {user && (
            <Button
              variant="ghost"
              className="group w-full border border-rose-200 text-rose-600 transition-all hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/50"
              onClick={() => {
                logout();
                onClose?.();
              }}
            >
              <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span className="ml-2">Sign Out</span>
            </Button>
          )}
        </div>
      </div>

      {/* Version info */}
      <div className="mt-4 text-center text-[10px] text-zinc-400">
        <span>Version 2.0.0</span>
        <span className="mx-2">•</span>
        <span>© 2024</span>
      </div>
    </div>
  );
}
