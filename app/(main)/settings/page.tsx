"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useMusicStore } from "@/lib/stores/music-store";
import {
  Volume2,
  Moon,
  Sun,
  User,
  LogOut,
  Shuffle,
  Repeat,
  Settings,
  Music,
  Palette
} from "lucide-react";

const Page = () => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const { volume, setVolume } = useMusicStore();

  const [defaultVolume, setDefaultVolume] = useState(volume);
  const [autoShuffle, setAutoShuffle] = useState(false);
  const [autoRepeat, setAutoRepeat] = useState(false);
  const [audioQuality, setAudioQuality] = useState("high");

  const handleVolumeChange = (value: number[]) => {
    setDefaultVolume(value[0]);
    setVolume(value[0]);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Audio Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Audio Settings
            </CardTitle>
            <CardDescription>
              Configure your audio playback preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Default Volume</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[defaultVolume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12">
                  {Math.round(defaultVolume * 100)}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Audio Quality</Label>
              <Select value={audioQuality} onValueChange={setAudioQuality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (96kbps)</SelectItem>
                  <SelectItem value="medium">Medium (128kbps)</SelectItem>
                  <SelectItem value="high">High (320kbps)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Playback Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Playback Settings
            </CardTitle>
            <CardDescription>
              Customize your music playback behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Shuffle className="w-4 h-4" />
                  Auto Shuffle
                </Label>
                <p className="text-sm text-muted-foreground">
                  Automatically shuffle songs when playing
                </p>
              </div>
              <Switch
                checked={autoShuffle}
                onCheckedChange={setAutoShuffle}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Repeat className="w-4 h-4" />
                  Auto Repeat
                </Label>
                <p className="text-sm text-muted-foreground">
                  Automatically repeat playlist when finished
                </p>
              </div>
              <Switch
                checked={autoRepeat}
                onCheckedChange={setAutoRepeat}
              />
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of your music player
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account
            </CardTitle>
            <CardDescription>
              Manage your account settings and profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {user && (
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>
                    {user.fullName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-medium">{user.fullName || "User"}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary">Premium</Badge>
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;