
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { context, voiceId } = await req.json()
    console.log('Generating story with context:', context)

    // 1. Generate story structure with GPT
    const storyResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Create a story about: ${context}` }
        ],
      }),
    })

    if (!storyResponse.ok) {
      throw new Error(`OpenAI API error: ${await storyResponse.text()}`)
    }

    const storyData = await storyResponse.json()
    const story = JSON.parse(storyData.choices[0].message.content)
    console.log('Generated story structure:', story)

    // 2. Generate images and audio for each segment
    const processedSegments = await Promise.all(story.segments.map(async (segment, index) => {
      // Generate image using FAL.ai
      const imageResponse = await fetch('https://110602490-studio-flux-pro.gateway.alpha.fal.ai/', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${Deno.env.get('FAL_AI_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: segment.image_description,
        }),
      })

      if (!imageResponse.ok) {
        throw new Error(`FAL.ai API error: ${await imageResponse.text()}`)
      }

      const imageData = await imageResponse.json()
      console.log(`Generated image for segment ${index}`)

      // Generate narration using ElevenLabs
      const narrationResponse = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
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
        throw new Error(`ElevenLabs API error: ${await narrationResponse.text()}`)
      }

      const narrationArrayBuffer = await narrationResponse.arrayBuffer()
      const narrationBase64 = btoa(String.fromCharCode(...new Uint8Array(narrationArrayBuffer)))

      // Generate ambient sound using ElevenLabs sound effects
      const ambienceResponse = await fetch('https://api.elevenlabs.io/v1/text-to-sound-effects', {
        method: 'POST',
        headers: {
          'xi-api-key': Deno.env.get('ELEVEN_LABS_API_KEY') || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: segment.audio_ambience,
        }),
      })

      if (!ambienceResponse.ok) {
        throw new Error(`ElevenLabs Sound Effects API error: ${await ambienceResponse.text()}`)
      }

      const ambienceArrayBuffer = await ambienceResponse.arrayBuffer()
      const ambienceBase64 = btoa(String.fromCharCode(...new Uint8Array(ambienceArrayBuffer)))

      return {
        ...segment,
        imageUrl: imageData.image,
        narrationAudio: narrationBase64,
        ambienceAudio: ambienceBase64,
      }
    }))

    const finalStory = {
      ...story,
      segments: processedSegments,
    }

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
