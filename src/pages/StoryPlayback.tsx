import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ButtonGlow } from "@/components/ui/button-glow";
import { ArrowLeft, ArrowRight, Play, Pause, Save, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CreateLoading from './CreateLoading';
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  
  const [story, setStory] = useState<Story | null>(null);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const narrationRef = useRef<HTMLAudioElement | null>(null);
  const ambienceRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSaveStory = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save stories",
        variant: "destructive",
      });
      return;
    }

    if (!story) return;

    try {
      const { error } = await supabase
        .from('stories')
        .insert({
          title: story.title,
          content: JSON.stringify(story),
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Story saved successfully!",
      });

      navigate("/dashboard");
    } catch (err) {
      console.error('Error saving story:', err);
      toast({
        title: "Error",
        description: "Failed to save story",
        variant: "destructive",
      });
    }
  };

  const handleShareStory = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to share stories",
        variant: "destructive",
      });
      return;
    }

    if (!story) return;

    try {
      const { error } = await supabase
        .from('stories')
        .insert({
          title: story.title,
          content: JSON.stringify(story),
          user_id: user.id,
          is_public: true,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Story shared successfully!",
      });

      navigate("/dashboard");
    } catch (err) {
      console.error('Error sharing story:', err);
      toast({
        title: "Error",
        description: "Failed to share story",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const generateStory = async () => {
      try {
        if (!location.state || !location.state.context || !location.state.voiceId) {
          throw new Error('Missing required parameters. Please return to the create page.');
        }

        const { context, voiceId } = location.state;
        
        const response = await supabase.functions.invoke('generate-story', {
          body: { 
            context,
            voiceId
          }
        });

        if (response.error) {
          throw new Error(response.error.message || 'Failed to generate story');
        }

        if (!response.data) {
          throw new Error('No story data received');
        }

        setStory(response.data);
      } catch (err) {
        console.error('Error generating story:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate story';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    generateStory();
  }, [location.state, toast]);

  useEffect(() => {
    if (!story || !isPlaying) return;

    const currentSegment = story.segments[currentSegmentIndex];
    if (!currentSegment) return;

    if (narrationRef.current) {
      narrationRef.current.src = `data:audio/mp3;base64,${currentSegment.narrationAudio}`;
      narrationRef.current.play().catch(err => {
        console.error('Error playing narration:', err);
      });
    }

    if (ambienceRef.current) {
      ambienceRef.current.src = `data:audio/mp3;base64,${currentSegment.ambienceAudio}`;
      ambienceRef.current.play().catch(err => {
        console.error('Error playing ambience:', err);
      });
      ambienceRef.current.loop = true;
    }

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
        narrationRef.current.play().catch(console.error);
      }
    }
    if (ambienceRef.current) {
      if (isPlaying) {
        ambienceRef.current.pause();
      } else {
        ambienceRef.current.play().catch(console.error);
      }
    }
  };

  const handleBackToCreate = () => {
    navigate("/create");
  };

  if (isLoading) {
    return (
      <CreateLoading />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white/90 text-xl font-medium mb-4">Oops! Something went wrong</h2>
          <p className="text-white/60 mb-6">{error}</p>
          <ButtonGlow onClick={handleBackToCreate}>Try Again</ButtonGlow>
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
        <ButtonGlow onClick={handleBackToCreate} className="p-2">
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

            <div className="flex justify-center items-center gap-4 mb-6">
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
              <div className="mt-6 p-4 bg-white/5 rounded-lg mb-6">
                <p className="text-white/90 text-center">
                  This is an interaction point! You can chat with the characters here.
                </p>
              </div>
            )}

            {currentSegmentIndex === story.segments.length - 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <ButtonGlow
                  onClick={handleSaveStory}
                  className="flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Story
                </ButtonGlow>

                <ButtonGlow
                  onClick={handleShareStory}
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Share Story
                </ButtonGlow>
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
