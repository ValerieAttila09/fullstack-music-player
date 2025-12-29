import { create } from 'zustand';
import { MusicStore, Playlist, Song } from '@/types/interfaces';
import { createClient } from '@/lib/utils/supabase/supabase.client';
import { useAuthStore } from './auth-store';

const supabase = createClient();

export const useMusicStore = create<MusicStore>((set, get) => ({
  songs: [],
  playlists: [],
  currentSong: null,
  isPlaying: false,
  volume: 1,
  currentTime: 0,

  // Song-related actions
  setSongs: (songs: Song[]) => set({ songs }),
  addSong: (song: Song) => set((state) => ({ songs: [...state.songs, song] })),
  updateSong: (updatedSong: Song) => set((state) => ({
    songs: state.songs.map(song => song.id === updatedSong.id ? updatedSong : song)
  })),
  removeSong: (songId: string) => set((state) => ({
    songs: state.songs.filter(song => song.id !== songId)
  })),

  // Playlist-related actions
  setPlaylists: (playlists: Playlist[]) => set({ playlists }),
  addPlaylist: (playlist: Playlist) => set((state) => ({
    playlists: [...state.playlists, playlist]
  })),
  removePlaylist: (playlistId: string) => set((state) => ({
    playlists: state.playlists.filter(p => p.id !== playlistId)
  })),
  addSongToPlaylist: (playlistId: string, song: Song) => set((state) => ({
    playlists: state.playlists.map(p =>
      p.id === playlistId ? { ...p, songs: [...p.songs, song] } : p
    ),
  })),
  removeSongFromPlaylist: (playlistId: string, songId: string) => set((state) => ({
    playlists: state.playlists.map(p =>
      p.id === playlistId ? { ...p, songs: p.songs.filter(s => s.id !== songId) } : p
    ),
  })),

  // Playback control actions
  setCurrentSong: (song: Song | null) => {
    set({ currentSong: song });
    if (song) {
      // Track play when song is set
      const user = useAuthStore.getState().user;
      if (user) {
        // Fire-and-forget - don't block UI
        supabase.from('listening_history').insert({
          user_id: user.id,
          song_id: song.id,
        }).then(null, (error) => console.error('Error tracking play:', error));
      }
    }
  },
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  setVolume: (volume: number) => set({ volume }),
  setCurrentTime: (time: number) => set({ currentTime: time }),
}));