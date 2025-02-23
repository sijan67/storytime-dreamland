import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { fal } from "https://esm.sh/@fal-ai/client"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SYSTEM_PROMPT = `Generate a bedtime story in JSON format, split into 15-second segments. Each segment must include:
1. "text": A concise story paragraph (1-2 sentences).
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
      console.log(`Processing segment ${index + 1}/${story.segments.length}`)

      try {
        // Generate image using FAL.ai client library
        const imageResult = await fal.subscribe("fal-ai/flux-pro/v1.1-ultra", {
          input: {
            prompt: segment.image_description,
            image_size: {
              width: 768,
              height: 768
            },
            num_inference_steps: 25,
            guidance_scale: 7.5,
          }
        });

        if (!imageResult.data || !imageResult.data.images || !imageResult.data.images[0]) {
          throw new Error('No image was generated');
        }

        // Generate narration using ElevenLabs
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
        })

        if (!narrationResponse.ok) {
          const error = await narrationResponse.text()
          console.error('ElevenLabs API error:', error)
          throw new Error(`ElevenLabs API error: ${error}`)
        }

        const narrationArrayBuffer = await narrationResponse.arrayBuffer()
        const narrationBase64 = btoa(String.fromCharCode(...new Uint8Array(narrationArrayBuffer)))
        console.log(`Generated narration for segment ${index + 1}`)

        // Generate ambient sound using mock data for now
        const ambienceBase64 = ''  // Empty for now to avoid errors

        return {
          ...segment,
          imageUrl: imageResult.data.images[0].url,
          narrationAudio: narrationBase64,
          ambienceAudio: ambienceBase64,
        }
      } catch (error) {
        console.error(`Error processing segment ${index + 1}:`, error)
        throw error
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
