"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Play, Pause, Upload } from "lucide-react";
import { useMusicStore } from "@/lib/stores/music-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { supabase } from "@/lib/utils/supabase/supabase.server";
import { UploadMusic } from "@/components/UploadMusic";
import { toast } from "sonner";
import Image from "next/image";

export default function SongsPage() {
  const [showUpload, setShowUpload] = useState(false);
  const { songs, setSongs, removeSong, setCurrentSong, setIsPlaying, currentSong, isPlaying } = useMusicStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      loadSongs();
    }
  }, [user]);

  const loadSongs = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq('uploaded_by', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setSongs(data);
  };

  const handleDeleteSong = async (songId: string) => {
    try {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', songId);

      if (error) throw error;

      removeSong(songId);
      toast.success("Song deleted!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete song");
    }
  };

  const handlePlaySong = (song: typeof songs[number]) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Songs</h1>
          <p className="text-muted-foreground">Manage your music collection</p>
        </div>
        <Button onClick={() => setShowUpload(!showUpload)}>
          <Upload className="w-4 h-4 mr-2" />
          {showUpload ? "Hide Upload" : "Upload Music"}
        </Button>
      </div>

      {showUpload && (
        <UploadMusic onUploadComplete={loadSongs} />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {songs.map((song) => (
          <Card key={song.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="relative">
                  {song.coverUrl ? (
                    <Image
                      src={song.coverUrl}
                      alt={song.title}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                      <span className="text-2xl">🎵</span>
                    </div>
                  )}
                  <Button
                    size="sm"
                    className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handlePlaySong(song)}
                  >
                    {currentSong?.id === song.id && isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </Button>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{song.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSong(song.id)}
                      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {songs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-xl font-semibold mb-2">No songs yet</h3>
          <p className="text-muted-foreground mb-4">
            Upload your first song to get started
          </p>
          <Button onClick={() => setShowUpload(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Music
          </Button>
        </div>
      )}
    </div>
  );
}