
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

  // 2 male voices (Charlie and George) and 2 female voices (Sarah and Charlotte)
  const voices = [
    { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', description: 'Male narrator with a friendly tone' },
    { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', description: 'Male narrator with a warm, engaging voice' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'Female narrator with a clear, professional voice' },
    { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', description: 'Female narrator with a gentle, soothing voice' }
  ];

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // First, clear existing voice samples
    await supabase
      .from('voice_samples')
      .delete()
      .neq('voice_id', 'placeholder');

    for (const voice of voices) {
      console.log(`Generating sample for ${voice.name}...`);
      
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
        throw new Error(`Failed to generate audio for ${voice.name}: ${await response.text()}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const audioFile = new File([audioBuffer], `${voice.id}.mp3`, {
        type: 'audio/mpeg',
      });

      console.log(`Uploading sample for ${voice.name}...`);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('voice-samples')
        .upload(`${voice.id}.mp3`, audioFile, {
          contentType: 'audio/mpeg',
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Failed to upload ${voice.name} sample: ${uploadError.message}`);
      }

      console.log(`Inserting database record for ${voice.name}...`);

      // Insert record in voice_samples table
      const { error: dbError } = await supabase
        .from('voice_samples')
        .insert({
          voice_id: voice.id,
          voice_name: voice.name,
          description: voice.description,
          sample_path: `${voice.id}.mp3`
        });

      if (dbError) {
        throw new Error(`Failed to insert database record for ${voice.name}: ${dbError.message}`);
      }

      console.log(`Successfully processed ${voice.name}`);
    }

    return new Response(
      JSON.stringify({ message: 'Voice samples generated and uploaded successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
