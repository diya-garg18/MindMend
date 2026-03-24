import { useState } from 'react';
import { useMusicPlayer, tracks } from '@/hooks/useMusicPlayer';
import { useLocation } from 'react-router-dom';
import { Music, Pause, Play, X, Volume2, VolumeX, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export default function FloatingMusicPlayer() {
  const { currentTrack, isPlaying, volume, isMuted, pause, resume, stop, setVolume, toggleMute } = useMusicPlayer();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  // Don't show if nothing is playing/loaded, or if user is on the self-help music tab
  if (currentTrack === null) return null;
  // Hide on self-help page so the inline player is used instead
  if (location.pathname === '/self-help') return null;

  const track = tracks[currentTrack];

  return (
    <div className="fixed bottom-20 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden w-72">
        {/* Header - always visible */}
        <div className="flex items-center gap-3 p-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-lg">{track.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{track.title}</p>
            <p className="text-xs text-muted-foreground">
              {isPlaying ? '♫ Playing' : '⏸ Paused'}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => isPlaying ? pause() : resume()}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={stop}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Expanded volume control */}
        {expanded && (
          <div className="px-3 pb-3 flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={toggleMute}>
              {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={(val) => setVolume(val[0])}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-7 text-right">{isMuted ? 0 : volume}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
