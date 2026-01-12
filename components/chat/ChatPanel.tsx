// "use client";

// import * as React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { useChat } from "@/context/ChatContext";
// import { useAuth } from "@/context/AuthContext";
// import { format } from "date-fns";
// import { Moon, Sun, Trash2, Send } from "lucide-react";
// import { cn } from "@/lib/cn";

// export function ChatPanel() {
//   const { messages, send, clear, sending, chatTheme, toggleChatTheme } =
//     useChat();
//   const { user } = useAuth();
//   const [text, setText] = React.useState("");
//   const endRef = React.useRef<HTMLDivElement | null>(null);

//   React.useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
//   }, [messages.length]);

//   return (
//     <Card
//       className={cn(
//         "flex h-[calc(100dvh-3rem)] flex-col overflow-hidden md:h-[calc(100dvh-3rem)]",
//         chatTheme === "dark"
//           ? "bg-zinc-950 text-zinc-100"
//           : "bg-white text-zinc-900"
//       )}
//     >
//       <div
//         className={cn(
//           "flex items-center justify-between border-b p-4",
//           chatTheme === "dark" ? "border-zinc-800" : "border-zinc-200"
//         )}
//       >
//         <div className="min-w-0">
//           <div className="truncate text-sm font-semibold">Real-time Chat</div>
//           <div
//             className={cn(
//               "text-xs",
//               chatTheme === "dark" ? "text-zinc-400" : "text-zinc-500"
//             )}
//           >
//             {user ? (user.displayName ?? user.email) : "Guest"} · Firebase
//             Realtime Database
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="secondary" size="sm" onClick={toggleChatTheme}>
//             {chatTheme === "dark" ? (
//               <Sun className="h-4 w-4" />
//             ) : (
//               <Moon className="h-4 w-4" />
//             )}
//             {chatTheme === "dark" ? "Light" : "Dark"}
//           </Button>
//           <Button variant="danger" size="sm" onClick={() => clear()}>
//             <Trash2 className="h-4 w-4" />
//             Clear
//           </Button>
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4">
//         <div className="space-y-3">
//           <AnimatePresence initial={false}>
//             {messages.map((m) => {
//               const mine = (user?.uid ?? "guest") === m.uid;
//               return (
//                 <motion.div
//                   key={m.id}
//                   initial={{ opacity: 0, y: 6 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 6 }}
//                   transition={{ duration: 0.18 }}
//                   className={cn("flex", mine ? "justify-end" : "justify-start")}
//                 >
//                   <div
//                     className={cn(
//                       "max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-soft md:max-w-[70%]",
//                       mine
//                         ? chatTheme === "dark"
//                           ? "bg-white text-zinc-900"
//                           : "bg-zinc-900 text-white"
//                         : chatTheme === "dark"
//                           ? "bg-zinc-900 text-zinc-100"
//                           : "bg-zinc-100 text-zinc-900"
//                     )}
//                   >
//                     <div className="flex items-baseline justify-between gap-3">
//                       <div
//                         className={cn(
//                           "text-xs font-semibold",
//                           mine ? "opacity-80" : "opacity-70"
//                         )}
//                       >
//                         {m.name}
//                       </div>
//                       <div
//                         className={cn(
//                           "text-[11px]",
//                           mine ? "opacity-70" : "opacity-60"
//                         )}
//                       >
//                         {format(new Date(m.createdAt), "HH:mm")}
//                       </div>
//                     </div>
//                     <div className="mt-1 whitespace-pre-wrap">{m.text}</div>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </AnimatePresence>
//           <div ref={endRef} />
//         </div>
//       </div>

