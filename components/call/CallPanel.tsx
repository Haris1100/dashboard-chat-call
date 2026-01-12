"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCall } from "@/context/CallContext";
import { useAuth } from "@/context/AuthContext";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneCall,
  PhoneOff,
  RotateCcw,
  User,
  Users,
  Clock,
  Shield,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/cn";

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function CallPanel() {
  const { user } = useAuth();
  const {
    status,
    muted,
    videoOn,
    seconds,
    start,
    end,
    toggleMute,
    toggleVideo,
    reset,
  } = useCall();

  const localVideoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  // Start camera when video is turned on
  React.useEffect(() => {
    let mounted = true;

    async function startCamera() {
      if (!videoOn) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = null;
        }
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: false,
        });

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }

    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoOn]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
      {/* Main Call Area */}
      <div className="relative flex-1 overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl sm:rounded-3xl">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-cyan-600/10" />

        {/* Video Area */}
        <div className="relative flex h-[300px] w-full items-center justify-center sm:h-[400px] md:h-[500px]">
          {/* Idle State */}
          {status === "idle" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center px-4 text-center"
            >
              {/* Avatar */}
              <div className="relative mx-auto">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 p-1 sm:h-28 sm:w-28">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-900">
                    <User className="h-10 w-10 text-white/80 sm:h-14 sm:w-14" />
                  </div>
                </div>
                {/* Pulse ring */}
                <div className="absolute inset-0 animate-ping rounded-full bg-violet-500/20" />
              </div>

              <h2 className="mt-4 text-xl font-bold text-white sm:mt-6 sm:text-2xl">
                Ready to Connect
              </h2>
              <p className="mt-1 text-sm text-zinc-400 sm:mt-2 sm:text-base">
                Start a call to begin your conversation
              </p>

              {/* Start Call Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 sm:mt-8"
              >
                <Button
                  onClick={start}
                  className="h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 text-base font-semibold shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 hover:shadow-emerald-500/40 sm:h-14 sm:rounded-2xl sm:px-8 sm:text-lg"
                >
                  <PhoneCall className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Start Call
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Ringing State */}
          {status === "ringing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center px-4 text-center"
            >
              <div className="relative mx-auto">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 p-1 sm:h-28 sm:w-28"
                >
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-900">
                    <PhoneCall className="h-10 w-10 text-amber-400 sm:h-14 sm:w-14" />
                  </div>
                </motion.div>
                {/* Animated rings */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-amber-500/50"
                    animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.4,
                    }}
                  />
                ))}
              </div>

              <motion.h2
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mt-4 text-xl font-bold text-white sm:mt-6 sm:text-2xl"
              >
                Connecting...
              </motion.h2>
            </motion.div>
          )}

          {/* Connected State */}
          {status === "connected" && (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 px-4">
              <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 p-1 sm:h-32 sm:w-32">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-800">
                  <User className="h-12 w-12 text-white/80 sm:h-16 sm:w-16" />
                </div>
              </div>
              <p className="mt-3 text-base font-medium text-white sm:mt-4 sm:text-lg">
                Remote User
              </p>
              <p className="text-xs text-zinc-400 sm:text-sm">Connected</p>
            </div>
          )}

          {/* Ended State */}
          {status === "ended" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center px-4 text-center"
            >
              <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 p-1 sm:h-28 sm:w-28">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-900">
                  <PhoneOff className="h-10 w-10 text-rose-400 sm:h-14 sm:w-14" />
                </div>
              </div>

              <h2 className="mt-4 text-xl font-bold text-white sm:mt-6 sm:text-2xl">
                Call Ended
              </h2>
              <p className="mt-1 text-sm text-zinc-400 sm:mt-2 sm:text-base">
                Duration: {formatTime(seconds)}
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 sm:mt-8"
              >
                <Button
                  onClick={reset}
                  variant="secondary"
                  className="h-10 rounded-xl px-5 sm:h-12 sm:px-6"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Start New Call
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Top bar - Status & Timer */}
          <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Status badge */}
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-sm",
                  status === "connected"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : status === "ringing"
                      ? "bg-amber-500/20 text-amber-400"
                      : status === "ended"
                        ? "bg-rose-500/20 text-rose-400"
                        : "bg-white/10 text-white"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2",
                    status === "connected"
                      ? "bg-emerald-400"
                      : status === "ringing"
                        ? "animate-pulse bg-amber-400"
                        : status === "ended"
                          ? "bg-rose-400"
                          : "bg-white/50"
                  )}
                />
                <span className="hidden xs:inline">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>

              {/* Timer */}
              {status === "connected" && (
                <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1.5 backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2">
                  <Clock className="h-3 w-3 text-white/70 sm:h-4 sm:w-4" />
                  <span className="font-mono text-xs font-semibold text-white sm:text-sm">
                    {formatTime(seconds)}
                  </span>
                </div>
              )}
            </div>

            {/* Connection quality */}
            <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-1.5 backdrop-blur-sm sm:gap-2 sm:px-3 sm:py-2">
              <Wifi className="h-3 w-3 text-emerald-400 sm:h-4 sm:w-4" />
              <Shield className="h-3 w-3 text-cyan-400 sm:h-4 sm:w-4" />
            </div>
          </div>

          {/* Local video preview */}
          {(status === "connected" || status === "ringing") && (
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
              <div className="overflow-hidden rounded-xl border-2 border-white/20 bg-zinc-800 shadow-xl sm:rounded-2xl">
                {videoOn ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-[80px] w-[100px] object-cover sm:h-[120px] sm:w-[160px]"
                    style={{ transform: "scaleX(-1)" }}
                  />
                ) : (
                  <div className="flex h-[80px] w-[100px] flex-col items-center justify-center bg-zinc-800 sm:h-[120px] sm:w-[160px]">
                    <VideoOff className="h-5 w-5 text-zinc-500 sm:h-8 sm:w-8" />
                    <span className="mt-1 text-[10px] text-zinc-500 sm:mt-2 sm:text-xs">
                      Camera Off
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User name */}
          {(status === "connected" || status === "ringing") && (
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
              <div className="flex items-center gap-2 rounded-lg bg-black/50 px-2.5 py-1.5 backdrop-blur-sm sm:gap-3 sm:rounded-xl sm:px-4 sm:py-2">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 p-0.5 sm:h-8 sm:w-8">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-900">
                    <User className="h-3 w-3 text-white sm:h-4 sm:w-4" />
                  </div>
                </div>
                <span className="text-xs font-medium text-white sm:text-sm">
                  {user?.displayName ?? "You"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Call Controls */}
        {(status === "ringing" || status === "connected") && (
          <div className="border-t border-white/10 bg-black/30 p-3 backdrop-blur-sm sm:p-4">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              {/* Mute button */}
              <button
                onClick={toggleMute}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full transition-all sm:h-14 sm:w-14",
                  muted
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                    : "bg-white/10 text-white hover:bg-white/20"
                )}
              >
                {muted ? (
                  <MicOff className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Mic className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </button>

              {/* Video button */}
              <button
                onClick={toggleVideo}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full transition-all sm:h-14 sm:w-14",
                  !videoOn
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                    : "bg-white/10 text-white hover:bg-white/20"
                )}
              >
                {videoOn ? (
                  <Video className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <VideoOff className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </button>

              {/* End call button */}
              <button
                onClick={end}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/30 transition-all hover:bg-rose-600 sm:h-14 sm:w-14"
              >
                <PhoneOff className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="w-full space-y-4 lg:w-[340px]">
        {/* Call Info */}
        <Card className="rounded-xl border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 sm:rounded-2xl sm:p-5">
          <h3 className="flex items-center gap-2 text-base font-semibold sm:text-lg">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 sm:h-8 sm:w-8">
              <PhoneCall className="h-3.5 w-3.5 text-violet-500 sm:h-4 sm:w-4" />
            </div>
            Call Details
          </h3>

          <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
            {/* Status */}
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-2.5 dark:bg-zinc-800/50 sm:rounded-xl sm:p-3">
              <span className="text-xs text-zinc-500 sm:text-sm">Status</span>
              <span
                className={cn(
                  "text-xs font-semibold capitalize sm:text-sm",
                  status === "connected"
                    ? "text-emerald-500"
                    : status === "ringing"
                      ? "text-amber-500"
                      : status === "ended"
                        ? "text-rose-500"
                        : "text-zinc-500"
                )}
              >
                {status}
              </span>
            </div>

            {/* Duration */}
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-2.5 dark:bg-zinc-800/50 sm:rounded-xl sm:p-3">
              <span className="text-xs text-zinc-500 sm:text-sm">Duration</span>
              <span className="font-mono text-xs font-semibold sm:text-sm">
                {status === "connected" || status === "ended"
                  ? formatTime(seconds)
                  : "--:--"}
              </span>
            </div>

            {/* Microphone */}
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-2.5 dark:bg-zinc-800/50 sm:rounded-xl sm:p-3">
              <span className="text-xs text-zinc-500 sm:text-sm">
                Microphone
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {muted ? (
                  <MicOff className="h-3.5 w-3.5 text-rose-500 sm:h-4 sm:w-4" />
                ) : (
                  <Mic className="h-3.5 w-3.5 text-emerald-500 sm:h-4 sm:w-4" />
                )}
                <span className="text-xs font-semibold sm:text-sm">
                  {muted ? "Muted" : "Active"}
                </span>
              </div>
            </div>

            {/* Camera */}
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-2.5 dark:bg-zinc-800/50 sm:rounded-xl sm:p-3">
              <span className="text-xs text-zinc-500 sm:text-sm">Camera</span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {videoOn ? (
                  <Video className="h-3.5 w-3.5 text-emerald-500 sm:h-4 sm:w-4" />
                ) : (
                  <VideoOff className="h-3.5 w-3.5 text-amber-500 sm:h-4 sm:w-4" />
                )}
                <span className="text-xs font-semibold sm:text-sm">
                  {videoOn ? "On" : "Off"}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Participants */}
        <Card className="rounded-xl border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 sm:rounded-2xl sm:p-5">
          <h3 className="flex items-center gap-2 text-base font-semibold sm:text-lg">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 sm:h-8 sm:w-8">
              <Users className="h-3.5 w-3.5 text-cyan-500 sm:h-4 sm:w-4" />
            </div>
            Participants
          </h3>

          <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
            {/* You */}
            <div className="flex items-center gap-2.5 rounded-lg bg-zinc-50 p-2.5 dark:bg-zinc-800/50 sm:gap-3 sm:rounded-xl sm:p-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 p-0.5 sm:h-10 sm:w-10">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-zinc-900">
                  <User className="h-4 w-4 text-violet-500 sm:h-5 sm:w-5" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate text-xs font-semibold sm:text-sm">
                  {user?.displayName ?? "You"}
                </div>
                <div className="text-[10px] text-zinc-500 sm:text-xs">Host</div>
              </div>
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>

            {/* Remote user */}
            <div className="flex items-center gap-2.5 rounded-lg bg-zinc-50 p-2.5 dark:bg-zinc-800/50 sm:gap-3 sm:rounded-xl sm:p-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5 sm:h-10 sm:w-10">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-zinc-900">
                  <User className="h-4 w-4 text-cyan-500 sm:h-5 sm:w-5" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate text-xs font-semibold sm:text-sm">
                  Remote User
                </div>
                <div className="text-[10px] text-zinc-500 sm:text-xs">
                  Participant
                </div>
              </div>
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  status === "connected" ? "bg-emerald-500" : "bg-zinc-400"
                )}
              />
            </div>
          </div>
        </Card>

        {/* Note */}
        <div className="rounded-lg bg-zinc-100 p-3 text-[10px] text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400 sm:rounded-xl sm:p-4 sm:text-xs">
          <p>
            <strong>Note:</strong> This demo uses your device camera for the
            local preview. Remote video is simulated.
          </p>
        </div>
      </div>
    </div>
  );
}
