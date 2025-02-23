
import { ButtonGlow } from "@/components/ui/button-glow";
import { ArrowLeft, ArrowRight, Play, Pause } from "lucide-react";

interface StoryControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onPlayPause: () => void;
  isPlaying: boolean;
  currentIndex: number;
  totalSegments: number;
}

export const StoryControls = ({
  onPrevious,
  onNext,
  onPlayPause,
  isPlaying,
  currentIndex,
  totalSegments,
}: StoryControlsProps) => {
  return (
    <div className="flex justify-center items-center gap-4 mb-6">
      <ButtonGlow
        onClick={onPrevious}
        disabled={currentIndex === 0}
        className="p-2"
      >
        <ArrowLeft className="w-5 h-5" />
      </ButtonGlow>

      <ButtonGlow onClick={onPlayPause} className="p-2">
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </ButtonGlow>

      <ButtonGlow
        onClick={onNext}
        disabled={currentIndex === totalSegments - 1}
        className="p-2"
      >
        <ArrowRight className="w-5 h-5" />
      </ButtonGlow>
    </div>
  );
};
