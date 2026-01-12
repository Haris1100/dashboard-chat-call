// "use client";

// import * as React from "react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Badge } from "@/components/ui/Badge";
// import { useCall } from "@/context/CallContext";
// import { useAuth } from "@/context/AuthContext";
// import {
//   Mic,
//   MicOff,
//   Video,
//   VideoOff,
//   PhoneCall,
//   PhoneOff,
//   RotateCcw,
// } from "lucide-react";

// function formatTime(seconds: number) {
//   const mins = Math.floor(seconds / 60);
//   const secs = seconds % 60;
//   return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
// }

// export function CallPanel() {
//   const { user } = useAuth();
//   const {
//     status,
//     muted,
//     videoOn,
//     seconds,
//     start,
//     end,
//     toggleMute,
//     toggleVideo,
//     reset,
//   } = useCall();

//   const localVideoRef = React.useRef<HTMLVideoElement>(null);
//   const remoteVideoRef = React.useRef<HTMLVideoElement>(null);
//   const streamRef = React.useRef<MediaStream | null>(null);

//   // Start camera when video is turned on
//   React.useEffect(() => {
//     let mounted = true;

//     async function startCamera() {
//       if (!videoOn) {
//         // Stop camera if video is off
//         if (streamRef.current) {
//           streamRef.current.getTracks().forEach((track) => track.stop());
//           streamRef.current = null;
//         }
//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = null;
//         }
//         return;
//       }

//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: { width: 1280, height: 720 },
//           audio: false,
//         });

//         if (!mounted) {
//           stream.getTracks().forEach((track) => track.stop());
//           return;
//         }

//         streamRef.current = stream;

//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = stream;
//         }
//       } catch (err) {
//         console.error("Error accessing camera:", err);
//         alert("Could not access camera. Please check permissions.");
//       }
//     }

//     startCamera();

//     return () => {
//       mounted = false;
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, [videoOn]);

//   // Cleanup on unmount
//   React.useEffect(() => {
//     return () => {
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   const badgeColor =
//     status === "connected"
//       ? "green"
//       : status === "ringing"
//         ? "amber"
//         : status === "ended"
//           ? "red"
//           : "neutral";

//   return (
//     <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
//       <Card className="relative overflow-hidden">
//         <div className="relative h-[520px] w-full bg-zinc-950">
//           {/* Remote video feed (simulated) */}
//           <video
//             ref={remoteVideoRef}
//             className="h-full w-full object-cover opacity-90"
//             autoPlay
//             playsInline
//             muted
//             style={{ transform: "scaleX(-1)" }}
//           />

//           {/* Fallback background when no remote video */}
//           <div className="absolute inset-0 -z-10 bg-gradient-to-br from-zinc-800 to-zinc-900" />

//           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/30" />

//           {/* Status badge and timer */}
//           <div className="absolute left-4 top-4 flex items-center gap-3">
//             <Badge tone={badgeColor}>{status.toUpperCase()}</Badge>
//             <div className="text-sm font-semibold text-white">
//               {status === "connected" ? formatTime(seconds) : "00:00"}
//             </div>
//           </div>

//           {/* User info */}
//           <div className="absolute bottom-4 left-4">
//             <div className="text-sm font-semibold text-white">
//               {user?.displayName ?? "Guest Caller"}
//             </div>
//             <div className="text-xs text-white/70">
//               {status === "ringing"
//                 ? "Ringing..."
//                 : status === "connected"
//                   ? "Connected"
//                   : status === "ended"
//                     ? "Call ended"
//                     : "Ready"}
//             </div>
//           </div>

