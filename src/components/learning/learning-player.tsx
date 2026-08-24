"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, SkipForward } from "lucide-react";

interface LearningPlayerProps {
  lessonId: string;
  videoUrl: string;
  initialWatchTime?: number;
  onCompleted?: () => void;
}

export function LearningPlayer({
  lessonId,
  videoUrl,
  initialWatchTime = 0,
  onCompleted,
}: LearningPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const lastSavedTime = useRef(0);

  // Set initial watch time when video loads metadata
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      if (initialWatchTime > 0 && initialWatchTime < video.duration) {
        video.currentTime = initialWatchTime;
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [initialWatchTime, videoUrl]);

  // Handle progress updates and auto-saves
  const handleTimeUpdate = async () => {
    const video = videoRef.current;
    if (!video) return;

    const current = video.currentTime;
    setCurrentTime(current);
    setProgress((current / video.duration) * 100);

    // Auto-save every 10 seconds of playback
    if (Math.abs(current - lastSavedTime.current) >= 10) {
      lastSavedTime.current = current;
      await saveProgress(current, false);
    }

    // Auto-complete at 90% watched
    if (video.duration > 0 && current / video.duration >= 0.9) {
      if (onCompleted) {
        onCompleted();
      }
      await saveProgress(current, true);
    }
  };

  const saveProgress = async (time: number, completed: boolean) => {
    try {
      await fetch("/api/lessons/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          watchTime: Math.round(time),
          isCompleted: completed,
        }),
      });
    } catch (e) {
      console.error("Failed saving video progress", e);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      saveProgress(video.currentTime, false);
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
      videoRef.current.muted = value === 0;
      setIsMuted(value === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative bg-black rounded-lg overflow-hidden group aspect-video shadow-lg">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => saveProgress(duration, true)}
      />

      {/* Video Overlay Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-3">
        {/* Progress Bar */}
        <div className="w-full bg-slate-700/60 h-1.5 rounded-full cursor-pointer overflow-hidden relative">
          <div
            className="bg-primary h-full rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between text-white text-sm">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="hover:text-primary transition-colors">
              {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white" />}
            </button>
            <span className="text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Speed Control */}
            <select
              value={playbackRate}
              onChange={(e) => handleRateChange(parseFloat(e.target.value))}
              className="bg-transparent border-0 text-white text-xs focus:ring-0 cursor-pointer"
            >
              <option value="0.5" className="bg-slate-900 text-white">0.5x</option>
              <option value="1" className="bg-slate-900 text-white">1.0x</option>
              <option value="1.5" className="bg-slate-900 text-white">1.5x</option>
              <option value="2" className="bg-slate-900 text-white">2.0x</option>
            </select>

            {/* Volume Control */}
            <div className="flex items-center gap-1.5">
              <button onClick={toggleMute} className="hover:text-primary transition-colors">
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 accent-primary h-1 rounded bg-slate-600 appearance-none cursor-pointer"
              />
            </div>

            {/* Fullscreen */}
            <button onClick={handleFullscreen} className="hover:text-primary transition-colors">
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
