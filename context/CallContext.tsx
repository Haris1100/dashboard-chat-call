"use client";

import * as React from "react";
import { readJson, writeJson } from "@/lib/sotrage";

type CallStatus = "idle" | "ringing" | "connected" | "ended";

type CallState = {
  status: CallStatus;
  muted: boolean;
  videoOn: boolean;
  seconds: number;
  start: () => void;
  end: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  reset: () => void;
};

const CallContext = React.createContext<CallState | null>(null);

const key = "call:state";

export function CallProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<CallStatus>("idle");
  const [muted, setMuted] = React.useState(false);
  const [videoOn, setVideoOn] = React.useState(true);
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    const saved = readJson(key, { muted: false, videoOn: true });
    setMuted(Boolean(saved.muted));
    setVideoOn(Boolean(saved.videoOn));
  }, []);

  React.useEffect(() => {
    writeJson(key, { muted, videoOn });
  }, [muted, videoOn]);

  React.useEffect(() => {
    if (status !== "connected") return;
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [status]);

  const start = React.useCallback(() => {
    setSeconds(0);
    setStatus("ringing");
    window.setTimeout(() => setStatus("connected"), 1400);
  }, []);

  const end = React.useCallback(() => {
    setStatus("ended");
  }, []);

  const reset = React.useCallback(() => {
    setStatus("idle");
    setSeconds(0);
  }, []);

  const toggleMute = React.useCallback(() => setMuted((v) => !v), []);
  const toggleVideo = React.useCallback(() => setVideoOn((v) => !v), []);

  return (
    <CallContext.Provider
      value={{
        status,
        muted,
        videoOn,
        seconds,
        start,
        end,
        toggleMute,
        toggleVideo,
        reset,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

export function useCall() {
  const ctx = React.useContext(CallContext);
  if (!ctx) throw new Error("CallProvider missing");
  return ctx;
}
