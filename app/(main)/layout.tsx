import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/widgets/AppSidebar";
import StudioNavbar from "@/components/widgets/StudioNavbar";
import React from "react";
import { MusicPlayer } from "@/components/MusicPlayer";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="min-h-screen w-full">
        <StudioNavbar />
        <div className="pb-32 relative overflow-hidden">
          {children}
        </div>
        <MusicPlayer />
      </main> 
    </SidebarProvider>
  );
}

export default layout;