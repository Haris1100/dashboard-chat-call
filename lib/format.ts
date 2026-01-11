import { format } from "date-fns";

export function formatTime(iso: string) {
  return format(new Date(iso), "MMM d, HH:mm");
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
