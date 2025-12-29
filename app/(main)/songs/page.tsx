"use client";

import { useEffect, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Play, Pause, EllipsisIcon, InfoIcon, LucideEdit } from "lucide-react";
import { useMusicStore } from "@/lib/stores/music-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { createClient } from "@/lib/utils/supabase/supabase.client";
import { toast } from "sonner";
import Image from "next/image";
import { LoadPlaylistToDropdown, Song } from "@/types/interfaces";
import { UploadMusicDrawer } from "@/components/widgets/UploadMusicDrawer";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { VisibilityButton } from "@/lib/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditSong from "@/components/widgets/EditSong";

export default function SongsPage() {

  const isMobile = useIsMobile();

  const supabase = createClient();
  const { songs, setSongs, removeSong, setCurrentSong, setIsPlaying, currentSong, isPlaying } = useMusicStore();
  const { user } = useAuthStore();

  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [playlist, setPlaylist] = useState<LoadPlaylistToDropdown[] | null>([])

  const loadPlaylists = useCallback(async () => {
    if (!user) return;

    try {
      const { data: playlists, error } = await supabase
        .from("playlists")
        .select("name, user_id")
        .eq('user_id', user.id)

      if (error) {
        console.error(error);
        toast.error("Failed to load playlists");
        return;
      }

      setPlaylist(playlists);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load playlists");
    }
  }, [user, supabase]);

  const loadSongs = useCallback(async () => {
    if (!user) return;

    const { data: songData, error } = await supabase
      .from('songs')
      .select('*')
      .eq('uploaded_by', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Failed to load songs");
      return;
    }

    const transformedSongs: Song[] = await Promise.all(
      songData.map(async (song) => {
        console.log('Processing song:', song.title, 'Audio URL:', song.audio_url);

        const { data: signedUrlData, error: audioError } = await supabase.storage
          .from('audio')
          .createSignedUrl(song.audio_url, 3600);

        console.log('Signed URL result:', signedUrlData, 'Error:', audioError);

        const signedCoverUrlData = song.cover_url
          ? await supabase.storage.from('cover').createSignedUrl(song.cover_url, 3600)
          : { data: null };

        return {
          id: song.id,
          title: song.title,
          artist: song.artist,
          audioUrl: signedUrlData?.signedUrl || '',
          coverUrl: signedCoverUrlData?.data?.signedUrl || null,
          duration: song.duration,
          uploadedBy: song.uploaded_by,
          createdAt: song.created_at,
        };
      })
    );

    setSongs(transformedSongs);
  }, [user, setSongs, supabase]);

  useEffect(() => {
    if (user) {
      loadSongs();
      loadPlaylists();
    }
  }, [user, loadSongs, loadPlaylists]);

  const handleDeleteSong = async (songId: string) => {
    try {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', songId);

      if (error) throw error;

      removeSong(songId);
      toast.success("Song deleted!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete song");
    }
  };

  const handlePlaySong = (song: Song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  return (
    <section className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Songs</h1>
            <p className="text-muted-foreground">Manage your music collection</p>
          </div>
          <UploadMusicDrawer onUploadComplete={loadSongs} />
        </div>
        <Separator />
        {!isMobile && (
          <div className="space-y-2">
            <p className="text-base font-regular text-muted-foreground">Change visibility</p>
            <div className="w-full flex items-center jusitfy-start gap-2">
              {VisibilityButton.map(({ tooltipLabel, icon }) => {
                const VisibilityIcon = icon;
                return (
                  <Tooltip delayDuration={200} key={tooltipLabel}>
                    <TooltipTrigger asChild>
                      <Button variant={'outline'} size={'icon-lg'}>
                        <VisibilityIcon className="w-8 h-8 text-neutral-700" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm text-neutral-600">{tooltipLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {songs.map((song) => (
            <Card key={song.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    {song.coverUrl ? (
                      <Image
                        src={song.coverUrl}
                        alt={song.title}
                        width={79}
                        height={79}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-[79px] h-[79px] bg-muted flex items-center justify-center border border-neutral-200">
                        <span className="text-2xl">🎵</span>
                      </div>
                    )}
                    <Button
                      size="sm"
                      className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handlePlaySong(song)}
                    >
                      {currentSong?.id === song.id && isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </Button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="">
                        <h3 className="font-semibold truncate">{song.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                      </div>
                      <div className="">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="outline-none cursor-pointer border shadow-xs flex items-center justify-center hover:bg-accent transition-all size-8">
                            <EllipsisIcon className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel className="flex items-center gap-1">
                              <span className="">{song.title}</span> <div className="mx-1 w-px h-5 bg-neutral-300"></div> <span className="font-normal">Song configuration</span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <span className="">Add to playlist</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                  {playlist?.map((playlistData, i) => {
                                    return (
                                      <DropdownMenuItem key={i}>{playlistData.name}</DropdownMenuItem>
                                    );
                                  })}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Create new playlist...</DropdownMenuItem>
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
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
                              onClick={() => {
                                setSelectedSong(song);
                                setIsEditDrawerOpen(true);
                              }}
                            >
                              <span className="">
                                Edit
                              </span>
                              <DropdownMenuShortcut>
                                <LucideEdit className="w-4 h-4" />
                              </DropdownMenuShortcut>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={"outline"} className="text-xs">
                        {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                      </Badge>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size={"icon-sm"}
                            className="ml-auto cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure to delete {song.title} song?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your
                              account and remove your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="hover:bg-red-700" onClick={() => handleDeleteSong(song.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {songs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold mb-2">No songs yet</h3>
            <p className="text-muted-foreground mb-4">
              Upload your first song to get started
            </p>
            <UploadMusicDrawer onUploadComplete={loadSongs} />
          </div>
        )}
      </div>
      <EditSong
        song={selectedSong}
        isOpen={isEditDrawerOpen}
        onOpenChange={setIsEditDrawerOpen}
        onEditComplete={loadSongs}
      />
    </section>
  );
}
