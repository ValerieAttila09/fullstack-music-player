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
import { Upload } from "lucide-react";
import { UploadMusic } from "@/components/UploadMusic";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { UploadMusicProps } from "@/types/interfaces";

export function UploadMusicDrawer({ onUploadComplete }: UploadMusicProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleUploadComplete = () => {
    setOpen(false); // Close the drawer/sheet on completion
    onUploadComplete?.();
  };

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload Music
          </Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-md p-0">
          <SheetHeader className="p-6">
            <SheetTitle>Upload Music</SheetTitle>
          </SheetHeader>
          <div className="p-6 border-t">
            <UploadMusic onUploadComplete={handleUploadComplete} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          Upload Music
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Upload Music</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <UploadMusic onUploadComplete={handleUploadComplete} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
