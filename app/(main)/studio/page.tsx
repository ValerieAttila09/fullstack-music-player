'use client';

import { useEffect, useState, useCallback } from 'react';
import { HeartIcon } from "lucide-react";
import { createClient } from '@/lib/utils/supabase/supabase.client';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Song } from '@/types/interfaces';
import Image from 'next/image';

const Studio = () => {
  const supabase = createClient();
  const { user } = useAuthStore();
  const [topSongs, setTopSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTopSongs = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get top 10 songs by play count for the user
      const { data: historyData, error } = await supabase
        .from('listening_history')
        .select(`
          song_id,
          songs (
            id,
            title,
            artist,
            audio_url,
            cover_url,
            duration,
            uploaded_by,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .order('played_at', { ascending: false });

      if (error) throw error;

      // Count plays per song
      const songCounts: { [key: string]: { song: any; count: number } } = {};
      historyData.forEach((item: any) => {
        if (item.songs) {
          const songId = item.song_id;
          if (songCounts[songId]) {
            songCounts[songId].count += 1;
          } else {
            songCounts[songId] = { song: item.songs, count: 1 };
          }
        }
      });

      // Sort by count descending and take top 10
      const sortedSongs = Object.values(songCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
        .map((item: any) => {
          const song = item.song;
          return {
            id: song.id,
            title: song.title,
            artist: song.artist,
            audioUrl: song.audio_url,
            coverUrl: song.cover_url,
            duration: song.duration,
            uploadedBy: song.uploaded_by,
            createdAt: song.created_at,
          };
        });

      // Get signed URLs for covers
      const songsWithSignedUrls = await Promise.all(
        sortedSongs.map(async (song) => {
          console.log('Processing top song:', song.title, 'Cover URL:', song.coverUrl);

          let signedCoverUrl: string | null = null;
          if (song.coverUrl) {
            const { data, error } = await supabase.storage.from('cover').createSignedUrl(song.coverUrl, 3600);
            console.log('Cover signed URL result:', data, 'Error:', error);
            signedCoverUrl = data?.signedUrl || null;
          }
          return { ...song, coverUrl: signedCoverUrl };
        })
      );

      setTopSongs(songsWithSignedUrls);
    } catch (error) {
      console.error('Error loading top songs:', error);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (user) {
      loadTopSongs();
    }
  }, [user, loadTopSongs]);

  return (
    <main className="w-full h-full">
      <section className="w-full flex flex-col md:flex-row">
        {/* Recently Listened Section */}
        <div className="w-full md:grow p-4 sm:p-6 space-y-4">
          <h1 className="text-3xl md:text-4xl font-medium text-neutral-900">
            Your Top Songs
          </h1>
          {loading ? (
            <p>Loading...</p>
          ) : topSongs.length === 0 ? (
            <p>No songs listened yet. Start playing some music!</p>
          ) : (
            <div className="w-full grid gap-4">
              {topSongs.map((song, i) => (
                <div key={song.id} className="w-full flex items-center gap-3 p-2 hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center justify-center w-8">
                    <h1 className="text-lg text-neutral-500 font-medium">
                      {i + 1}
                    </h1>
                  </div>
                  <div className="w-12 h-12 bg-neutral-200 overflow-hidden relative">
                    {song.coverUrl ? (
                      <Image
                        src={song.coverUrl}
                        alt={song.title}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-md md:text-lg font-medium text-neutral-800 truncate">
                      {song.title}
                    </h1>
                    <h3 className="text-sm text-neutral-600 font-regular truncate">
                      {song.artist}
                    </h3>
                  </div>
                  {/* Genre hidden on smaller screens */}
                  <div className="hidden lg:flex items-center justify-start flex-1">
                    <h1 className="text-md text-neutral-600 font-regular">
                      {/* Genre could be added later */}
                    </h1>
                  </div>
                  <div className="w-16 text-center text-neutral-600">
                    {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                  </div>
                  <div>
                    <div className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-neutral-200 cursor-pointer">
                      <HeartIcon className="w-5 h-5 text-neutral-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Studio;
