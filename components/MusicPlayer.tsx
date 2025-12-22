"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle
} from "lucide-react";
import { useMusicStore } from "@/lib/stores/music-store";
import Image from "next/image";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeated, setIsRepeated] = useState(false);

  const {
    songs,
    currentSong,
    isPlaying,
    volume,
    currentTime,
    setCurrentSong,
    setIsPlaying,
    setVolume,
    setCurrentTime
  } = useMusicStore();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && currentSong?.audioUrl) {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      // Duration is now correctly sourced from the database
    }
  };

  const handlePlayPause = () => {
    if (!currentSong) return;
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleTimeChange = (value: number[]) => {
    if (!currentSong) return;
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleNextPrev = (direction: 'next' | 'prev') => {
    if (!currentSong || songs.length === 0) return;

    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    if (currentIndex === -1) return;

    let nextIndex;

    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * songs.length);
      if (songs.length > 1 && nextIndex === currentIndex) {
        nextIndex = (currentIndex + 1) % songs.length;
      }
    } else {
      if (direction === 'next') {
        nextIndex = (currentIndex + 1) % songs.length;
      } else {
        nextIndex = (currentIndex - 1 + songs.length) % songs.length;
      }
    }
    
    setCurrentSong(songs[nextIndex]);
    setIsPlaying(true);
  }

  const handleSongEnd = () => {
    if (isRepeated && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      handleNextPrev('next');
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentSong) {
    return null;
  }

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50">
      <CardContent className="p-4">
        <audio
          ref={audioRef}
          src={currentSong.audioUrl || ''}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleSongEnd}
        />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {currentSong.coverUrl && (
              <Image
                src={currentSong.coverUrl}
                alt={currentSong.title}
                width={48}
                height={48}
                className="rounded-md object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <h4 className="font-medium truncate">{currentSong.title}</h4>
              <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsShuffled(!isShuffled)}
                className={isShuffled ? "text-primary" : ""}
              >
                <Shuffle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleNextPrev('prev')}>
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button onClick={handlePlayPause}>
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleNextPrev('next')}>
                <SkipForward className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRepeated(!isRepeated)}
                className={isRepeated ? "text-primary" : ""}
              >
                <Repeat className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-muted-foreground w-10 text-right">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                max={currentSong.duration || 0}
                step={1}
                onValueChange={handleTimeChange}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-10">
                {formatTime(currentSong.duration || 0)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
            <Button variant="ghost" size="sm" onClick={handleMute}>
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-20"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}