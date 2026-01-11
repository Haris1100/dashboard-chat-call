import type { ExternalPost, ExternalUser } from "./types";

export async function fetchPosts(page: number, limit: number) {
  const res = await fetch(`/api/posts?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to load posts");
  return (await res.json()) as { items: ExternalPost[]; total: number };
}

export async function fetchUsers() {
  const res = await fetch(`/api/users`);
  if (!res.ok) throw new Error("Failed to load users");
  return (await res.json()) as { items: ExternalUser[] };
}
