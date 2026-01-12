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
  User,
  Check,
  X,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/cn";

// Password strength checker
function getPasswordStrength(password: string) {
  let strength = 0;
  if (password.length >= 6) strength++;
  if (password.length >= 10) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
}

function getStrengthLabel(strength: number) {
  if (strength <= 1) return { label: "Weak", color: "rose" };
  if (strength <= 2) return { label: "Fair", color: "amber" };
  if (strength <= 3) return { label: "Good", color: "cyan" };
  return { label: "Strong", color: "emerald" };
}

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [focusedField, setFocusedField] = React.useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = React.useState(false);

  const passwordStrength = getPasswordStrength(password);
  const strengthInfo = getStrengthLabel(passwordStrength);

  const passwordRequirements = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase", met: /[A-Z]/.test(password) },
    { label: "Contains number", met: /[0-9]/.test(password) },
    { label: "Contains special char", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 p-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -right-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-emerald-600/30 via-cyan-500/20 to-transparent blur-3xl"
          animate={{
            x: [0, -50, 0],
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
          className="absolute -bottom-1/4 -left-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-violet-500/30 via-fuchsia-500/20 to-transparent blur-3xl"
          animate={{
            x: [0, 30, 0],
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
          className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent blur-3xl"
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

        <svg className="absolute inset-0 h-full w-full opacity-[0.03]">
          <motion.line
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            stroke="white"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.line
            x1="100%"
            y1="0%"
            x2="0%"
            y2="100%"
            stroke="white"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 5, repeat: Infinity, delay: 2.5 }}
          />
        </svg>

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
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-2xl shadow-emerald-500/30">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-4 bg-gradient-to-r from-white via-zinc-300 to-white bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            Start Your Journey
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Create an account to unlock all features
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-transparent to-violet-500/10" />

            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-tr from-violet-500/20 to-fuchsia-500/20 blur-2xl" />

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
                <span className="text-xs text-zinc-500">or register with</span>
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
                    await signup(name, email, password);
                    router.push("/dashboard");
                  } catch (err: any) {
                    setError(err?.message ?? "Signup failed");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <div className="group relative">
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 rounded-xl transition-all",
                      focusedField === "name"
                        ? "bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 blur-xl"
                        : ""
                    )}
                  />
                  <div className="relative">
                    <User
                      className={cn(
                        "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors",
                        focusedField === "name"
                          ? "text-emerald-400"
                          : "text-zinc-500"
                      )}
                    />
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Full name"
                      type="text"
                      required
                      className="h-14 border-white/10 bg-white/5 pl-12 text-white placeholder:text-zinc-500 focus:border-emerald-500/50 focus:bg-white/10 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="group relative">
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 rounded-xl transition-all",
                      focusedField === "email"
                        ? "bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 blur-xl"
                        : ""
                    )}
                  />
                  <div className="relative">
                    <Mail
                      className={cn(
                        "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors",
                        focusedField === "email"
                          ? "text-emerald-400"
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
                      className="h-14 border-white/10 bg-white/5 pl-12 text-white placeholder:text-zinc-500 focus:border-emerald-500/50 focus:bg-white/10 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="group relative">
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 rounded-xl transition-all",
                      focusedField === "password"
                        ? "bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 blur-xl"
                        : ""
                    )}
                  />
                  <div className="relative">
                    <Lock
                      className={cn(
                        "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors",
                        focusedField === "password"
                          ? "text-emerald-400"
                          : "text-zinc-500"
                      )}
                    />
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Create password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      className="h-14 border-white/10 bg-white/5 pl-12 pr-12 text-white placeholder:text-zinc-500 focus:border-emerald-500/50 focus:bg-white/10 focus:ring-2 focus:ring-emerald-500/20"
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

                <AnimatePresence>
                  {password.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 overflow-hidden"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-500">
                            Password strength
                          </span>
                          <span
                            className={cn(
                              "font-semibold",
                              strengthInfo.color === "rose" && "text-rose-400",
                              strengthInfo.color === "amber" &&
                                "text-amber-400",
                              strengthInfo.color === "cyan" && "text-cyan-400",
                              strengthInfo.color === "emerald" &&
                                "text-emerald-400"
                            )}
                          >
                            {strengthInfo.label}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              className={cn(
                                "h-1.5 flex-1 rounded-full transition-colors",
                                i < passwordStrength
                                  ? strengthInfo.color === "rose"
                                    ? "bg-rose-500"
                                    : strengthInfo.color === "amber"
                                      ? "bg-amber-500"
                                      : strengthInfo.color === "cyan"
                                        ? "bg-cyan-500"
                                        : "bg-emerald-500"
                                  : "bg-white/10"
                              )}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ delay: i * 0.1 }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {passwordRequirements.map((req, i) => (
                          <motion.div
                            key={req.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-2 text-xs"
                          >
                            <div
                              className={cn(
                                "flex h-4 w-4 items-center justify-center rounded-full transition-colors",
                                req.met
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "bg-white/5 text-zinc-600"
                              )}
                            >
                              {req.met ? (
                                <Check className="h-2.5 w-2.5" />
                              ) : (
                                <X className="h-2.5 w-2.5" />
                              )}
                            </div>
                            <span
                              className={cn(
                                "transition-colors",
                                req.met ? "text-zinc-300" : "text-zinc-600"
                              )}
                            >
                              {req.label}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "mt-0.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border transition-all",
                      agreedToTerms
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-white/20 bg-white/5 hover:border-white/40"
                    )}
                    onClick={() => setAgreedToTerms(!agreedToTerms)}
                  >
                    {agreedToTerms && (
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
                  <label className="cursor-pointer text-sm text-zinc-400">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-emerald-400 transition-colors hover:text-emerald-300"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-emerald-400 transition-colors hover:text-emerald-300"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <Button
                  className="group relative h-14 w-full overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 text-base font-semibold shadow-2xl shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 disabled:opacity-50"
                  disabled={loading || !agreedToTerms}
                  type="submit"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-300"
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
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12 group-hover:scale-110" />
                      </>
                    )}
                  </span>
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-zinc-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
                >
                  Sign in
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
            <span className="text-xs">256-bit SSL</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="text-xs">Instant Setup</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span className="text-xs">Free Plan</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          {[
            { icon: "🚀", label: "Fast Setup" },
            { icon: "🔒", label: "Secure" },
            { icon: "✨", label: "Free Trial" },
          ].map((feature, i) => (
            <motion.div
              key={feature.label}
              className="flex flex-col items-center gap-1 rounded-xl border border-white/5 bg-white/5 p-3 backdrop-blur-sm"
              whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.1)" }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="text-xl">{feature.icon}</span>
              <span className="text-xs text-zinc-500">{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
