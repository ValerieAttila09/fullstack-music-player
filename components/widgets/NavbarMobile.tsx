'use client';

import { SidebarTrigger } from "../ui/sidebar";
import { useAuthStore } from "@/lib/stores/auth-store";
import { createClient } from "@/lib/utils/supabase/supabase.client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

const NavbarMobile = () => {

  const { user, clearAuth } = useAuthStore();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
      return;
    }

    clearAuth();
    router.push('/sign-in');
    toast.success("Signed out successfully");
  }

  return (
    <div className="bg-background fixed top-0 w-full z-50 p-2 border-b border-accent">
      <div className="w-full flex items-center justify-between">
        <SidebarTrigger />
        <Link href={'/profile'} className="flex items-center gap-1">
          <Avatar>
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-foreground text-md font-medium">{user?.fullName}</span>

        </Link>
      </div>
    </div>
  );
}

export default NavbarMobile