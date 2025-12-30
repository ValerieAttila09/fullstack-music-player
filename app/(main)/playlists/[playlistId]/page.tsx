'use client'

import { use, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/utils/supabase/supabase.client'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useMusicStore } from '@/lib/stores/music-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Play, Pause, Trash2, ArrowLeft, Music } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Song } from '@/types/interfaces'

interface PlaylistWithSongs {
  id: string
  name: string
  userId: string
  createdAt: string
  songs: Song[]
}

const Page = ({
  params,
}: {
  params: Promise<{ playlistId: string }>
}) => {
  const { playlistId } = use(params)
  const router = useRouter()
  const supabase = createClient()
  const { user } = useAuthStore()
  const { currentSong, isPlaying, setCurrentSong, setIsPlaying } = useMusicStore()

  const [playlist, setPlaylist] = useState<PlaylistWithSongs | null>(null)
  const [loading, setLoading] = useState(true)

  const loadPlaylist = useCallback(async () => {
    if (!user || !playlistId) return

    try {
      // Fetch playlist info
      const { data: playlistData, error: playlistError } = await supabase
        .from('playlists')
        .select('*')
        .eq('id', playlistId)
        .eq('user_id', user.id)
        .single()

      if (playlistError) {
        console.error('Error fetching playlist:', playlistError)
        toast.error('Playlist not found')
        router.push('/playlists')
        return
      }

      // Fetch songs in playlist
      const { data: playlistSongsData, error: songsError } = await supabase
        .from('playlist_songs')
        .select(`
          song_id,
          songs!playlist_songs_song_id_fkey (
            id,
            title,
            artist,
            audio_url,
            cover_url,
            duration,
            uploaded_by,
            created_at
          )
        `)
        .eq('playlist_id', playlistId)
        .order('created_at', { ascending: true })

      if (songsError) {
        console.error('Error fetching playlist songs:', songsError)
        toast.error('Failed to load playlist songs')
        return
      }

      // Create signed URLs for songs
      const songsWithSignedUrls: Song[] = (await Promise.all(
        playlistSongsData.map(async (item: any) => {
          const song = item.songs
          if (!song) return null

          console.log('Processing playlist song:', song.title, 'Audio URL:', song.audio_url)

          let audioSignedUrl = { signedUrl: '' }
          let coverSignedUrl = { data: null }

          try {
            const audioResult = await supabase.storage
              .from('audio')
              .createSignedUrl(song.audio_url, 3600)
            audioSignedUrl = audioResult.data || { signedUrl: '' }
            console.log('Audio signed URL result:', audioResult)
          } catch (error) {
            console.error('Error creating audio signed URL:', error)
          }

          if (song.cover_url) {
            try {
              const coverResult = await supabase.storage
                .from('cover')
                .createSignedUrl(song.cover_url, 3600)
              coverSignedUrl = coverResult
              console.log('Cover signed URL result:', coverResult)
            } catch (error) {
              console.error('Error creating cover signed URL:', error)
            }
          }

          return {
            id: song.id,
            title: song.title,
            artist: song.artist,
            audioUrl: audioSignedUrl.signedUrl || '',
            coverUrl: coverSignedUrl?.data?.signedUrl || null,
            duration: song.duration,
            uploadedBy: song.uploaded_by,
            createdAt: song.created_at,
          }
        })
      )).filter((song): song is Song => song !== null)

      setPlaylist({
        id: playlistData.id,
        name: playlistData.name,
        userId: playlistData.user_id,
        createdAt: playlistData.created_at,
        songs: songsWithSignedUrls,
      })
    } catch (error) {
      console.error('Error loading playlist:', error)
      toast.error('Failed to load playlist')
    } finally {
      setLoading(false)
    }
  }, [playlistId, user, supabase, router])

  useEffect(() => {
    loadPlaylist()
  }, [loadPlaylist])

  const handlePlaySong = (song: Song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentSong(song)
      setIsPlaying(true)
    }
  }

  const handleRemoveSong = async (songId: string) => {
    try {
      const { error } = await supabase
        .from('playlist_songs')
        .delete()
        .eq('playlist_id', playlistId)
        .eq('song_id', songId)

      if (error) throw error

      // Update local state
      setPlaylist(prev => prev ? {
        ...prev,
        songs: prev.songs.filter(song => song.id !== songId)
      } : null)

      toast.success('Song removed from playlist')
    } catch (error) {
      console.error('Error removing song:', error)
      toast.error('Failed to remove song from playlist')
    }
  }

  if (loading) {
    return (
      <section className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/playlists')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="text-center py-12">
            <p>Loading playlist...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!playlist) {
    return (
      <section className="p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/playlists')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="text-center py-12">
            <p>Playlist not found</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/playlists')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Playlists
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <Music className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{playlist.name}</h1>
              <p className="text-muted-foreground">
                {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {playlist.songs.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold mb-2">No songs in this playlist</h3>
            <p className="text-muted-foreground">Add songs to this playlist from your music library.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {playlist.songs.map((song) => (
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
                          className="object-cover rounded"
                        />
                      ) : (
                        <div className="w-[79px] h-[79px] bg-muted flex items-center justify-center border border-neutral-200 rounded">
                          <span className="text-2xl">🎵</span>
                        </div>
                      )}
                      <Button
                        size="sm"
                        className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity rounded"
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
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{song.title}</h3>
                          <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"
                          onClick={() => handleRemoveSong(song.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Page