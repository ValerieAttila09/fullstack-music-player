import { PlaylistState } from '@/types/interfaces';
import { create } from 'zustand';

export const usePlaylistStore = create<PlaylistState>((set) => ({
  playlists: [],
  currentPlaylist: null,
  setPlaylists: (playlists) => set({ playlists }),
  addPlaylist: (playlist) => set((state) => ({ playlists: [...state.playlists, playlist] })),
  removePlaylist: (id) => set((state) => ({
    playlists: state.playlists.filter(p => p.id !== id)
  })),
  setCurrentPlaylist: (playlist) => set({ currentPlaylist: playlist }),
  addSongToPlaylist: (playlistId, song) => set((state) => ({
    playlists: state.playlists.map(p =>
      p.id === playlistId
        ? { ...p, songs: [...(p.songs || []), song] }
        : p
    )
  })),
  removeSongFromPlaylist: (playlistId, songId) => set((state) => ({
    playlists: state.playlists.map(p =>
      p.id === playlistId
        ? { ...p, songs: (p.songs || []).filter(s => s.id !== songId) }
        : p
    )
  })),
}));