//           {/* Local video preview */}
//           <div className="absolute bottom-4 right-4 overflow-hidden rounded-2xl border border-white/15 bg-black/30">
//             {videoOn ? (
//               <video
//                 ref={localVideoRef}
//                 autoPlay
//                 playsInline
//                 muted
//                 className="h-[120px] w-[160px] object-cover"
//                 style={{ transform: "scaleX(-1)" }}
//               />
//             ) : (
//               <div className="flex h-[120px] w-[160px] items-center justify-center text-xs text-white/70">
//                 Video Off
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Call controls */}
//         <div className="flex flex-wrap items-center justify-center gap-2 p-4">
//           {status === "idle" && (
//             <Button onClick={start}>
//               <PhoneCall className="h-4 w-4" />
//               Start Call
//             </Button>
//           )}

//           {(status === "ringing" || status === "connected") && (
//             <>
//               <Button variant="secondary" onClick={toggleMute}>
//                 {muted ? (
//                   <MicOff className="h-4 w-4" />
//                 ) : (
//                   <Mic className="h-4 w-4" />
//                 )}
//                 {muted ? "Unmute" : "Mute"}
//               </Button>
//               <Button variant="secondary" onClick={toggleVideo}>
//                 {videoOn ? (
//                   <Video className="h-4 w-4" />
//                 ) : (
//                   <VideoOff className="h-4 w-4" />
//                 )}
//                 {videoOn ? "Video On" : "Video Off"}
//               </Button>
//               <Button variant="danger" onClick={end}>
//                 <PhoneOff className="h-4 w-4" />
//                 End
//               </Button>
//             </>
//           )}

//           {status === "ended" && (
//             <Button variant="secondary" onClick={reset}>
//               <RotateCcw className="h-4 w-4" />
//               Reset
//             </Button>
//           )}
//         </div>
//       </Card>

//       {/* Call status sidebar */}
//       <Card className="p-5">
//         <div className="text-sm font-semibold">Call status</div>
//         <div className="mt-2 rounded-2xl border border-zinc-200/60 p-4 text-sm dark:border-zinc-800/70">
//           <div className="flex items-center justify-between">
//             <div className="text-zinc-600 dark:text-zinc-300">State</div>
//             <div className="font-semibold">{status}</div>
//           </div>
//           <div className="mt-3 flex items-center justify-between">
//             <div className="text-zinc-600 dark:text-zinc-300">Timer</div>
//             <div className="font-semibold">
//               {status === "connected" ? formatTime(seconds) : "00:00"}
//             </div>
//           </div>
//           <div className="mt-3 flex items-center justify-between">
//             <div className="text-zinc-600 dark:text-zinc-300">Microphone</div>
//             <div className="font-semibold">{muted ? "Muted" : "On"}</div>
//           </div>
//           <div className="mt-3 flex items-center justify-between">
//             <div className="text-zinc-600 dark:text-zinc-300">Camera</div>
//             <div className="font-semibold">{videoOn ? "On" : "Off"}</div>
//           </div>
//         </div>

