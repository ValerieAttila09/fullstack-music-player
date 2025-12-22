"use client";

import { Search, User2, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { SidebarTrigger } from "../ui/sidebar";
import { useAuthStore } from "@/lib/stores/auth-store";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const StudioNavbar = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    logout();
    router.push("/sign-in");
  };

  return (
    <div className="w-full p-2 flex items-center justify-between border-b border-b-neutral-200">
      <SidebarTrigger variant={'outline'} size={'icon-sm'} />
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={'outline'} size={'icon-sm'}>
              <Search className="w-5 h-5 text-neutral-800" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="min-w-sm me-2">
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <div className="">
                <h3 className="text-lg font-medium text-neutrl-800">Search</h3>
                <p className="text-sm text-neutral-600">Search something you want to see or listen.</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  aria-label="Search songs, artists, playlists"
                  placeholder="Search music..."
                  className="h-9 w-full rounded-md border px-3 text-sm outline-none placeholder:text-muted-foreground/60"
                />
                <Button
                  variant={'outline'}
                  className=""
                >
                  <Search className="w-6 h-6 text-neutral-600" />
                </Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={'outline'} size={'icon-sm'}>
              <User2 className="w-5 h-5 text-neutral-800" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              <div className="px-2 py-1">
                <p className="text-sm font-medium">{user?.fullName || user?.email}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default StudioNavbar;