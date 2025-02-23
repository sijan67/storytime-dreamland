
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { ButtonGlow } from "@/components/ui/button-glow";
import { motion } from "framer-motion";
import { Volume2, Pause, Play, RotateCcw, ArrowLeft, Save, Share2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Story = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  
  const story = {
    title: "The Dragon Who Learned to Fly",
    content: "In a magical land far beyond the clouds, there lived a young dragon named Spark. Unlike other dragons who soared through the skies with ease, Spark had never quite figured out how to fly. But that was about to change...",
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    // Will implement actual restart logic later
  };

  const handleNewStory = () => {
    navigate("/create");
  };

  const handleSaveStory = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save stories",
        variant: "destructive",
      });
      return;
    }

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
    } catch (error) {
      console.error('Error saving story:', error);
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
    } catch (error) {
      console.error('Error sharing story:', error);
      toast({
        title: "Error",
        description: "Failed to share story",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 left-4 z-20">
        <ButtonGlow 
          onClick={() => navigate("/dashboard")} 
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </ButtonGlow>
      </div>

      <HeroGeometric
        badge="Your Story"
        title1={story.title}
        title2="Is Ready"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 w-full max-w-2xl mx-auto space-y-8 px-4"
        >
          <div className="bg-white/[0.02] border border-white/5 rounded-lg p-6 backdrop-blur-sm">
            <p className="text-white/90 leading-relaxed text-lg">
              {story.content}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <ButtonGlow 
              onClick={handlePlayPause}
              className="flex items-center gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pause Story
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Play Story
                </>
              )}
            </ButtonGlow>

            <ButtonGlow
              onClick={handleRestart}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Restart
            </ButtonGlow>

            <ButtonGlow
              onClick={handleNewStory}
              className="flex items-center gap-2"
            >
              <Volume2 className="w-5 h-5" />
              New Story
            </ButtonGlow>

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
        </motion.div>
      </HeroGeometric>
    </div>
  );
};

export default Story;
