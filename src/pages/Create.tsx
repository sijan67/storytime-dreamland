
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { ButtonGlow } from "@/components/ui/button-glow";
import { ArrowLeft, Play, Upload, Pause } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Database } from "@/types/database";
import { useAuth } from "@/contexts/AuthContext";

type VoiceSample = Database['public']['Tables']['voice_samples']['Row'];

const Create = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedVoice, setSelectedVoice] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [context, setContext] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: voices, isLoading: isLoadingVoices } = useQuery({
    queryKey: ['voice-samples'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('voice_samples')
        .select('*')
        .order('voice_name');

      if (error) throw error;
      return data as VoiceSample[];
    },
  });

  const playVoiceSample = async (voiceId: string, samplePath: string) => {
    try {
      if (currentPlayingId === voiceId && isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
        setCurrentPlayingId(null);
        return;
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      setIsPlaying(true);
      setCurrentPlayingId(voiceId);

      const { data: publicUrl } = supabase.storage
        .from('voice-samples')
        .getPublicUrl(samplePath);

      const audio = new Audio(publicUrl.publicUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentPlayingId(null);
      };

      await audio.play();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to play voice sample",
        variant: "destructive",
      });
      setIsPlaying(false);
      setCurrentPlayingId(null);
    }
  };

  const handleVoiceUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', 'Custom Voice');
      formData.append('description', 'Custom voice for storytelling');

      const response = await supabase.functions.invoke('clone-voice', {
        body: { formData }
      });

      if (response.error) throw response.error;

      setSelectedVoice(response.data.voice_id);
      toast({
        title: "Success",
        description: "Voice uploaded and cloned successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload and clone voice",
        variant: "destructive",
      });
    }
    setIsUploading(false);
  };

  const handleSubmit = async () => {
    if (!selectedVoice) {
      toast({
        title: "Error",
        description: "Please select a voice first",
        variant: "destructive",
      });
      return;
    }

    if (!context.trim()) {
      toast({
        title: "Error",
        description: "Please enter a story context",
        variant: "destructive",
      });
      return;
    }

    try {
      // First, generate the story
      console.log('Generating story...');
      const { data: generatedStory, error: generateError } = await supabase.functions.invoke('generate-story', {
        body: { 
          context: context.trim(),
          voiceId: selectedVoice
        }
      });

      if (generateError) throw generateError;
      
      console.log('Story generated:', generatedStory);

      if (!generatedStory) {
        throw new Error('No story data received');
      }

      // Then save it to the database
      console.log('Saving story to database...');
      const { data: savedStory, error: saveError } = await supabase
        .from('stories')
        .insert({
          title: generatedStory.title,
          content: JSON.stringify(generatedStory),
          user_id: user?.id
        })
        .select()
        .single();

      if (saveError) throw saveError;

      console.log('Story saved:', savedStory);

      // Only navigate after everything is done
      navigate(`/story/${savedStory.id}`);

    } catch (error: any) {
      console.error('Error in story generation process:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate story",
        variant: "destructive",
      });
      navigate("/create");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 left-4 z-20">
        <ButtonGlow onClick={() => navigate("/dashboard")} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </ButtonGlow>
      </div>
      
      <HeroGeometric badge="Story Creation" title1="Create Your" title2="Magical Story">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 w-full max-w-2xl mx-auto space-y-6 px-4"
        >
          <div className="space-y-4">
            <h3 className="text-white/90 text-lg font-medium">Choose a Voice</h3>
            {isLoadingVoices ? (
              <div className="text-white/50 text-center py-4">Loading voices...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {voices?.map((voice) => (
                  <button
                    key={voice.voice_id}
                    onClick={() => setSelectedVoice(voice.voice_id)}
                    className={`p-4 rounded-lg border transition-all ${
                      selectedVoice === voice.voice_id
                        ? "border-white/50 bg-white/10"
                        : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-white/90 font-medium">{voice.voice_name}</h4>
                        <p className="text-white/50 text-sm">{voice.description}</p>
                      </div>
                      <ButtonGlow
                        onClick={(e) => {
                          e.stopPropagation();
                          playVoiceSample(voice.voice_id, voice.sample_path);
                        }}
                        className="p-2"
                      >
                        {currentPlayingId === voice.voice_id && isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </ButtonGlow>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="relative">
              <input
                type="file"
                accept="audio/*"
                onChange={handleVoiceUpload}
                className="hidden"
                id="voice-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="voice-upload"
                className="flex items-center justify-center w-full p-4 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2" />
                <span className="text-white/90">
                  {isUploading ? "Uploading..." : "Upload Custom Voice"}
                </span>
              </label>
            </div>
          </div>

          <Textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Describe your story... (e.g., 'A magical adventure about a brave little dragon learning to fly')"
            className="min-h-[120px] bg-white/[0.02] border-white/5 text-white/90 placeholder:text-white/40 hover:bg-white/[0.04] transition-colors"
          />

          <ButtonGlow 
            onClick={handleSubmit}
            disabled={!selectedVoice || !context}
            className="w-full"
          >
            Generate Story
          </ButtonGlow>
        </motion.div>
      </HeroGeometric>
    </div>
  );
};

export default Create;
