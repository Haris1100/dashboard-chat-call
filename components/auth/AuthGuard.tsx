"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const publicRoutes = ["/login", "/signup"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (loading) return;

    const isPublicRoute = publicRoutes.includes(pathname);

    // If not logged in and trying to access protected route
    if (!user && !isPublicRoute) {
      router.push("/login");
      return;
    }

    // If logged in and trying to access login/signup
    if (user && isPublicRoute) {
      router.push("/dashboard");
      return;
    }
  }, [user, loading, pathname, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-white"></div>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Don't render protected content if not authenticated
  const isPublicRoute = publicRoutes.includes(pathname);
  if (!user && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
}
