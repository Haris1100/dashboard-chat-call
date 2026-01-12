import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Dashboard Chat Call",
  description: "Dashboard, real-time chat, and call simulation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100"
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
