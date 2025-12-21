"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Music } from "lucide-react";
import { usePlaylistStore } from "@/lib/stores/playlist-store";
import { useMusicStore } from "@/lib/stores/music-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { createClient } from "@/lib/utils/supabase/supabase.client";
import { toast } from "sonner";

export function PlaylistManager() {
  const supabase = createClient();
  
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

  const { playlists, addPlaylist, removePlaylist, addSongToPlaylist, removeSongFromPlaylist } = usePlaylistStore();
  const { songs } = useMusicStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      loadPlaylists();
    }
  }, [user]);

  const loadPlaylists = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('playlists')
      .select(`
        *,
        playlist_songs (
          songs (*)
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error(error);
      return;
    }

    // Transform data
    const transformedPlaylists = data.map(playlist => ({
      ...playlist,
      songs: playlist.playlist_songs?.map((ps: any) => ps.songs) || []
    }));

    // Update store - you'll need to implement setPlaylists in your store
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim() || !user) return;

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('playlists')
        .insert({
          name: newPlaylistName,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      addPlaylist(data);
      setNewPlaylistName("");
      toast.success("Playlist created!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create playlist");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    try {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', playlistId);

      if (error) throw error;

      removePlaylist(playlistId);
      toast.success("Playlist deleted!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete playlist");
    }
  };

  const handleAddSongToPlaylist = async (playlistId: string, songId: string) => {
    try {
      const { error } = await supabase
        .from('playlist_songs')
        .insert({
          playlist_id: playlistId,
          song_id: songId,
        });

      if (error) throw error;

      const song = songs.find(s => s.id === songId);
      if (song) {
        addSongToPlaylist(playlistId, song);
        toast.success("Song added to playlist!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add song to playlist");
    }
  };

  const handleRemoveSongFromPlaylist = async (playlistId: string, songId: string) => {
    try {
      const { error } = await supabase
        .from('playlist_songs')
        .delete()
        .eq('playlist_id', playlistId)
        .eq('song_id', songId);

      if (error) throw error;

      removeSongFromPlaylist(playlistId, songId);
      toast.success("Song removed from playlist!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove song from playlist");
    }
  };

  return (
    <div className="space-y-4">
      {/* Create Playlist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Playlist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
            />
            <Button onClick={handleCreatePlaylist} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Playlists List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {playlists.map((playlist) => (
          <Card key={playlist.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {playlist.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeletePlaylist(playlist.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  {playlist.songs?.length || 0} songs
                </p>

                {/* Add Song Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Song
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Song to {playlist.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {songs.map((song) => (
                        <Button
                          key={song.id}
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => handleAddSongToPlaylist(playlist.id, song.id)}
                        >
                          <Music className="w-4 h-4 mr-2" />
                          {song.title} - {song.artist}
                        </Button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Playlist Songs */}
                <div className="space-y-1">
                  {playlist.songs?.slice(0, 3).map((song: any) => (
                    <div key={song.id} className="flex items-center justify-between text-sm">
                      <span className="truncate">{song.title}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSongFromPlaylist(playlist.id, song.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  {playlist.songs && playlist.songs.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{playlist.songs.length - 3} more songs
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}