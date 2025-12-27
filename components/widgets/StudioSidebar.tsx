'use client';

import Link from "next/link";
import { Music, Mic2, Heart, ListMusic, Home } from "lucide-react";
import { usePathname } from "next/navigation"; // 1. Import usePathname

const navLinks = [
  {
    name: "Home",
    href: "/",
    icon: Home
  },
  {
    name: "Songs",
    href: "/songs",
    icon: Music
  },
  {
    name: "Artists",
    href: "/artists",
    icon: Mic2
  },
  {
    name: "Favorites",
    href: "/favorites",
    icon: Heart
  },
  {
    name: "Playlists",
    href: "/playlists",
    icon: ListMusic
  }
];

export function StudioSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-neutral-900 text-white p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">My Studio</h2>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 p-3 rounded-md transition-colors ${ 
                    isActive 
                      ? "bg-neutral-800 text-white"
                      : "hover:bg-neutral-700"
                  }`}>
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
