import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users", {
    next: { revalidate: 300 },
  });
  if (!res.ok) return NextResponse.json({ items: [] }, { status: 502 });
  const items = await res.json();
  return NextResponse.json({ items });
}
