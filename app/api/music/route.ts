// app/api/music/route.ts
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const qArtist = url.searchParams.get("artist");
    const artist = (qArtist && qArtist.trim()) || "coldplay";

    const externalUrl = `https://www.theaudiodb.com/api/v1/json/123/search.php?s=${encodeURIComponent(
      artist
    )}`;
    console.log("[api/music] fetching external URL:", externalUrl, "artist:", artist);
    const res = await fetch(externalUrl);

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