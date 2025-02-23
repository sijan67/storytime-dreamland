
import { motion } from "framer-motion";
import { StoryControls } from "./StoryControls";
import { StoryActions } from "./StoryActions";

interface StorySegmentProps {
  segment: {
    imageUrl: string;
    image_description: string;
    text: string;
    interaction_point: boolean;
  };
  isPlaying: boolean;
  currentIndex: number;
  totalSegments: number;
  onPrevious: () => void;
  onNext: () => void;
  onPlayPause: () => void;
  onSave: () => void;
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
  onSave,
  onShare,
}: StorySegmentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="aspect-video rounded-lg overflow-hidden mb-6">
        <img 
          src={segment.imageUrl} 
          alt={segment.image_description}
          className="w-full h-full object-cover"
        />
      </div>

      <p className="text-white/90 text-lg text-center mb-8">
        {segment.text}
      </p>

      <StoryControls
        onPrevious={onPrevious}
        onNext={onNext}
        onPlayPause={onPlayPause}
        isPlaying={isPlaying}
        currentIndex={currentIndex}
        totalSegments={totalSegments}
      />

      {segment.interaction_point && (
        <div className="mt-6 p-4 bg-white/5 rounded-lg mb-6">
          <p className="text-white/90 text-center">
            This is an interaction point! You can chat with the characters here.
          </p>
        </div>
      )}

      {currentIndex === totalSegments - 1 && (
        <StoryActions onSave={onSave} onShare={onShare} />
      )}

      <div className="mt-6 flex justify-center">
        <p className="text-white/60">
          Segment {currentIndex + 1} of {totalSegments}
        </p>
      </div>
    </motion.div>
  );
};
