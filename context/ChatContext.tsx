"use client";

import * as React from "react";
import { firebaseDb } from "@/lib/firebase.client";
import { readJson, writeJson } from "@/lib/sotrage";
import {
  onValue,
  push,
  ref,
  remove,
  serverTimestamp,
  set,
} from "firebase/database";
import { useAuth } from "./AuthContext";

export type ChatMessage = {
  id: string;
  text: string;
  createdAt: number;
  uid: string;
  name: string;
};

type ChatState = {
  messages: ChatMessage[];
  sending: boolean;
  send: (text: string) => Promise<void>;
  clear: () => Promise<void>;
  chatTheme: "light" | "dark";
  toggleChatTheme: () => void;
};

const ChatContext = React.createContext<ChatState | null>(null);

const prefKey = "chat:pref";

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [sending, setSending] = React.useState(false);
  const [chatTheme, setChatTheme] = React.useState<"light" | "dark">(
    () => readJson(prefKey, { theme: "dark" as const }).theme
  );

  React.useEffect(() => {
    writeJson(prefKey, { theme: chatTheme });
  }, [chatTheme]);

  React.useEffect(() => {
    const roomRef = ref(firebaseDb, "chat/global/messages");
    const unsub = onValue(roomRef, (snap) => {
      const val = snap.val() as Record<string, any> | null;
      const list = val
        ? Object.entries(val).map(([id, v]) => ({
            id,
            text: String(v.text ?? ""),
            createdAt: Number(v.createdAt ?? Date.now()),
            uid: String(v.uid ?? "system"),
            name: String(v.name ?? "System"),
          }))
        : [];

      list.sort((a, b) => a.createdAt - b.createdAt);
      setMessages(list.length ? list : seedMessages());
    });
    return () => unsub();
  }, []);

  const send = React.useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setSending(true);
      try {
        const uid = user?.uid ?? "guest";
        const name = user?.displayName ?? user?.email?.split("@")[0] ?? "Guest";
        const mref = push(ref(firebaseDb, "chat/global/messages"));

        console.log("Sending message:", { trimmed, uid, name });

        await set(mref, {
          text: trimmed,
          uid,
          name,
          createdAt: Date.now(),
          ts: serverTimestamp(),
        });

        console.log("Message sent successfully!");
      } catch (error) {
        console.error("Failed to send message:", error);
        alert("Failed to send message. Check console for details.");
      } finally {
        setSending(false);
      }
    },
    [user]
  );
  const clear = React.useCallback(async () => {
    await remove(ref(firebaseDb, "chat/global/messages"));
  }, []);

  const toggleChatTheme = React.useCallback(() => {
    setChatTheme((v) => (v === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ChatContext.Provider
      value={{ messages, sending, send, clear, chatTheme, toggleChatTheme }}
    >
      {children}
    </ChatContext.Provider>
  );
}

function seedMessages(): ChatMessage[] {
  const base = Date.now() - 5 * 60 * 1000;
  return [
    {
      id: "seed-1",
      text: "Welcome to the live chat.",
      createdAt: base,
      uid: "system",
      name: "System",
    },
    {
      id: "seed-2",
      text: "Messages update in real-time via Firebase Realtime Database.",
      createdAt: base + 20000,
      uid: "system",
      name: "System",
    },
  ];
}

export function useChat() {
  const ctx = React.useContext(ChatContext);
  if (!ctx) throw new Error("ChatProvider missing");
  return ctx;
}
