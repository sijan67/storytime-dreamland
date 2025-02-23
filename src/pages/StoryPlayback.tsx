
import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ButtonGlow } from "@/components/ui/button-glow";
import { ArrowLeft, ArrowRight, Play, Pause } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StorySegment {
  text: string;
  image_description: string;
  audio_ambience: string;
  interaction_point: boolean;
  imageUrl: string;
  narrationAudio: string;
  ambienceAudio: string;
}

interface Story {
  title: string;
  segments: StorySegment[];
}

const SEGMENT_DURATION = 15000; // 15 seconds in milliseconds

const StoryPlayback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [story, setStory] = useState<Story | null>(null);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const narrationRef = useRef<HTMLAudioElement | null>(null);
  const ambienceRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate the story when component mounts
  useEffect(() => {
    const generateStory = async () => {
      try {
        const { context, voiceId } = location.state;
        
        if (!context || !voiceId) {
          throw new Error('Missing required parameters');
        }

        const response = await supabase.functions.invoke('generate-story', {
          body: { context, voiceId }
        });

        if (response.error) throw response.error;
        setStory(response.data);
      } catch (err) {
        console.error('Error generating story:', err);
        setError('Failed to generate story. Please try again.');
        toast({
          title: "Error",
          description: "Failed to generate story",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    generateStory();
  }, [location.state]);

  // Handle segment playback
  useEffect(() => {
    if (!story || !isPlaying) return;

    const currentSegment = story.segments[currentSegmentIndex];
    if (!currentSegment) return;

    // Play narration
    if (narrationRef.current) {
      narrationRef.current.src = `data:audio/mp3;base64,${currentSegment.narrationAudio}`;
      narrationRef.current.play();
    }

    // Play ambience
    if (ambienceRef.current) {
      ambienceRef.current.src = `data:audio/mp3;base64,${currentSegment.ambienceAudio}`;
      ambienceRef.current.play();
      ambienceRef.current.loop = true;
    }

    // Set timer for next segment if not at an interaction point
    if (!currentSegment.interaction_point) {
      timerRef.current = setTimeout(() => {
        if (currentSegmentIndex < story.segments.length - 1) {
          setCurrentSegmentIndex(prev => prev + 1);
        }
      }, SEGMENT_DURATION);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (ambienceRef.current) {
        ambienceRef.current.pause();
        ambienceRef.current.currentTime = 0;
      }
    };
  }, [currentSegmentIndex, story, isPlaying]);

  const handleNext = () => {
    if (!story) return;
    if (currentSegmentIndex < story.segments.length - 1) {
      setCurrentSegmentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex(prev => prev - 1);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (narrationRef.current) {
      if (isPlaying) {
        narrationRef.current.pause();
      } else {
        narrationRef.current.play();
      }
    }
    if (ambienceRef.current) {
      if (isPlaying) {
        ambienceRef.current.pause();
      } else {
        ambienceRef.current.play();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white/50 mx-auto mb-4"></div>
          <h2 className="text-white/90 text-xl font-medium">Generating your story...</h2>
          <p className="text-white/60 mt-2">This might take a few moments</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white/90 text-xl font-medium mb-4">Oops! Something went wrong</h2>
          <p className="text-white/60 mb-6">{error}</p>
          <ButtonGlow onClick={() => navigate('/create')}>Try Again</ButtonGlow>
        </div>
      </div>
    );
  }

  if (!story) return null;

  const currentSegment = story.segments[currentSegmentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <audio ref={narrationRef} />
      <audio ref={ambienceRef} />
      
      <div className="absolute top-4 left-4 z-20">
        <ButtonGlow onClick={() => navigate("/create")} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </ButtonGlow>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white/90 text-center mb-8">{story.title}</h1>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSegmentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="aspect-video rounded-lg overflow-hidden mb-6">
              <img 
                src={currentSegment.imageUrl} 
                alt={currentSegment.image_description}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-white/90 text-lg text-center mb-8">
              {currentSegment.text}
            </p>

            <div className="flex justify-center items-center gap-4">
              <ButtonGlow
                onClick={handlePrevious}
                disabled={currentSegmentIndex === 0}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </ButtonGlow>

              <ButtonGlow onClick={togglePlayPause} className="p-2">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </ButtonGlow>

              <ButtonGlow
                onClick={handleNext}
                disabled={currentSegmentIndex === story.segments.length - 1}
                className="p-2"
              >
                <ArrowRight className="w-5 h-5" />
              </ButtonGlow>
            </div>

            {currentSegment.interaction_point && (
              <div className="mt-6 p-4 bg-white/5 rounded-lg">
                <p className="text-white/90 text-center">
                  This is an interaction point! You can chat with the characters here.
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-center">
              <p className="text-white/60">
                Segment {currentSegmentIndex + 1} of {story.segments.length}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StoryPlayback;
