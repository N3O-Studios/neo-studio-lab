import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface AudioTrimmerProps {
  audioFile: File;
  onTrim: (start: number, end: number) => void;
}

export const AudioTrimmer = ({ audioFile, onTrim }: AudioTrimmerProps) => {
  const [duration, setDuration] = useState(0);
  const [trimRange, setTrimRange] = useState<[number, number]>([0, 30]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(audioFile);
    
    audio.addEventListener('loadedmetadata', () => {
      const audioDuration = audio.duration;
      setDuration(audioDuration);
      setTrimRange([0, Math.min(30, audioDuration)]);
    });

    return () => {
      URL.revokeObjectURL(audio.src);
    };
  }, [audioFile]);

  useEffect(() => {
    onTrim(trimRange[0], trimRange[1]);
  }, [trimRange, onTrim]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (duration === 0) return null;

  return (
    <Card className="p-4 space-y-4 bg-card/50">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Trim Audio (max 30s)</span>
          <span className="font-medium">
            {formatTime(trimRange[0])} - {formatTime(trimRange[1])} 
            <span className="text-muted-foreground ml-2">
              ({(trimRange[1] - trimRange[0]).toFixed(1)}s)
            </span>
          </span>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground">Start Time</label>
            <Slider
              value={[trimRange[0]]}
              onValueChange={([value]) => {
                const maxStart = Math.min(duration - 1, trimRange[1] - 1);
                setTrimRange([Math.min(value, maxStart), trimRange[1]]);
              }}
              max={duration}
              step={0.1}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">End Time</label>
            <Slider
              value={[trimRange[1]]}
              onValueChange={([value]) => {
                const minEnd = trimRange[0] + 1;
                const maxEnd = Math.min(trimRange[0] + 30, duration);
                setTrimRange([trimRange[0], Math.max(minEnd, Math.min(value, maxEnd))]);
              }}
              max={duration}
              step={0.1}
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
