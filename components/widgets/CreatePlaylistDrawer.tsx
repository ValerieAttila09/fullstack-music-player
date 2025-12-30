'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from '@/lib/utils/supabase/supabase.client';
import { useAuthStore } from '@/lib/stores/auth-store';
import { toast } from 'sonner';
import { Separator } from '../ui/separator';

export function CreatePlaylistDrawer({
  isOpen,
  onOpenChange,
  onCreateComplete
}: {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreateComplete: () => void;
}) {
  const supabase = createClient();
  const { user } = useAuthStore();
  const [playlistName, setPlaylistName] = useState('');
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Use external control if provided, otherwise use internal state
  const controlledOpen = isOpen !== undefined ? isOpen : internalIsOpen;
  const setControlledOpen = onOpenChange || setInternalIsOpen;

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim() || !user) return;

    const { error } = await supabase
      .from('playlists')
      .insert({
        name: playlistName,
        user_id: user.id
      });

    if (error) {
      console.error("Error creating playlist:", error);
      toast.error('Failed to create playlist.');
    } else {
      toast.success('Playlist created successfully!');
      setPlaylistName('');
      onCreateComplete();
      setControlledOpen(false);
    }
  };

  return (
    <Drawer direction={'right'} open={controlledOpen} onOpenChange={setControlledOpen}>
      {isOpen === undefined && (
        <DrawerTrigger asChild>
          <Button>+ New Playlist</Button>
        </DrawerTrigger>
      )}
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Create a New Playlist</DrawerTitle>
          </DrawerHeader>
          <Separator className='my-2' />
          <div className="p-4 pb-0">
            <div className="space-y-2">
              <Label htmlFor="name">Playlist Name</Label>
              <Input
                id="name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
              />
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleCreatePlaylist}>Create Playlist</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