//       <form
//         onSubmit={async (e) => {
//           e.preventDefault();
//           await send(text);
//           setText("");
//         }}
//         className={cn(
//           "flex gap-2 border-t p-4",
//           chatTheme === "dark" ? "border-zinc-800" : "border-zinc-200"
//         )}
//       >
//         <Input
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Write a message..."
//           className={cn(
//             chatTheme === "dark"
//               ? "border-zinc-800 bg-zinc-950 focus:border-zinc-200"
//               : "border-zinc-200 bg-white"
//           )}
//         />
//         <Button type="submit" disabled={sending || !text.trim()}>
//           <Send className="h-4 w-4" />
//           Send
//         </Button>
//       </form>
//     </Card>
//   );
// }

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { Moon, Sun, Trash2, Send, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/cn";

export function ChatPanel() {
  const { messages, send, clear, sending, chatTheme, toggleChatTheme } =
    useChat();
  const { user } = useAuth();
  const [text, setText] = React.useState("");
  const endRef = React.useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = React.useState(false);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  // Simulate typing indicator
  React.useEffect(() => {
    if (text.length > 0) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [text]);

  return (
    <Card
      className={cn(
        "relative flex h-[calc(100dvh-3rem)] flex-col overflow-hidden rounded-3xl border-0 md:h-[calc(100dvh-3rem)]",
        chatTheme === "dark"
          ? "bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 shadow-2xl shadow-zinc-900/50"
          : "bg-gradient-to-br from-white via-zinc-50 to-white text-zinc-900 shadow-2xl shadow-zinc-100/50"
      )}
    >
      {/* Floating decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-40 w-40 animate-pulse rounded-full bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 blur-3xl" />
        <div className="absolute -right-20 -bottom-20 h-40 w-40 animate-pulse rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-3xl [animation-delay:1s]" />
      </div>

      {/* Header with animated gradient */}
      <div
        className={cn(
          "relative flex items-center justify-between border-b p-4 backdrop-blur-sm",
          chatTheme === "dark"
            ? "border-zinc-800/50 bg-zinc-900/50"
            : "border-zinc-200/50 bg-white/50"
        )}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-500" />
            <div className="truncate text-sm font-bold">
              <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                Real-time Chat
              </span>
            </div>
          </div>
          <div
            className={cn(
              "text-xs",
              chatTheme === "dark" ? "text-zinc-400" : "text-zinc-500"
            )}
          >
            {user ? (user.displayName ?? user.email) : "Guest"} •{" "}
            <span className="inline-flex items-center gap-1">
              <Zap className="h-3 w-3 text-cyan-500" />
              Firebase Realtime
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleChatTheme}
            className="group relative overflow-hidden border-0 bg-zinc-900/10 backdrop-blur-sm transition-all hover:scale-105 dark:bg-white/10"
          >
            {chatTheme === "dark" ? (
              <>
                <Sun className="h-4 w-4 transition-transform group-hover:rotate-12" />
                <span className="ml-1">Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 transition-transform group-hover:-rotate-12" />
                <span className="ml-1">Dark</span>
              </>
            )}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => clear()}
            className="group relative overflow-hidden transition-all hover:scale-105"
          >
            <Trash2 className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span className="ml-1">Clear</span>
          </Button>
        </div>
      </div>

      {/* Messages container with scroll effects */}
      <div className="relative flex-1 overflow-y-auto p-4">
        <div className="relative space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((m, index) => {
              const mine = (user?.uid ?? "guest") === m.uid;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 200,
                    delay: index * 0.02,
                  }}
                  className={cn("flex", mine ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "relative max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-lg transition-all md:max-w-[70%]",
                      mine
                        ? chatTheme === "dark"
                          ? "bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white"
                          : "bg-gradient-to-br from-zinc-900 to-zinc-800 text-white"
                        : chatTheme === "dark"
                          ? "bg-gradient-to-br from-zinc-800 to-zinc-700 text-zinc-100"
                          : "bg-gradient-to-br from-zinc-100 to-zinc-50 text-zinc-900"
                    )}
                  >
                    {/* Decorative corner accents */}
                    <div className="absolute -bottom-2 -right-2 h-4 w-4 overflow-hidden rounded-full">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full bg-gradient-to-br opacity-30 blur-sm",
                          mine
                            ? "from-violet-400 to-fuchsia-400"
                            : "from-cyan-400 to-blue-400"
                        )}
                      />
                    </div>

                    <div className="flex items-baseline justify-between gap-3">
                      <div
                        className={cn(
                          "text-xs font-semibold",
                          mine ? "opacity-90" : "opacity-80"
                        )}
                      >
                        {m.name}
                      </div>
                      <div
                        className={cn(
                          "text-[10px]",
                          mine ? "opacity-80" : "opacity-70"
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

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="relative max-w-[85%] rounded-2xl bg-gradient-to-br from-zinc-200 to-zinc-100 px-4 py-3 text-sm shadow-lg dark:from-zinc-800 dark:to-zinc-700">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:0ms] dark:bg-zinc-500" />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:150ms] dark:bg-zinc-500" />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:300ms] dark:bg-zinc-500" />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={endRef} />
        </div>
      </div>

      {/* Input area with animated gradient border */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await send(text);
          setText("");
        }}
        className={cn(
          "relative flex gap-2 border-t p-4 backdrop-blur-sm",
          chatTheme === "dark"
            ? "border-zinc-800/50 bg-zinc-900/50"
            : "border-zinc-200/50 bg-white/50"
        )}
      >
        {/* Animated gradient border */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity",
            text.length > 0 && "opacity-100"
          )}
          style={{
            background:
              chatTheme === "dark"
                ? "linear-gradient(90deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))"
                : "linear-gradient(90deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15))",
            mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMask:
              "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            borderRadius: "1rem",
            border: "1px solid transparent",
            padding: "1px",
          }}
        />

        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message..."
          className={cn(
            "relative z-10 flex-1 border-0 bg-transparent focus:ring-2 focus:ring-violet-500",
            chatTheme === "dark"
              ? "placeholder:text-zinc-400"
              : "placeholder:text-zinc-500"
          )}
        />
        <Button
          type="submit"
          disabled={sending || !text.trim()}
          className={cn(
            "relative z-10 group overflow-hidden transition-all",
            sending || !text.trim()
              ? "opacity-50"
              : "hover:scale-105 hover:shadow-lg hover:shadow-violet-500/20"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative flex items-center gap-1">
            <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            <span>Send</span>
          </div>
        </Button>
      </form>
    </Card>
  );
}
