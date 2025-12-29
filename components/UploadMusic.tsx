"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Music } from "lucide-react";
import { createClient } from "@/lib/utils/supabase/supabase.client";
import { useMusicStore } from "@/lib/stores/music-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { toast } from "sonner";
import { UploadMusicProps, Song } from "@/types/interfaces";

export function UploadMusic({ onUploadComplete }: UploadMusicProps) {

  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const { addSong } = useMusicStore();
  const { user } = useAuthStore();

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

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) throw error;
    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile || !title || !artist || !user) return;

    setIsUploading(true);
    try {
      console.log("Starting upload process...");
      const duration = await getAudioDuration(audioFile);
      console.log("Audio duration:", duration);

      const audioPath = `${user.id}/${Date.now()}-${audioFile.name}`;
      console.log("Audio path:", audioPath);

      console.log("Uploading audio file...");
      await uploadFile(audioFile, 'audio', audioPath);
      console.log("Audio upload successful");

      let coverPath = null;
      if (coverFile) {
        coverPath = `${user.id}/${Date.now()}-${coverFile.name}`;
        console.log("Cover path:", coverPath);
        console.log("Uploading cover file...");
        await uploadFile(coverFile, 'cover', coverPath);
        console.log("Cover upload successful");
      }

      console.log("Inserting song data to database...");
      const { data: newSongData, error } = await supabase
        .from('songs')
        .insert({
          title,
          artist,
          audio_url: audioPath,
          cover_url: coverPath,
          duration: Math.round(duration),
          uploaded_by: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error("Database insert error:", error);
        throw error;
      }

      console.log("Song data inserted:", newSongData);
      console.log("Audio URL in database:", newSongData.audio_url);

      console.log("Creating signed URLs...");
      const { data: signedUrlData } = await supabase.storage.from('audio').createSignedUrl(newSongData.audio_url, 3600);
      console.log("Signed URL data:", signedUrlData);

      const signedCoverUrlData = newSongData.cover_url ? await supabase.storage.from('cover').createSignedUrl(newSongData.cover_url, 3600) : { data: null };
      console.log("Signed cover URL data:", signedCoverUrlData);

      const transformedSong: Song = {
        id: newSongData.id,
        title: newSongData.title,
        artist: newSongData.artist,
        audioUrl: signedUrlData?.signedUrl || '',
        coverUrl: signedCoverUrlData?.data?.signedUrl || '',
        duration: newSongData.duration,
        uploadedBy: newSongData.uploaded_by,
        createdAt: newSongData.created_at
      };

      addSong(transformedSong);

      setTitle("");
      setArtist("");
      setAudioFile(null);
      setCoverFile(null);
      if (audioInputRef.current) audioInputRef.current.value = "";
      if (coverInputRef.current) coverInputRef.current.value = "";

      toast.success("Song uploaded successfully!");
      onUploadComplete?.();
    } catch (error) {
      console.error("Upload failed:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      toast.error("Failed to upload song");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Music
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="audio">Audio File</Label>
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
                {audioFile ? audioFile.name : "Select Audio File"}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cover">Cover Image (Optional)</Label>
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
                {coverFile ? coverFile.name : "Select Cover Image"}
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isUploading || !audioFile}>
            {isUploading ? "Uploading..." : "Upload Song"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}