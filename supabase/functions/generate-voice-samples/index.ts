
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const sampleText = "Hello! This is a sample of my voice for storytelling. I hope you enjoy listening to it!";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const voices = [
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel' },
    { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella' },
    { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni' }
  ];

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    for (const voice of voices) {
      // Generate audio using ElevenLabs API
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voice.id}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': Deno.env.get('ELEVEN_LABS_API_KEY') || '',
          },
          body: JSON.stringify({
            text: sampleText,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.75,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to generate audio for ${voice.name}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const audioFile = new File([audioBuffer], `${voice.name.toLowerCase()}-sample.mp3`, {
        type: 'audio/mpeg',
      });

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('voice-samples')
        .upload(`${voice.name.toLowerCase()}-sample.mp3`, audioFile, {
          contentType: 'audio/mpeg',
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Failed to upload ${voice.name} sample: ${uploadError.message}`);
      }
    }

    return new Response(
      JSON.stringify({ message: 'Voice samples generated and uploaded successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
