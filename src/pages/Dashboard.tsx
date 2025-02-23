
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  // Fetch existing voice samples
  const { data: voiceSamples, isLoading } = useQuery({
    queryKey: ['voiceSamples'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('voice_samples')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const generateVoiceSamples = async () => {
    try {
      toast.loading("Generating voice samples...");
      
      const { data, error } = await supabase.functions.invoke('generate-voice-samples');
      
      if (error) {
        throw error;
      }

      toast.success("Voice samples generated successfully!");
      
      // Refresh the voice samples list
      window.location.reload();
    } catch (error) {
      console.error('Error generating voice samples:', error);
      toast.error("Failed to generate voice samples");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={generateVoiceSamples}>
          Generate Voice Samples
        </Button>
      </div>

      {isLoading ? (
        <div>Loading voice samples...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {voiceSamples?.map((sample) => (
            <div key={sample.voice_id} className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">{sample.voice_name}</h3>
              {sample.sample_path && (
                <audio controls className="w-full">
                  <source 
                    src={`${supabase.storage.from('voice-samples').getPublicUrl(sample.sample_path).data.publicUrl}`} 
                    type="audio/mpeg" 
                  />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
