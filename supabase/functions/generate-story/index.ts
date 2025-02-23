import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { fal } from "https://esm.sh/@fal-ai/client"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SYSTEM_PROMPT = `Generate a bedtime story in JSON format, split into 4 segments (beginning, development, climax, and resolution). Each segment must include:
1. "text": A rich story paragraph (3-4 sentences).
2. "image_description": A detailed visual description for image generation.
3. "audio_ambience": Suggested background sound (e.g., "rain", "forest").
4. "interaction_point": Boolean flag if this segment allows chatting with a character.

Structure:
{
  "title": "Story Title",
  "segments": [
    {
      "text": "...",
      "image_description": "...",
      "audio_ambience": "...",
      "interaction_point": false
    }
  ]
}`

// Configure fal client
fal.config({
  credentials: Deno.env.get('FAL_AI_KEY')
});

// Helper function to handle image generation with retries
async function generateImage(prompt: string, retries = 3): Promise<string> {
  try {
    console.log(`Attempting to generate image with FAL.ai. Prompt: "${prompt.substring(0, 50)}..."`);

    const result = await fal.subscribe("fal-ai/flux-pro/v1.1-ultra", {
      input: {
        prompt,
        image_size: {
          width: 768,
          height: 768
        },
        num_inference_steps: 25,
      },
      pollInterval: 1000,
      maxRetries: 3,
      timeout: 60000,
    });

    console.log('FAL.ai response:', JSON.stringify(result, null, 2));

    if (!result?.data?.images?.[0]?.url) {
      throw new Error('No image URL in response');
    }

    console.log('Successfully generated image:', result.data.images[0].url);
    return result.data.images[0].url;
  } catch (error) {
    if (retries > 0) {
      console.log(`FAL.ai error: ${error.message}`);
      console.log(`Retrying image generation. Attempts remaining: ${retries - 1}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return generateImage(prompt, retries - 1);
    }
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { context, voiceId } = await req.json()
    console.log('Generating story with context:', context, 'voiceId:', voiceId)

    if (!context || !voiceId) {
      throw new Error('Missing required parameters: context and voiceId are required')
    }

    // 1. Generate story structure with GPT
    const storyResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Create a story about: ${context}` }
        ],
      }),
    })

    if (!storyResponse.ok) {
      const error = await storyResponse.text()
      console.error('OpenAI API error:', error)
      throw new Error(`OpenAI API error: ${error}`)
    }

    const storyData = await storyResponse.json()
    const story = JSON.parse(storyData.choices[0].message.content)
    console.log('Generated story structure:', story)

    // 2. Generate images and audio for each segment
    const processedSegments = await Promise.all(story.segments.map(async (segment, index) => {
      console.log(`\n=== Processing segment ${index + 1}/${story.segments.length} ===`);

      try {
        // Generate image
        const imageUrl = await generateImage(segment.image_description);

        // Add delay between segments
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Generate narration using ElevenLabs
        console.log(`Generating narration for segment ${index + 1}. Text length: ${segment.text.length} characters`);
        console.log('ElevenLabs request payload:', JSON.stringify({
          text: segment.text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          }
        }, null, 2));

        const narrationResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: {
            'xi-api-key': Deno.env.get('ELEVEN_LABS_API_KEY') || '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: segment.text,
            model_id: "eleven_monolingual_v1",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5,
            }
          }),
        });

        if (!narrationResponse.ok) {
          const errorText = await narrationResponse.text();
          console.error('ElevenLabs API error response:', errorText);
          throw new Error(`ElevenLabs API error: ${errorText}`);
        }

        console.log(`Successfully generated narration for segment ${index + 1}`);
        console.log('ElevenLabs response status:', narrationResponse.status);
        console.log('ElevenLabs response headers:', JSON.stringify(Object.fromEntries(narrationResponse.headers.entries()), null, 2));

        const narrationArrayBuffer = await narrationResponse.arrayBuffer();
        const narrationBase64 = btoa(String.fromCharCode(...new Uint8Array(narrationArrayBuffer)));
        console.log(`Generated narration audio. Base64 length: ${narrationBase64.length}`);

        return {
          ...segment,
          imageUrl,
          narrationAudio: narrationBase64,
          ambienceAudio: '',
        }
      } catch (error) {
        console.error(`Error processing segment ${index + 1}:`, error);
        console.error('Full error details:', error);
        throw error;
      }
    }))

    const finalStory = {
      ...story,
      segments: processedSegments,
    }

    console.log('Story generation complete')

    return new Response(
      JSON.stringify(finalStory),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating story:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
