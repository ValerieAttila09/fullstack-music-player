'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/utils/supabase/supabase.client';
import { useAuthStore } from '@/lib/stores/auth-store';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListMusic, Trash2 } from 'lucide-react';
import { CreatePlaylistDrawer } from '@/components/widgets/CreatePlaylistDrawer';
import { Playlist } from '@/types/interfaces';

export default function PlaylistsPage() {
  const supabase = createClient();
  const { user } = useAuthStore();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

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
      setPlaylists(data as any);
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
              <Card key={playlist.id} className="group relative">
                <CardHeader>
                  <CardTitle className="truncate">{playlist.name}</CardTitle>
                  {/* Removed CardDescription */}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className='flex items-center'>
                        <ListMusic className="w-4 h-4 mr-2"/>
                        <span>0 songs</span> { /* Placeholder */}
                    </div>
                    <Button 
                        variant='ghost' 
                        size='icon' 
                        className='opacity-0 group-hover:opacity-100 transition-opacity' 
                        onClick={() => handleDeletePlaylist(playlist.id)} >
                        <Trash2 className='w-4 h-4'/>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
