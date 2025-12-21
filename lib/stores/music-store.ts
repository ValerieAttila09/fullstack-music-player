import { MusicState } from '@/types/interfaces';
import { create } from 'zustand';

export const useMusicStore = create<MusicState>((set) => ({
  songs: [],
  currentSong: null,
  isPlaying: false,
  volume: 1,
  currentTime: 0,
  setSongs: (songs) => set({ songs }),
  addSong: (song) => set((state) => ({ songs: [...state.songs, song] })),
  removeSong: (id) => set((state) => ({
    songs: state.songs.filter(song => song.id !== id)
  })),
  setCurrentSong: (song) => set({ currentSong: song }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (time) => set({ currentTime: time }),
}));