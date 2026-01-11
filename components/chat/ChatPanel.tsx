"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { Moon, Sun, Trash2, Send } from "lucide-react";
import { cn } from "@/lib/cn";

export function ChatPanel() {
  const { messages, send, clear, sending, chatTheme, toggleChatTheme } =
    useChat();
  const { user } = useAuth();
  const [text, setText] = React.useState("");
  const endRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  return (
    <Card
      className={cn(
        "flex h-[calc(100dvh-3rem)] flex-col overflow-hidden md:h-[calc(100dvh-3rem)]",
        chatTheme === "dark"
          ? "bg-zinc-950 text-zinc-100"
          : "bg-white text-zinc-900"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between border-b p-4",
          chatTheme === "dark" ? "border-zinc-800" : "border-zinc-200"
        )}
      >
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">Real-time Chat</div>
          <div
            className={cn(
              "text-xs",
              chatTheme === "dark" ? "text-zinc-400" : "text-zinc-500"
            )}
          >
            {user ? (user.displayName ?? user.email) : "Guest"} · Firebase
            Realtime Database
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={toggleChatTheme}>
            {chatTheme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            {chatTheme === "dark" ? "Light" : "Dark"}
          </Button>
          <Button variant="danger" size="sm" onClick={() => clear()}>
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {messages.map((m) => {
              const mine = (user?.uid ?? "guest") === m.uid;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                  className={cn("flex", mine ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-soft md:max-w-[70%]",
                      mine
                        ? chatTheme === "dark"
                          ? "bg-white text-zinc-900"
                          : "bg-zinc-900 text-white"
                        : chatTheme === "dark"
                          ? "bg-zinc-900 text-zinc-100"
                          : "bg-zinc-100 text-zinc-900"
                    )}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <div
                        className={cn(
                          "text-xs font-semibold",
                          mine ? "opacity-80" : "opacity-70"
                        )}
                      >
                        {m.name}
                      </div>
                      <div
                        className={cn(
                          "text-[11px]",
                          mine ? "opacity-70" : "opacity-60"
                        )}
                      >
                        {format(new Date(m.createdAt), "HH:mm")}
                      </div>
                    </div>
                    <div className="mt-1 whitespace-pre-wrap">{m.text}</div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={endRef} />
        </div>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await send(text);
          setText("");
        }}
        className={cn(
          "flex gap-2 border-t p-4",
          chatTheme === "dark" ? "border-zinc-800" : "border-zinc-200"
        )}
      >
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message..."
          className={cn(
            chatTheme === "dark"
              ? "border-zinc-800 bg-zinc-950 focus:border-zinc-200"
              : "border-zinc-200 bg-white"
          )}
        />
        <Button type="submit" disabled={sending || !text.trim()}>
          <Send className="h-4 w-4" />
          Send
        </Button>
      </form>
    </Card>
  );
}
