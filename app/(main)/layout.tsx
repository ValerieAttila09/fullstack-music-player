"use client";

import React, { useEffect } from "react";
import { MusicPlayer } from "@/components/MusicPlayer";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/widgets/AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import NavbarMobile from "@/components/widgets/NavbarMobile";
import { useAuthStore } from "@/lib/stores/auth-store";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <AppSidebar />
      {isMobile && <NavbarMobile />}
      <SidebarInset>
        <main className="min-h-screen w-full relative">
          <div className={`${isMobile ? "pt-14" : ""} pb-32 relative overflow-hidden`}>
            {children}
          </div>
          <MusicPlayer />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Layout;