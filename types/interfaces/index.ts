import { ReactNode } from "react";

export interface Song {
	id: string;
	title: string;
	artist: string;
	duration: number;
	audioUrl: string;
	coverUrl: string | null;
	uploadedBy: string;
	createdAt: string;
}

export interface Playlist {
	id: string;
	name: string;
	songs: Song[];
}

export interface MusicStore {
	songs: Song[];
	playlists: Playlist[];
	currentSong: Song | null;
	isPlaying: boolean;
	volume: number;
	currentTime: number;

	setSongs: (songs: Song[]) => void;
	addSong: (song: Song) => void;
	updateSong: (song: Song) => void;
	removeSong: (songId: string) => void;

	setPlaylists: (playlists: Playlist[]) => void;
	addPlaylist: (playlist: Playlist) => void;
	removePlaylist: (playlistId: string) => void;

	setCurrentSong: (song: Song | null) => void;
	setIsPlaying: (isPlaying: boolean) => void;
	setVolume: (volume: number) => void;
	setCurrentTime: (time: number) => void;

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
	clearAuth: () => void;
	logout: () => Promise<void>;
	initialize: () => void;
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

export interface UploadMusicProps {
	onUploadComplete?: () => void;
}

export interface EditMusicProps {
	onEditMusicComplete?: () => void;
}

export interface FeatureCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
}

export interface StepProps {
	number: string | number;
	title: string;
}

export interface LoadPlaylistToDropdown {
	id: string;
	name: string;
	user_id: string;
}

export type ButtonProps<T extends React.ElementType> = {
	as?: T;
	variant: 'primary' | 'secondary' | 'dark';
	size: 'lg' | 'md';
	className?: string;
	children: ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'variant' | 'size' | 'className' | 'children'>;

export interface EditSongProps {
	song: Song | null;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onEditComplete?: () => void;
}

export interface EditPlaylistProps {
	playlist: Playlist | null;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onEditComplete?: () => void;
}