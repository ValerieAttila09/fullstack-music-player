export interface Song {
	id: string;
	title: string;
	artist: string;
	audioUrl: string;
	duration: number;
	coverUrl?: string;
	uploadedBy?: string;
	createdAt: Date;
}

export interface MusicState {
	songs: Song[];
	currentSong: Song | null;
	isPlaying: boolean;
	volume: number;
	currentTime: number;
	setSongs: (songs: Song[]) => void;
	addSong: (song: Song) => void;
	removeSong: (id: string) => void;
	setCurrentSong: (song: Song | null) => void;
	setIsPlaying: (playing: boolean) => void;
	setVolume: (volume: number) => void;
	setCurrentTime: (time: number) => void;
}

export interface Playlist {
	id: string;
	name: string;
	userId: string;
	createdAt: Date;
	songs?: Song[];
}

export interface Song {
	id: string;
	title: string;
	artist: string;
	audioUrl: string;
	duration: number;
	coverUrl?: string;
}

export interface PlaylistState {
	playlists: Playlist[];
	currentPlaylist: Playlist | null;
	setPlaylists: (playlists: Playlist[]) => void;
	addPlaylist: (playlist: Playlist) => void;
	removePlaylist: (id: string) => void;
	setCurrentPlaylist: (playlist: Playlist | null) => void;
	addSongToPlaylist: (playlistId: string, song: Song) => void;
	removeSongFromPlaylist: (playlistId: string, songId: string) => void;
}

export interface User {
	id: string;
	email: string;
	fullName?: string;
	avatarUrl?: string;
}

export interface AuthState {
	user: User | null;
	isLoading: boolean;
	setUser: (user: User | null) => void;
	setLoading: (loading: boolean) => void;
	logout: () => void;
	initialize: () => void;
}

export interface UploadMusicProps {
  onUploadComplete?: () => void;
}