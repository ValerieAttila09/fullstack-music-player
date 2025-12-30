'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/utils/supabase/supabase.client';
import { useAuthStore } from '@/lib/stores/auth-store';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, InfoIcon, ListMusic, LucideEdit, Trash2 } from 'lucide-react';
import { CreatePlaylistDrawer } from '@/components/widgets/CreatePlaylistDrawer';
import { Playlist } from '@/types/interfaces';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import EditPlaylist from '@/components/widgets/EditPlaylist';

export default function PlaylistsPage() {
  const supabase = createClient();
  const { user } = useAuthStore();
  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  const loadPlaylists = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching playlists:', error);
      toast.error('Failed to load playlists.');
    } else {
      setPlaylists(data.map(p => ({ ...p, songs: [] })));
    }
    setLoading(false);
  }, [user, supabase]);

  useEffect(() => {
    if (user) {
      loadPlaylists();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDeletePlaylist = async (playlistId: string) => {
    const { error } = await supabase.from('playlists').delete().eq('id', playlistId);

    if (error) {
      toast.error('Failed to delete playlist.');
    } else {
      toast.success('Playlist deleted.');
      setPlaylists(playlists.filter(p => p.id !== playlistId));
    }
    setIsDeleteDialogOpen(false);
    setSelectedPlaylistId(null);
  };

  const openDeleteDialog = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
    setIsDeleteDialogOpen(true);
  };

  const openEditDrawer = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setIsEditDrawerOpen(true);
  };

  return (
    <section className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Playlists</h1>
            <p className="text-muted-foreground">Organize your favorite music</p>
          </div>
          <CreatePlaylistDrawer onCreateComplete={loadPlaylists} />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : playlists.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed">
            <div className="text-6xl mb-4">🎧</div>
            <h3 className="text-xl font-semibold mb-2">No Playlists Created Yet</h3>
            <p className="text-muted-foreground mb-4">Create your first playlist to organize your songs.</p>
            <CreatePlaylistDrawer onCreateComplete={loadPlaylists} />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {playlists.map((playlist) => (
              <Card
                key={playlist.id}
                className="group relative hover:shadow-lg transition-all cursor-pointer"
                onClick={() => router.push(`/playlists/${playlist.id}`)}
              >
                <CardHeader>
                  <CardTitle className="truncate">{playlist.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className='flex items-center'>
                      <ListMusic className="w-4 h-4 mr-2" />
                      <span>{playlist.songs.length} songs</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="outline-none cursor-pointer border shadow-xs flex items-center justify-center hover:bg-accent transition-all size-8"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <EllipsisIcon className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel className="flex items-center gap-1">
                          <span className="">{playlist.name}</span> <div className="mx-1 w-px h-5 bg-neutral-300"></div> <span className="font-normal">Playlist configuration</span>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                          <span className="">
                            Detail
                          </span>
                          <DropdownMenuShortcut>
                            <InfoIcon className="w-4 h-4" />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => openEditDrawer(playlist)}
                        >
                          <span className="">
                            Edit playlist
                          </span>
                          <DropdownMenuShortcut>
                            <LucideEdit className="w-4 h-4" />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(playlist.id)}
                          className="cursor-pointer group-hover:text-red-600"
                        >
                          <span className="">
                            Delete playlist
                          </span>
                          <DropdownMenuShortcut>
                            <Trash2 className="w-4 h-4" />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure to delete {playlists.find(p => p.id === selectedPlaylistId)?.name} playlist?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your playlist and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="hover:bg-red-700 transition-all"
              onClick={() => selectedPlaylistId && handleDeletePlaylist(selectedPlaylistId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <EditPlaylist
        playlist={selectedPlaylist}
        isOpen={isEditDrawerOpen}
        onOpenChange={setIsEditDrawerOpen}
        onEditComplete={loadPlaylists}
      />
    </section>
  );
}
