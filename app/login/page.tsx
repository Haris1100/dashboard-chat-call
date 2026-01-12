"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Github,
  Chrome,
  Zap,
  Shield,
  Star,
} from "lucide-react";
import { cn } from "@/lib/cn";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [focusedField, setFocusedField] = React.useState<string | null>(null);
  const [rememberMe, setRememberMe] = React.useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 p-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-violet-600/30 via-fuchsia-500/20 to-transparent blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-cyan-500/30 via-blue-500/20 to-transparent blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent blur-3xl"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-2xl shadow-violet-500/30">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-4 bg-gradient-to-r from-white via-zinc-300 to-white bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Sign in to continue your journey
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10" />

            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 blur-2xl" />

            <div className="relative">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="group flex-1 border-0 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  <Chrome className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span className="ml-2">Google</span>
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="group flex-1 border-0 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  <Github className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span className="ml-2">GitHub</span>
                </Button>
              </div>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="text-xs text-zinc-500">or continue with</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="mb-4 overflow-hidden rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2 text-sm text-rose-400">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setError(null);
                  setLoading(true);

                  try {
                    await login(email, password);
                    router.push("/dashboard");
                  } catch (err: any) {
                    const errorMessage = err?.message ?? "Login failed";
                    setError(
                      errorMessage.includes("user-not-found") ||
                        errorMessage.includes("wrong-password")
                        ? "Invalid email or password"
                        : errorMessage
                    );
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <div className="group relative">
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 rounded-xl transition-all",
                      focusedField === "email"
                        ? "bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-violet-500/20 blur-xl"
                        : ""
                    )}
                  />
                  <div className="relative">
                    <Mail
                      className={cn(
                        "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors",
                        focusedField === "email"
                          ? "text-violet-400"
                          : "text-zinc-500"
                      )}
                    />
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Email address"
                      type="email"
                      required
                      className="h-14 border-white/10 bg-white/5 pl-12 text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:bg-white/10 focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>
                </div>

                <div className="group relative">
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 rounded-xl transition-all",
                      focusedField === "password"
                        ? "bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-violet-500/20 blur-xl"
                        : ""
                    )}
                  />
                  <div className="relative">
                    <Lock
                      className={cn(
                        "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors",
                        focusedField === "password"
                          ? "text-violet-400"
                          : "text-zinc-500"
                      )}
                    />
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="h-14 border-white/10 bg-white/5 pl-12 pr-12 text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:bg-white/10 focus:ring-2 focus:ring-violet-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2">
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-md border transition-all",
                        rememberMe
                          ? "border-violet-500 bg-violet-500"
                          : "border-white/20 bg-white/5"
                      )}
                      onClick={() => setRememberMe(!rememberMe)}
                    >
                      {rememberMe && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-3 w-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </motion.svg>
                      )}
                    </div>
                    <span className="text-sm text-zinc-400">Remember me</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-violet-400 transition-colors hover:text-violet-300"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  className="group relative h-14 w-full overflow-hidden bg-gradient-to-r from-violet-600 to-fuchsia-500 text-base font-semibold shadow-2xl shadow-violet-500/25 transition-all hover:shadow-violet-500/40"
                  disabled={loading}
                  type="submit"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{ opacity: 0.3 }}
                  />

                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <motion.div
                          className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-zinc-400">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-violet-400 transition-colors hover:text-violet-300"
                >
                  Create one
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex items-center justify-center gap-6 text-zinc-500"
        >
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="text-xs">Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="text-xs">Fast</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span className="text-xs">Trusted</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
