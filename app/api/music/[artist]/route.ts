// app/api/music/[artist]/route.ts
import type { NextRequest } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { artist: string } }
) {
  try {
    const artist = params.artist ?? "coldplay";

    const res = await fetch(
      `https://www.theaudiodb.com/api/v1/json/123/search.php?s=${encodeURIComponent(
        artist
      )}`
    );

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: true, message: "External API error" }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }

    const data = await res.json();
    return new Response(JSON.stringify({ error: false, data }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: true }), { status: 500 });
  }
}