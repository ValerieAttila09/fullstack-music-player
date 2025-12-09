"use client";

import { useEffect, useState } from "react";

const Studio = () => {
  const [musicData, setMusicData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleGetMusics = async () => {
    try {
      const artist = "Coldplay";
      const res = await fetch(`/api/music/${encodeURIComponent(artist)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setMusicData(json);
      console.log("fetched data:", json);
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error)?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetMusics();
  }, []);

  if (loading) return <div>Loading musics…</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Studio</h1>
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(musicData, null, 2)}
      </pre>
    </div>
  );
};

export default Studio;