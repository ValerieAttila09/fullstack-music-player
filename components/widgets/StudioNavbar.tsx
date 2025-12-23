'use client';

import { useAuthStore } from "@/lib/stores/auth-store";
import { Button } from "@/components/ui/button";

import { Search, LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation"; // 1. Import usePathname
import { SidebarTrigger } from "../ui/sidebar";

export function StudioNavbar() {
  const router = useRouter();
  const pathname = usePathname(); // 2. Dapatkan pathname
  const { user, logout } = useAuthStore();

  // 3. Logika untuk mendapatkan nama halaman
  const pathSegments = pathname.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1] || 'studio';
  const currentPage = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);

  const handleLogout = () => {
    logout();
    router.push("/sign-in");
  };

  return (
    <div className="w-full p-2 flex items-center justify-between border-b border-b-neutral-200">
      <div className="flex items-center justify-start gap-2">
        <SidebarTrigger variant={'outline'} size={'lg'} />
        <div className="w-px mx-2 h-10 bg-neutral-200" />
        <div className="flex items-center justify-start">
          <span className="text-md space-x-2 font-regular text-neutral-500">
            <span>MENU</span>
            <span>/</span>
            <span className="text-neutral-800 font-medium">{currentPage}</span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex">
          <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
            <div className="flex items-center gap-2">
              <input
                aria-label="Search songs, artists, playlists"
                placeholder="Search music..."
                className="h-10 w-100 border px-3 text-sm outline-none placeholder:text-muted-foreground/60"
              />
              <Button
                variant={'outline'}
                size={'icon-lg'}
              >
                <Search className="w-7 h-7 text-neutral-600" />
              </Button>
            </div>
          </form>
        </div>
        
        <div className="w-px h-10 bg-neutral-200" />
        <Button
          variant={'outline'}
          size={'icon-lg'}
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
