
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const name = formData.get('name')
    const description = formData.get('description')

    if (!file || !name) {
      throw new Error('Missing required parameters')
    }

    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': Deno.env.get('ELEVEN_LABS_API_KEY') || '',
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to clone voice')
    }

    const data = await response.json()

    return new Response(
      JSON.stringify({ voice_id: data.voice_id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
