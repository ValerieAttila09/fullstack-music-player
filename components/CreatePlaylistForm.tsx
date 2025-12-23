'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from '@/lib/stores/auth-store';
import { createClient } from '@/lib/utils/supabase/supabase.client';
import { toast } from 'sonner';

interface CreatePlaylistFormProps {
  onCreateComplete?: () => void;
}

export function CreatePlaylistForm({ onCreateComplete }: CreatePlaylistFormProps) {
  const supabase = createClient();
  const { user } = useAuthStore();
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistName.trim() || !user) {
      toast.error('Playlist name is required.');
      return;
    }

    setIsLoading(true);
    const { error } = await supabase
      .from('playlists')
      .insert([{
        name: playlistName,
        description: description,
        user_id: user.id,
      }]);

    setIsLoading(false);

    if (error) {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist.');
    } else {
      toast.success('Playlist created successfully!');
      setPlaylistName('');
      setDescription('');
      onCreateComplete?.(); // Trigger callback
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="playlist-name" className="text-sm font-medium">Playlist Name</label>
        <Input
          id="playlist-name"
          placeholder="My Awesome Mix"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description (Optional)</label>
        <Textarea
          id="description"
          placeholder="A collection of my favorite tracks..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Playlist'}
      </Button>
    </form>
  );
}
