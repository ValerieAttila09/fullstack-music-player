declare global {
  type Song = {
    id: string;
    title: string;
    artist: string;
    audio_url: string;
    duration: number;
    cover_url: string;
    created_at: Date;
  }

  type Playlist = {
    id: string;
    user_id: string;
    created_at: Date;
  }

  type PlaylistSong = {
    playlist_id: string;
    song_id: string;
    created_at: Date;
  }

  type BannerIcons = {
    position: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  }

  type StudioSidebarMenu = {
    title: string;
    url: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  }

  type ResponseData = {
    error: boolean;
    message: string
  }
};

export { };