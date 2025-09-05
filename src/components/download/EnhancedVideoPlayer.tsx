"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RefreshCw, SkipBack, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedVideoPlayerProps {
  src: string;
  fileName: string;
}

export function EnhancedVideoPlayer({ src, fileName }: EnhancedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(video.currentTime);
    };
    const setVideoDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', setVideoDuration);
    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', setVideoDuration);
      video.removeEventListener('play', () => setIsPlaying(true));
      video.removeEventListener('pause', () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current?.paused) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const seekTime = (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) * duration;
    if (videoRef.current) videoRef.current.currentTime = seekTime;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (!isMuted && volume === 0) setVolume(1);
    }
  };

  const toggleFullScreen = () => {
    videoRef.current?.requestFullscreen();
  };

  const skip = (time: number) => {
    if (videoRef.current) videoRef.current.currentTime += time;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto group overflow-hidden rounded-2xl shadow-2xl shadow-bolt-black/20">
      <video ref={videoRef} src={src} className="w-full aspect-video" onClick={togglePlay} />
      
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="flex items-center gap-8">
          <button onClick={() => skip(-10)} className="p-4 bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20 transition-colors"><SkipBack className="w-6 h-6 text-white" /></button>
          <button onClick={togglePlay} className="p-6 bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20 transition-colors">
            {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white" />}
          </button>
          <button onClick={() => skip(10)} className="p-4 bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20 transition-colors"><SkipForward className="w-6 h-6 text-white" /></button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer" onClick={handleSeek}>
          <div className="h-full bg-bolt-cyan rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between mt-2 text-white">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay}>{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
            <div className="flex items-center gap-2">
              <button onClick={toggleMute}>{isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}</button>
              <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="w-20 h-1 accent-bolt-cyan" />
            </div>
            <div className="text-xs font-mono">{formatTime(currentTime)} / {formatTime(duration)}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium truncate max-w-xs">{fileName}</div>
            <button onClick={toggleFullScreen}><Maximize className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}