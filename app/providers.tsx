"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";
import { CallProvider } from "@/context/CallContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <ChatProvider>
          <CallProvider>{children}</CallProvider>
        </ChatProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
