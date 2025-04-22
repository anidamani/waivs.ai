"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactHowler from "react-howler";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function AudioPlayer({ audioUrl }: { audioUrl: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Use ReactHowler type, not Howl
  const howlerRef = useRef<ReactHowler | null>(null);
  const animationRef = useRef<number | null>(null);

  const updateSeek = useCallback(() => {
    const howl = howlerRef.current?.howler;
    if (howl && isPlaying) {
      setCurrentTime(howl.seek() as number);
      animationRef.current = requestAnimationFrame(updateSeek);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateSeek);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, updateSeek]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleVolumeChange = (val: number[]) => setVolume(val[0]);

  const handleSeek = (val: number[]) => {
    const howl = howlerRef.current?.howler;
    if (howl) {
      howl.seek(val[0]);
      setCurrentTime(val[0]);
    }
  };

  return (
    <div className="w-full p-4 rounded-xl flex flex-col gap-3">
      <ReactHowler
        src={audioUrl}
        playing={isPlaying}
        volume={volume}
        // onLoad gets called when audio is ready;
        // we can get duration from howlerRef
        onLoad={() => {
          const howl = howlerRef.current?.howler;
          if (howl) setDuration(howl.duration() || 0);
        }}
        ref={howlerRef} // <-- ref to the component
      />

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <SkipBack className="text-gray-400 cursor-pointer" size={20} />
        <button
          onClick={togglePlay}
          className="p-3 bg-gradient-to-r from-[#2C6BAC] to-[#38B2AC] text-white rounded-full shadow-md"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <SkipForward className="text-gray-400 cursor-pointer" size={20} />
      </div>

      {/* Seek Bar */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
        <Slider
          className=""
          value={[currentTime]}
          max={duration}
          onValueChange={handleSeek}
        />
        <span className="text-xs text-gray-500">{formatTime(duration)}</span>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2">
        {volume > 0 ? <Volume2 size={18} /> : <VolumeX size={18} />}
        <Slider
          value={[volume]}
          max={1}
          step={0.1}
          onValueChange={handleVolumeChange}
          className="w-24"
        />
      </div>
    </div>
  );
}

function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
