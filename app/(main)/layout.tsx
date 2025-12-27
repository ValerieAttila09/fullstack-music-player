"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/widgets/AppSidebar";
import React from "react";
import { MusicPlayer } from "@/components/MusicPlayer";
import { useIsMobile } from "@/hooks/use-mobile";
import NavbarMobile from "@/components/widgets/NavbarMobile";

const layout = ({ children }: { children: React.ReactNode }) => {

  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      {isMobile ? (
        <NavbarMobile/>
      ) : (
        <AppSidebar />
      )}
      <main className="min-h-screen w-full relative">
        <div className={`${isMobile ? "pt-14" : ""} pb-32 relative overflow-hidden`}>
          {children}
        </div>
        <MusicPlayer />
      </main>
    </SidebarProvider>
  );
}

export default layout;