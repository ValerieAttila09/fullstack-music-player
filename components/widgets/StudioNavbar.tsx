'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/auth-store";
import { createClient } from "@/lib/utils/supabase/supabase.client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "../ui/input";


export default function StudioNavbar() {
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
    <>
      <Drawer direction="right">
        <header className="fixed top-0 z-5 w-full bg-white/20 backdrop-blur-xs inset-x-0 flex items-center justify-end p-4 border-b border-accent">
          <div className="flex items-center justify-end gap-4">
            <DrawerTrigger className="flex items-center gap-2 cursor-pointer">
              <Avatar>
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-white text-md font-medium">{user?.fullName}</span>
            </DrawerTrigger>
          </div>
        </header>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{user?.fullName || 'User Profile'}</DrawerTitle>
            <DrawerDescription>{user?.email}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button onClick={handleSignOut} variant='outline'>Sign Out</Button>
            <DrawerClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}