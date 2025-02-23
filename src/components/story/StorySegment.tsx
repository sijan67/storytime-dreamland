
import { motion } from "framer-motion";
import { ButtonGlow } from "@/components/ui/button-glow";
import { Play, Pause, Share2 } from "lucide-react";
import { StoryControls } from "./StoryControls";
import { StoryActions } from "./StoryActions";

interface StorySegmentProps {
  segment: {
    text: string;
    imageUrl: string;
  };
  isPlaying: boolean;
  currentIndex: number;
  totalSegments: number;
  onPrevious: () => void;
  onNext: () => void;
  onPlayPause: () => void;
  onShare: () => void;
}

export const StorySegment = ({
  segment,
  isPlaying,
  currentIndex,
  totalSegments,
  onPrevious,
  onNext,
  onPlayPause,
  onShare,
}: StorySegmentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="aspect-video w-full max-w-3xl mx-auto rounded-xl overflow-hidden bg-black/20">
        {segment.imageUrl && (
          <img
            src={segment.imageUrl}
            alt="Story illustration"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="max-w-2xl mx-auto">
        <p className="text-white/90 text-lg leading-relaxed text-center">
          {segment.text}
        </p>
      </div>

      <StoryControls
        isPlaying={isPlaying}
        currentIndex={currentIndex}
        totalSegments={totalSegments}
        onPrevious={onPrevious}
        onNext={onNext}
        onPlayPause={onPlayPause}
      />

      <div className="flex justify-center">
        <ButtonGlow
          onClick={onShare}
          className="flex items-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          Share Story
        </ButtonGlow>
      </div>
    </motion.div>
  );
};
