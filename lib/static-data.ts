import type { DashboardRecord } from "./types";

const now = Date.now();

function isoMinus(ms: number) {
  return new Date(now - ms).toISOString();
}

export const staticRecords: DashboardRecord[] = [
  {
    id: "m-1001",
    type: "message",
    title: "New inquiry: pricing for enterprise",
    subtitle: "From Alex Morgan",
    status: "open",
    at: isoMinus(12 * 60 * 1000),
    href: "/messages/1001",
  },
  {
    id: "c-2001",
    type: "call",
    title: "Call with Sam Rivera",
    subtitle: "Outbound",
    status: "answered",
    at: isoMinus(55 * 60 * 1000),
    href: "/calls/2001",
  },
  {
    id: "u-3001",
    type: "user",
    title: "Nina Patel",
    subtitle: "Active user",
    status: "active",
    at: isoMinus(2 * 60 * 60 * 1000),
    href: "/users/1",
  },
  {
    id: "c-2002",
    type: "call",
    title: "Missed call: Jordan Lee",
    subtitle: "Inbound",
    status: "missed",
    at: isoMinus(5 * 60 * 60 * 1000),
    href: "/calls/2002",
  },
  {
    id: "m-1002",
    type: "message",
    title: "Bug report: notifications delay",
    subtitle: "From Taylor Chen",
    status: "resolved",
    at: isoMinus(12 * 60 * 60 * 1000),
    href: "/messages/1002",
  },
];
