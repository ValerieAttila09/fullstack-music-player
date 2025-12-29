import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createClient } from '@/lib/utils/supabase/supabase.client';
import { useAuthStore } from '@/lib/stores/auth-store';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { EditPlaylistProps } from '@/types/interfaces';

const EditPlaylist = ({ playlist, isOpen, onOpenChange, onEditComplete }: EditPlaylistProps) => {
  const supabase = createClient();
  const { user } = useAuthStore();
  const [name, setName] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    if (playlist) {
      setName(playlist.name);
    }
  }, [playlist]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!playlist || !name.trim() || !user) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('playlists')
        .update({ name })
        .eq('id', playlist.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success("Playlist updated successfully!");
      onOpenChange(false);
      onEditComplete?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update playlist");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Drawer direction={'right'} open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Edit Playlist</DrawerTitle>
          </DrawerHeader>
          <Separator className='my-2' />
          <form onSubmit={handleSubmit}>
            <div className="p-4 pb-0 space-y-2">
              <div className="space-y-2">
                <Label htmlFor="name">Playlist Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <DrawerFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default EditPlaylist;