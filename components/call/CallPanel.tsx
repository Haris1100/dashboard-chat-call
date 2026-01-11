"use client";

import * as React from "react";
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
} from "lucide-react";

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

  const badgeColor =
    status === "connected"
      ? "green"
      : status === "ringing"
        ? "amber"
        : status === "ended"
          ? "red"
          : "neutral";

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
      <Card className="relative overflow-hidden">
        <div className="relative h-[520px] w-full bg-zinc-950">
          {/* Remote video feed (simulated) */}
          <video
            ref={remoteVideoRef}
            className="h-full w-full object-cover opacity-90"
            autoPlay
            playsInline
            muted
            style={{ transform: "scaleX(-1)" }}
          />

          {/* Fallback background when no remote video */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-zinc-800 to-zinc-900" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/30" />

          {/* Status badge and timer */}
          <div className="absolute left-4 top-4 flex items-center gap-3">
            <Badge tone={badgeColor}>{status.toUpperCase()}</Badge>
            <div className="text-sm font-semibold text-white">
              {status === "connected" ? formatTime(seconds) : "00:00"}
            </div>
          </div>

          {/* User info */}
          <div className="absolute bottom-4 left-4">
            <div className="text-sm font-semibold text-white">
              {user?.displayName ?? "Guest Caller"}
            </div>
            <div className="text-xs text-white/70">
              {status === "ringing"
                ? "Ringing..."
                : status === "connected"
                  ? "Connected"
                  : status === "ended"
                    ? "Call ended"
                    : "Ready"}
            </div>
          </div>

          {/* Local video preview */}
          <div className="absolute bottom-4 right-4 overflow-hidden rounded-2xl border border-white/15 bg-black/30">
            {videoOn ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="h-[120px] w-[160px] object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
            ) : (
              <div className="flex h-[120px] w-[160px] items-center justify-center text-xs text-white/70">
                Video Off
              </div>
            )}
          </div>
        </div>

        {/* Call controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-4">
          {status === "idle" && (
            <Button onClick={start}>
              <PhoneCall className="h-4 w-4" />
              Start Call
            </Button>
          )}

          {(status === "ringing" || status === "connected") && (
            <>
              <Button variant="secondary" onClick={toggleMute}>
                {muted ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
                {muted ? "Unmute" : "Mute"}
              </Button>
              <Button variant="secondary" onClick={toggleVideo}>
                {videoOn ? (
                  <Video className="h-4 w-4" />
                ) : (
                  <VideoOff className="h-4 w-4" />
                )}
                {videoOn ? "Video On" : "Video Off"}
              </Button>
              <Button variant="danger" onClick={end}>
                <PhoneOff className="h-4 w-4" />
                End
              </Button>
            </>
          )}

          {status === "ended" && (
            <Button variant="secondary" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      </Card>

      {/* Call status sidebar */}
      <Card className="p-5">
        <div className="text-sm font-semibold">Call status</div>
        <div className="mt-2 rounded-2xl border border-zinc-200/60 p-4 text-sm dark:border-zinc-800/70">
          <div className="flex items-center justify-between">
            <div className="text-zinc-600 dark:text-zinc-300">State</div>
            <div className="font-semibold">{status}</div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-zinc-600 dark:text-zinc-300">Timer</div>
            <div className="font-semibold">
              {status === "connected" ? formatTime(seconds) : "00:00"}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-zinc-600 dark:text-zinc-300">Microphone</div>
            <div className="font-semibold">{muted ? "Muted" : "On"}</div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-zinc-600 dark:text-zinc-300">Camera</div>
            <div className="font-semibold">{videoOn ? "On" : "Off"}</div>
          </div>
        </div>

        <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          This demo uses your device camera for the local preview. Remote video
          is simulated. Click the video button to enable your camera.
        </div>
      </Card>
    </div>
  );
}