//         <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
//           This demo uses your device camera for the local preview. Remote video
//           is simulated. Click the video button to enable your camera.
//         </div>
//       </Card>
//     </div>
//   );
// }
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
  Zap,
  Sparkles,
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
  const remoteVideoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const [pulse, setPulse] = React.useState(false);

  // Start camera when video is turned on
  React.useEffect(() => {
    let mounted = true;

    async function startCamera() {
      if (!videoOn) {
        // Stop camera if video is off
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
          video: {
            width: 1280,
            height: 720,
            facingMode: "user",
            frameRate: { ideal: 30, max: 60 },
          },
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
        alert("Could not access camera. Please check permissions.");
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

  // Pulse effect for ringing state
  React.useEffect(() => {
    if (status === "ringing") {
      const interval = setInterval(() => {
        setPulse((prev) => !prev);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const badgeColor =
    status === "connected"
      ? "green"
      : status === "ringing"
        ? "amber"
        : status === "ended"
          ? "red"
          : "neutral";

  const statusGradient =
    status === "connected"
      ? "from-emerald-500/20 to-teal-500/20"
      : status === "ringing"
        ? "from-amber-500/20 to-orange-500/20"
        : status === "ended"
          ? "from-rose-500/20 to-pink-500/20"
          : "from-zinc-500/10 to-zinc-500/10";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      {/* Main call area */}
      <Card className="relative overflow-hidden rounded-3xl border-0 shadow-2xl">
        {/* Animated background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${statusGradient} opacity-50`}
          />
          <AnimatePresence>
            {status === "ringing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10"
                style={{
                  maskImage:
                    "radial-gradient(circle, white 2px, transparent 2px)",
                  maskSize: "20px 20px",
                  backdropFilter: "blur(10px)",
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Video container */}
        <div className="relative h-[560px] w-full overflow-hidden">
          {/* Remote video feed (simulated) */}
          <video
            ref={remoteVideoRef}
            className="h-full w-full object-cover opacity-90 transition-opacity duration-500"
            autoPlay
            playsInline
            muted
            style={{ transform: "scaleX(-1)" }}
          />

          {/* Fallback background with animated particles */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-1 w-1 rounded-full bg-white/10"
                  initial={{
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    opacity: 0,
                  }}
                  animate={{
                    x: Math.random() * 100 + 100,
                    y: Math.random() * 100 + 100,
                    opacity: [0, 0.5, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 10 + Math.random() * 10,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Status elements */}
          <div className="absolute left-6 top-6 flex items-center gap-4">
            <Badge tone={badgeColor}>{status.toUpperCase()}</Badge>
            <div className="text-lg font-mono font-semibold text-white">
              {status === "connected" ? formatTime(seconds) : "00:00"}
            </div>
          </div>

          {/* User info with animated avatar */}
          <div className="absolute bottom-6 left-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User"
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-white" />
                  )}
                </div>
                {status === "connected" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-zinc-950 bg-emerald-500"
                  />
                )}
              </div>
              <div>
                <div className="text-base font-semibold text-white">
                  {user?.displayName ?? "Guest Caller"}
                </div>
                <div className="text-xs text-white/70">
                  {status === "ringing"
                    ? "Ringing..."
                    : status === "connected"
                      ? "Connected"
                      : status === "ended"
                        ? "Call ended"
                        : "Ready to connect"}
                </div>
              </div>
            </div>
          </div>

          {/* Local video preview with floating effect */}
          <motion.div
            className="absolute bottom-6 right-6 overflow-hidden rounded-2xl border-2 border-white/10 bg-black/30 shadow-2xl shadow-black/30 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", damping: 10 }}
          >
            {videoOn ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="h-[140px] w-[180px] object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
            ) : (
              <div className="flex h-[140px] w-[180px] flex-col items-center justify-center gap-2 text-xs text-white/70">
                <VideoOff className="h-6 w-6" />
                <div>Video Off</div>
              </div>
            )}
          </motion.div>

          {/* Connection quality indicator */}
          <div className="absolute top-6 right-6 flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={cn(
                  "h-2 w-2 rounded-full",
                  i === 0
                    ? "bg-emerald-500"
                    : i === 1
                      ? "bg-amber-500"
                      : "bg-rose-500"
                )}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
            <div className="text-xs text-white/70">Excellent</div>
          </div>
        </div>

        {/* Call controls with animated background */}
        <div className="relative p-4">
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <div className="flex flex-wrap items-center justify-center gap-3">
            <AnimatePresence mode="wait">
              {status === "idle" && (
                <motion.div
                  key="start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex gap-3"
                >
                  <Button
                    onClick={start}
                    className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/40"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity group-hover:opacity-100" />
                    <PhoneCall className="h-4 w-4 transition-transform group-hover:rotate-[15deg]" />
                    <span className="ml-2">Start Call</span>
                  </Button>
                </motion.div>
              )}

              {(status === "ringing" || status === "connected") && (
                <motion.div
                  key="active"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex gap-3"
                >
                  <Button
                    variant="secondary"
                    onClick={toggleMute}
                    className={cn(
                      "group relative overflow-hidden transition-all",
                      muted &&
                        "bg-rose-500/20 text-rose-500 hover:bg-rose-500/30"
                    )}
                  >
                    {muted ? (
                      <>
                        <MicOff className="h-4 w-4 transition-transform group-hover:scale-110" />
                        <span className="ml-2">Unmute</span>
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 transition-transform group-hover:scale-110" />
                        <span className="ml-2">Mute</span>
                      </>
                    )}
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={toggleVideo}
                    className={cn(
                      "group relative overflow-hidden transition-all",
                      !videoOn &&
                        "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30"
                    )}
                  >
                    {videoOn ? (
                      <>
                        <Video className="h-4 w-4 transition-transform group-hover:scale-110" />
                        <span className="ml-2">Video On</span>
                      </>
                    ) : (
                      <>
                        <VideoOff className="h-4 w-4 transition-transform group-hover:scale-110" />
                        <span className="ml-2">Video Off</span>
                      </>
                    )}
                  </Button>

                  <Button
                    variant="danger"
                    onClick={end}
                    className="group relative overflow-hidden bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg shadow-rose-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-rose-500/40"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity group-hover:opacity-100" />
                    <PhoneOff className="h-4 w-4 transition-transform group-hover:rotate-[-15deg]" />
                    <span className="ml-2">End Call</span>
                  </Button>
                </motion.div>
              )}

              {status === "ended" && (
                <motion.div
                  key="ended"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex gap-3"
                >
                  <Button
                    variant="secondary"
                    onClick={reset}
                    className="group relative overflow-hidden transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <RotateCcw className="h-4 w-4 transition-transform group-hover:rotate-180" />
                    <span className="ml-2">Reset</span>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>

      {/* Call status sidebar with enhanced design */}
      <Card className="relative overflow-hidden rounded-3xl border-0 p-6 shadow-2xl">
        {/* Animated background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-40 w-40 animate-pulse rounded-full bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 blur-3xl" />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold">Call Details</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              Real-time connection status
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {/* Status card with animated gradient */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 opacity-30" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-2 w-2 rounded-full bg-emerald-500" />
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  Status
                </div>
              </div>
              <div className="text-lg font-semibold">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </div>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-zinc-700 dark:bg-zinc-800">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                initial={{ width: "0%" }}
                animate={{
                  width:
                    status === "connected"
                      ? "100%"
                      : status === "ringing"
                        ? "50%"
                        : "0%",
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Timer card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-500" />
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  Duration
                </div>
              </div>
              <div className="text-lg font-mono font-semibold">
                {status === "connected" ? formatTime(seconds) : "00:00"}
              </div>
            </div>
          </div>

          {/* Media controls */}
          <div className="space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {muted ? (
                    <MicOff className="h-4 w-4 text-rose-500" />
                  ) : (
                    <Mic className="h-4 w-4 text-emerald-500" />
                  )}
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    Microphone
                  </div>
                </div>
                <div className="text-sm font-semibold">
                  {muted ? "Muted" : "Active"}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {videoOn ? (
                    <Video className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <VideoOff className="h-4 w-4 text-amber-500" />
                  )}
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    Camera
                  </div>
                </div>
                <div className="text-sm font-semibold">
                  {videoOn ? "On" : "Off"}
                </div>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-violet-500" />
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  Participants
                </div>
              </div>
              <div className="text-sm font-semibold">2</div>
            </div>
            <div className="mt-3 flex -space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white ring-2 ring-zinc-950 dark:ring-white/10">
                <User className="h-4 w-4" />
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white ring-2 ring-zinc-950 dark:ring-white/10">
                <User className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="rounded-xl bg-zinc-900/50 p-3 dark:bg-white/10">
            <div className="font-semibold text-zinc-700 dark:text-zinc-300">
              Note:
            </div>
            <div className="mt-1">
              This demo uses your device camera for the local preview. Remote
              video is simulated. Click the video button to enable your camera.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
