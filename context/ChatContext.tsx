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

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = React.useState<ChatMessage[]>(seedMessages());
  const [sending, setSending] = React.useState(false);
  const [chatTheme, setChatTheme] = React.useState<"light" | "dark">(
    () => readJson(prefKey, { theme: "dark" as const }).theme
  );

  React.useEffect(() => {
    writeJson(prefKey, { theme: chatTheme });
  }, [chatTheme]);

  React.useEffect(() => {
    if (!firebaseDb) {
      console.warn("Firebase Database not initialized");
      return;
    }

    const roomRef = ref(firebaseDb, "chat/global/messages");

    const unsubscribe = onValue(
      roomRef,
      (snapshot) => {
        const data = snapshot.val() as Record<string, any> | null;

        const messageList = data
          ? Object.entries(data).map(([id, value]) => ({
              id,
              text: String(value.text ?? ""),
              createdAt: Number(value.createdAt ?? Date.now()),
              uid: String(value.uid ?? "system"),
              name: String(value.name ?? "System"),
            }))
          : [];

        messageList.sort((a, b) => a.createdAt - b.createdAt);
        setMessages(messageList.length > 0 ? messageList : seedMessages());
      },
      (error) => {
        console.error("Firebase listener error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const send = React.useCallback(
    async (text: string) => {
      const trimmedText = text.trim();
      if (!trimmedText) return;

      if (!firebaseDb) {
        alert("Chat is unavailable. Please try again later.");
        return;
      }

      setSending(true);

      try {
        const userId = user?.uid ?? "guest";
        const userName =
          user?.displayName ?? user?.email?.split("@")[0] ?? "Guest";

        const messageRef = push(ref(firebaseDb, "chat/global/messages"));

        await set(messageRef, {
          text: trimmedText,
          uid: userId,
          name: userName,
          createdAt: Date.now(),
          ts: serverTimestamp(),
        });
      } catch (error) {
        console.error("Failed to send message:", error);
        alert("Failed to send message. Please try again.");
      } finally {
        setSending(false);
      }
    },
    [user]
  );

  const clear = React.useCallback(async () => {
    if (!firebaseDb) return;

    try {
      await remove(ref(firebaseDb, "chat/global/messages"));
    } catch (error) {
      console.error("Failed to clear messages:", error);
    }
  }, []);

  const toggleChatTheme = React.useCallback(() => {
    setChatTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ChatContext.Provider
      value={{ messages, sending, send, clear, chatTheme, toggleChatTheme }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = React.useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
}
