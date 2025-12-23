'use client';

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { CreatePlaylistForm } from "@/components/CreatePlaylistForm";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

interface CreatePlaylistDrawerProps {
    onCreateComplete?: () => void;
}

export function CreatePlaylistDrawer({ onCreateComplete }: CreatePlaylistDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleCreateComplete = () => {
    setOpen(false); // Close the drawer/sheet on completion
    onCreateComplete?.();
  };

  const title = "Create a new playlist";

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Playlist
          </Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-md p-0">
          <SheetHeader className="p-6">
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          <div className="p-6 border-t">
            <CreatePlaylistForm onCreateComplete={handleCreateComplete} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Playlist
          </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <CreatePlaylistForm onCreateComplete={handleCreateComplete} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
