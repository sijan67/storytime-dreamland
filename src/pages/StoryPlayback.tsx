import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ButtonGlow } from "@/components/ui/button-glow";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { StorySegment as StorySegmentComponent } from "@/components/story/StorySegment";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { Loading } from "@/components/ui/loading";

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
  id: string;
  title: string;
  content: {
    segments: StorySegment[];
    title: string;
  };
}

const SEGMENT_DURATION = 15000; // 15 seconds in milliseconds

const StoryPlayback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
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

  useEffect(() => {
    const fetchStory = async () => {
      try {
        // If we have state data, use it
        if (location.state?.story) {
          setStory(location.state.story);
          setIsLoading(false);
          return;
        }

        // If no state data, fetch from API using ID
        if (!id) throw new Error('Story ID is required');

        const { data, error: fetchError } = await supabase
          .from('stories')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;

        if (data) {
          const parsedContent = JSON.parse(data.content);
          setStory({
            id: data.id,
            title: data.title,
            content: parsedContent
          });
        }
      } catch (err) {
        console.error('Error loading story:', err);
        setError('Missing required parameters. Please return to the create page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStory();
  }, [id, location.state]);

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
          content: JSON.stringify(story.content),
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
          content: JSON.stringify(story.content),
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
    if (!story || !isPlaying) return;

    const currentSegment = story.content.segments[currentSegmentIndex];
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
        if (currentSegmentIndex < story.content.segments.length - 1) {
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
    if (currentSegmentIndex < story.content.segments.length - 1) {
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
    return <Loading />;
  }

  if (error || !story) {
    return (
      <div className="min-h-screen">
        <HeroGeometric
          badge="Oops!"
          title1="Something went wrong"
          title2="Try Again"
        >
          <div className="mt-12 w-full max-w-md mx-auto space-y-8 px-4 text-center">
            <p className="text-white/90">{error}</p>
            <ButtonGlow onClick={() => navigate("/create")}>
              Return to Create
            </ButtonGlow>
          </div>
        </HeroGeometric>
      </div>
    );
  }

  const currentSegment = story.content.segments[currentSegmentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <audio ref={narrationRef} />
      <audio ref={ambienceRef} />
      
      <div className="absolute top-4 left-4 z-20">
        <ButtonGlow onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </ButtonGlow>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white/90 text-center mb-8">
          {story.title}
        </h1>
        
        <AnimatePresence mode="wait">
          <StorySegmentComponent
            key={currentSegmentIndex}
            segment={currentSegment}
            isPlaying={isPlaying}
            currentIndex={currentSegmentIndex}
            totalSegments={story.content.segments.length}
            onPrevious={() => setCurrentSegmentIndex(prev => Math.max(0, prev - 1))}
            onNext={() => setCurrentSegmentIndex(prev => 
              Math.min(story.content.segments.length - 1, prev + 1)
            )}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onSave={() => {/* implement save logic */}}
            onShare={() => {/* implement share logic */}}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StoryPlayback;
