import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "10");

  const url = new URL("https://jsonplaceholder.typicode.com/posts");
  url.searchParams.set("_page", String(page));
  url.searchParams.set("_limit", String(limit));

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok)
    return NextResponse.json({ items: [], total: 0 }, { status: 502 });

  const total = Number(res.headers.get("x-total-count") ?? "0");
  const items = await res.json();

  return NextResponse.json({ items, total });
}
