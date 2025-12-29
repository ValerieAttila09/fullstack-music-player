import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useRef, useState, useEffect } from "react";
import { Music, Upload } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useMusicStore } from "@/lib/stores/music-store";
import { toast } from "sonner";
import { createClient } from "@/lib/utils/supabase/supabase.client";
import { EditSongProps, Song } from "@/types/interfaces";

const EditSong = ({ song, isOpen, onOpenChange, onEditComplete }: EditSongProps) => {
  const supabase = createClient();

  const [title, setTitle] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const { updateSong } = useMusicStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (song) {
      setTitle(song.title);
      setArtist(song.artist);
      setAudioFile(null);
      setCoverFile(null);
    }
  }, [song]);

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = document.createElement('audio');
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        resolve(audio.duration);
      };
    });
  };

  const handleAudioFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
    } else {
      toast.error("Please select a valid audio file");
    }
  };

  const handleCoverFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setCoverFile(file);
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const uploadFile = async (file: File, bucket: string, path: string): Promise<{
    id: string;
    path: string;
    fullPath: string;
  }> => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) throw error;
    return data;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!song || !title || !artist || !user) return;

    setIsUploading(true);
    try {
      let audioPath = song.audioUrl;
      let coverPath = song.coverUrl;
      let duration = song.duration;

      if (audioFile) {
        duration = await getAudioDuration(audioFile);
        audioPath = `${user.id}/${Date.now()}-${audioFile.name}`;
        await uploadFile(audioFile, 'audio', audioPath);
      }

      if (coverFile) {
        coverPath = `${user.id}/${Date.now()}-${coverFile.name}`;
        await uploadFile(coverFile, 'audio', coverPath);
      }

      const { data: updatedSongData, error } = await supabase
        .from('songs')
        .update({
          title,
          artist,
          audio_url: audioPath,
          cover_url: coverPath,
          duration: Math.round(duration),
        })
        .eq('id', song.id)
        .select()
        .single();

      if (error) throw error;

      const { data: signedUrlData } = await supabase.storage.from('audio').createSignedUrl(updatedSongData.audio_url, 3600);
      const signedCoverUrlData = updatedSongData.cover_url ? await supabase.storage.from('cover').createSignedUrl(updatedSongData.cover_url, 3600) : { data: null };

      const transformedSong: Song = {
        id: updatedSongData.id,
        title: updatedSongData.title,
        artist: updatedSongData.artist,
        audioUrl: signedUrlData?.signedUrl || '',
        coverUrl: signedCoverUrlData?.data?.signedUrl || null,
        duration: updatedSongData.duration,
        uploadedBy: updatedSongData.uploaded_by,
        createdAt: updatedSongData.created_at
      };

      updateSong(transformedSong);

      setTitle("");
      setArtist("");
      setAudioFile(null);
      setCoverFile(null);
      if (audioInputRef.current) audioInputRef.current.value = "";
      if (coverInputRef.current) coverInputRef.current.value = "";

      toast.success("Song updated successfully!");
      onOpenChange(false);
      onEditComplete?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update song");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Drawer direction={'right'} open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Edit your music</DrawerTitle>
          </DrawerHeader>
          <Separator className='my-2' />
          <form onSubmit={handleSubmit}>
            <div className="p-4 pb-0 space-y-2">
              <div className="space-y-2">
                <Label htmlFor="title">Song Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="artist">Artist</Label>
                <Input
                  id="artist"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audio">Audio File (optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioFileSelect}
                    className="hidden"
                    id="audio-file"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => audioInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Music className="w-4 h-4 mr-2" />
                    {audioFile ? audioFile.name : "Change Audio File"}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover">Cover Image (optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileSelect}
                    className="hidden"
                    id="cover-file"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => coverInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {coverFile ? coverFile.name : "Change Cover Image"}
                  </Button>
                </div>
              </div>
            </div>
            <DrawerFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isUploading}
              >
                {isUploading ? "Saving..." : "Save Changes"}
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

export default EditSong;