import { Cog, Folder, Grid, Grid2X2, Heart, Home, HomeIcon, ListMusic, ListMusicIcon, Mic2, Music, Music2, Music3, Music4 } from "lucide-react";

export const NavbarMenu = [
  { label: "Home", href: "/home" },
  { label: "Studio", href: "/studio" },
  { label: "Create", href: "/create" },
  { label: "Contact", href: "/contact" },
  { label: "Learn & Support", href: "/learn-support" }
];

export const BannerIcons: BannerIcons[] = [
  { position: "top-10 right-16", icon: Music },
  { position: "top-24 right-32", icon: Music2 },
  { position: "bottom-26 right-21", icon: Music3 },
  { position: "top-43 right-18", icon: Music4 },
];

export const StudioSidebarMenu: StudioSidebarMenu[] = [
  { title: "Studio", url: "/studio", icon: HomeIcon },
  { title: "Songs", url: "/songs", icon: Music },
  { title: "Playlists", url: "/playlists", icon: Folder },
  { title: "Settings", url: "/settings", icon: Cog },
];

export const VisibilityButton: VisibilityButton[] = [
  { tooltipLabel: "Change musics display to list", icon: ListMusicIcon },
  { tooltipLabel: "Change musics display to 3x3 grid", icon: Grid },
  { tooltipLabel: "Change musics display to 2x2 grid", icon: Grid2X2 },
]

export const navLinks: SidebarMenuLinks[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "Songs", href: "/songs", icon: Music },
  { name: "Artists", href: "/artists", icon: Mic2 },
  { name: "Favorites", href: "/favorites", icon: Heart },
  { name: "Playlists", href: "/playlists", icon: ListMusic }
];